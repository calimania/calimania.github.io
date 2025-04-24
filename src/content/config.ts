import { z, defineCollection, } from 'astro:content';
import dayjs from 'dayjs';
import slug from 'limax';
import type { Content, API_Article } from '~/types.d';
import { strapiLoader } from '~/utils/strapi.loader';
import { markketplace } from '~/markket.config';

/**
 * Define the recursive Content schema compatible with the Strapi Calima API
 */
const ContentSchema: z.ZodType<Content> = z.object({
  type: z.string(),
  children: z.array(z.lazy(() => ContentSchema)).optional(),
  url: z.string().optional(),
  text: z.string().optional(),
  bold: z.boolean().optional(),
})


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

/**
 * The following collection requests data from our API, we use it to insert additional blog posts from the Calima Markket content API
 * https://api.markket.place/api/stores/2?populate=*
 * @TODO: Change the URL To point to your STRAPI source
 */
const StrapiPosts = defineCollection({
  // https://api.markket.place/api/stores/2?populate[0]=articles&populate[1]=articles.SEO&populate[2]=SEO
  loader: async () => {
    const response = await fetch("https://api.markket.place/api/articles?populate=*&filters[store][slug][$eq]=calima&limit=100");
    const data = await response.json();

    return (data?.data || [])
      .filter((article: API_Article) => article?.store?.slug == 'calima')
      .map((article: API_Article) => {
        let publishDate = article.createdAt ? dayjs(article.createdAt).toDate() : null;
        if (article.SEO?.metaDate) {
          publishDate = dayjs(article.SEO.metaDate).toDate();
        }

        const updateDate = article.updatedAt ? dayjs(article.updatedAt).toDate() : publishDate;
        const image = article.cover?.url || article.SEO?.socialImage?.url || '';

        let permalink = `post/${article.id}/${slug(article?.Title)}`;

        if (article.SEO?.metaUrl) {
          permalink = article.SEO.metaUrl;
        }

        const _slug = slug(article.SEO?.metaUrl || article.Title);
        const content = article.Content || [];

        const _article = {
          source: 'api',
          id: `markket-api-${article?.id}` as string,
          title: article.Title,
          content,
          excerpt: article.SEO.metaDescription || '',
          image,
          category: 'api',
          author: article.SEO.metaAuthor || 'Calima via Markket API',
          publishDate,
          updateDate,
          tags: article.Tags.map((tag) => tag.Label),
          draft: !article.publishedAt,
          slug: _slug,
          permalink,
          metadata: {
            title: article.SEO.metaTitle || article.Title,
            description: '',
          },
        };

        return _article;
    });
  },
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    source: z.string(),
    slug: z.string(),
    permalink: z.string(),
    content: z.array(ContentSchema),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const pages = defineCollection({
  loader: strapiLoader({
    contentType: "page",
    filter: `filters[store][slug][$eq]=${markketplace.STORE_SLUG}`,
    populate: 'SEO.socialImage'
  }),
});

const stores = defineCollection({
  loader: strapiLoader({
    contentType: "store",
    filter: `filters[slug][$eq]=${markketplace.STORE_SLUG}`,
    populate: 'SEO.socialImage'
  }),
});

export const collections = {
  post: postCollection,
  strapiPosts: StrapiPosts,
  pages,
  stores,
};
