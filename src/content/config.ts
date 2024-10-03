import { z, defineCollection } from 'astro:content';
import dayjs from 'dayjs';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

type API_Article = {
  id: string,
  attributes: {
    Title: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    Content: {
      type: string,
      children: Record<string, string | object>[],
    }[],
  }
};

/**
 * The following collection requests data from an API, we use it to insert additional blog posts from the Calima Markket content API
 */
const remoteCollection = defineCollection({
  loader: async () => {
    const response = await fetch("https://api.morirsoniando.com/api/stores/2?populate=articles");
    const data = await response.json();
    console.log({ data })
    // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    // data.map((country) => ({
    //   id: country.cca3,
    //   ...country,
    // }));
    console.log({ articles: data.data?.attributes?.articles?.data, article: data.data?.attributes?.articles?.data[0] })
    return (data.data?.attributes?.articles?.data || []).map((article: API_Article) => {
      console.log({ id: article.id, article });

      const publishDate = article.attributes?.createdAt ? dayjs(article.attributes.createdAt).toDate() : null;
      const updateDate = article.attributes?.updatedAt ? dayjs(article.attributes.updatedAt).toDate() : null;
      // const publishDate = '';
      // const updateDate = '';

      return {
        id: `calima-api-${article.id}` as string,
        title: article.attributes.Title,
        excerpt: '',
        image: undefined,
        category: '',
        author: 'Calima API',
        publishDate,
        updateDate,
        draft: !article.attributes.publishedAt,
        metadata: {
          title: article.attributes.Title,
          description: '',
          // openGraph: {
          //   images: [
          //     {
          //       url: article.Image,
          //     },
          //   ],
          // },
        },
      };
    });
  },
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});


console.log({ remoteCollection: !!remoteCollection })

export const collections = {
  post: postCollection,
  // strapiPosts: remoteCollection,
};
