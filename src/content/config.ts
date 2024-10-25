import { z, defineCollection } from 'astro:content';
import dayjs from 'dayjs';
import slug from 'limax';

const ContentSchema: z.ZodType<Content> = z.lazy(() => z.object({
  type: z.string(),
  children: z.array(z.lazy(() => ContentSchema)),
  url: z.string().optional(),
  text: z.string().optional(),
}));

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

type Content = {
  type: string,
  children: Content[],
  url?: string,
  text?: string,
  modifier?: string,
}

type API_Article = {
  id: string,
  attributes: {
    Title: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    Content: Content[],
    SEO: {
      metaTitle: string,
      metaDescription: string,
      metaKeywords: string,
      socialImage: {
        data: {
          id: number,
          attributes: {
            url: string,
            width: number,
            height: number,
          },
        }
      },
      metaUrl: string,
      metaAuthor: string,
    },
    Tags: {
      Label: string,
      Color: string,
    }[],
    cover: {
      url: string,
    },
  }
};


// 4ZK8y6ymSK2NaEu - markket@caliman.org
// wBdmAXj6umFQDR6 - markket@caliman.org

/**
 * The following collection requests data from our API, we use it to insert additional blog posts from the Calima Markket content API
 * https://api.morirsoniando.com/api/stores/2?populate=*
 * @TODO: Change the URL To point to your STRAPI source
 */
const StrapiPosts = defineCollection({
// https://api.morirsoniando.com/api/stores/2?populate[0]=articles&populate[1]=articles.SEO&populate[2]=SEO
  loader: async () => {
    const response = await fetch("https://api.morirsoniando.com/api/stores/2?populate[0]=articles&populate[1]=articles.SEO&populate[2]=articles.Tags&populate[3]=articles.SEO.socialImage");
    const data = await response.json();

    return (data.data?.attributes?.articles?.data || []).map((article: API_Article) => {

      const publishDate = article.attributes?.createdAt ? dayjs(article.attributes.createdAt).toDate() : null;
      const updateDate = article.attributes?.updatedAt ? dayjs(article.attributes.updatedAt).toDate() : null;
      const image = article.attributes.cover?.url || article.attributes.SEO.socialImage.data.attributes.url || '';
      const permalink = `post/${article.id}/${slug(article.attributes.Title)}`;
      const _slug = slug(article.attributes.Title);

      console.log({ _slug, b: article.attributes });

      return {
        source: 'api',
        id: `calima-api-${article.id}` as string,
        title: article.attributes.Title,
        content: article.attributes.Content || [],
        excerpt: article.attributes.SEO.metaDescription || '',
        image,
        category: 'api',
        author: article.attributes.SEO.metaAuthor || 'Calima API',
        publishDate,
        updateDate,
        tags: article.attributes.Tags.map((tag) => tag.Label),
        draft: !article.attributes.publishedAt,
        slug: _slug,
        permalink,
        metadata: {
          title: article.attributes.SEO.metaTitle || article.attributes.Title,
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
    source: z.string(),
    slug: z.string(),
    permalink: z.string(),
    content: z.array(z.object({})).optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});


export const collections = {
  post: postCollection,
  strapiPosts: StrapiPosts,
};
