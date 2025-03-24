/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "astro:content";
import type { Loader } from "astro/loaders";
import type { ZodTypeAny, ZodObject } from "zod";

import { markketplace } from "../markket.config";


const { STRAPI_URL: STRAPI_BASE_URL, STORE_SLUG } = markketplace;
const SYNC_INTERVAL = 1 * 1000; // 1 minute in milliseconds

/**
 * Creates a Strapi content loader for Astro
 * @param contentType The Strapi content type to load
 * @param filter The filter to apply to the content &filters[store][id][$eq]=${STRAPI_STORE_ID}
 * @returns An Astro loader for the specified content type
 */
export function strapiLoader({ contentType, filter, populate = 'SEO.socialImage', paginate }: { contentType: string, filter?: string, populate?: string, paginate?: { limit: number } }): Loader {
  return {
    name: `strapi-${contentType}`,

    load: async function (this: Loader, { store, meta, logger }) {
      const lastSynced = meta.get("lastSynced");
      const lastSlug = meta.get("lastSlug");

      // Avoid frequent syncs
      if (lastSynced && Date.now() - Number(lastSynced) < SYNC_INTERVAL) {
        if (lastSlug !== STORE_SLUG) {
          logger.info("Store slug has changed, forcing sync");
        } else {
          logger.info("Skipping Strapi sync");
        return;
        }
      }

      meta.set("lastSlug", STORE_SLUG as string);
      logger.info(`FETCHING STRAPI CONTENT: ${STRAPI_BASE_URL}:${STORE_SLUG}:${contentType}`);

      try {
        // Fetch and store the content
        let filterKey = '', filterValue = '';

        if (filter) {
          [filterKey, filterValue] = filter.split('=');
        }

        const data = await fetchFromStrapi(`/api/${contentType}s?`, {
          [filterKey]: filterValue,
          populate,
          'pagination[limit]': (paginate?.limit || '') as string || '100',
        });
        let posts = data?.data;

        if (!posts || !Array.isArray(posts)) {
          throw new Error("Invalid data received from Strapi");
        }

        // Sort posts by creation date in descending order
        posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Get the schema
        const schemaOrFn = this.schema;
        if (!schemaOrFn) {
          throw new Error("Schema is not defined");
        }
        const schema =
          typeof schemaOrFn === "function" ? await schemaOrFn() : schemaOrFn;
        if (!(schema instanceof z.ZodType)) {
          throw new Error("Invalid schema: expected a Zod schema");
        }

        type Post = z.infer<typeof schema>;

        store.clear();
        posts.forEach((post: Post) => store.set({ id: post.id, data: post }));

        meta.set("lastSynced", String(Date.now()));
      } catch (error) {
        logger.error(
          `Error loading Strapi content: ${(error as Error).message}`
        );
        throw error;
      }
    },

    schema: async () => {
      const data = await fetchFromStrapi(
        `/get-strapi-schema/schema/${contentType}`
    );
      if (!data?.attributes) {
        throw new Error("Invalid schema data received from Strapi");
      }
      return generateZodSchema(data.attributes);
    },
  };
}

/**
 * Maps Strapi field types to Zod schema types
 * @param type The Strapi field type
 * @param field The field configuration object
 * @returns A Zod schema corresponding to the Strapi field type
 */
function mapTypeToZodSchema(type: string, field: any): ZodTypeAny {
  const schemaMap: Record<string, () => ZodTypeAny> = {
    string: () => z.string(),
    uid: () => z.string(),
    media: () =>
      z.object({
        allowedTypes: z.array(z.enum(field.allowedTypes)),
        type: z.literal("media"),
        multiple: z.boolean(),
        url: z.string(),
        alternativeText: z.string().optional(),
        caption: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    richtext: () => z.string(),
    datetime: () => z.string().datetime(),
    relation: () =>
      z
        .object({
          relation: z.literal(field.relation),
          target: z.literal(field.target),
          configurable: z.boolean().optional(),
          writable: z.boolean().optional(),
          visible: z.boolean().optional(),
          useJoinTable: z.boolean().optional(),
          private: z.boolean().optional(),
        })
        .optional(),
    boolean: () => z.boolean(),
    number: () => z.number(),
    array: () => z.array(mapTypeToZodSchema(field.items.type, field.items)),
    object: () => {
      const shape: Record<string, ZodTypeAny> = {};
      for (const [key, value] of Object.entries(field.properties)) {
        if (typeof value === "object" && value !== null && "type" in value) {
          shape[key] = mapTypeToZodSchema(value.type as string, value);
        } else {
          throw new Error(`Invalid field value for key: ${key}`);
        }
      }
      return z.object(shape);
    },
    text: () => z.string(),
    dynamiczone: () => z.array(z.object({ __component: z.string() })),
  };

  return (schemaMap[type] || (() => z.any()))();
}

/**
 * Generates a Zod schema from Strapi content type attributes
 * @param attributes The Strapi content type attributes
 * @returns A Zod object schema representing the content type
 */
function generateZodSchema(attributes: Record<string, any>): ZodObject<any> {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [key, value] of Object.entries(attributes)) {
    const { type, ...rest } = value;
    shape[key] = mapTypeToZodSchema(type, rest);
  }
  return z.object(shape);
}

/**
 * Fetches data from the Strapi API
 * @param path The API endpoint path
 * @param params Optional query parameters
 * @returns The JSON response from the API
 */
async function fetchFromStrapi(
  path: string,
  params?: Record<string, string>,
  baseUrl?: string
): Promise<any> {

  const url = new URL(path, baseUrl || STRAPI_BASE_URL as string);

  if (params) {
    // Handle populate parameters
    if (params.populate) {
      const populateFields = params.populate.split(',');
      populateFields.forEach((field, index) => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          url.searchParams.append('populate', parent);
          url.searchParams.append(`populate[${index + 1}]`, `${parent}.${child}`);
        } else {
          url.searchParams.append('populate', field);
        }
      });
      delete params.populate;
    }

    // Handle remaining parameters (including filters)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  console.log('Fetching URL:', url.toString());

  try {
    const response = await fetch(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi: ${(error as Error).message}`);
    throw error; // Re-throw the error for the caller to handle
  }
}

// Ensure the required environment variable is set
function checkEnvironmentVariables() {
  if (!STRAPI_BASE_URL) {
    throw new Error("STRAPI_BASE_URL environment variable is not set");
  }
}

// Ensure environment variables are set before proceeding
checkEnvironmentVariables();
