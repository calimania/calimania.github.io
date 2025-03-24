const {
  BASE_URL,
  PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRAPI_URL,
  STORE_SLUG,
  COLOR_PRIMARY,
  COLOR_ACCENT,
  POSTHOG_ID,
} = import.meta.env;

/**
 * @type {Record<string, string | Record<string,string>>} Markket Configuration attributes
 */
export const markketplace: Record<string, string | Record<string,string>> = {
  STRAPI_URL: (STRAPI_URL || '').replace(/\/$/, '') || 'https://api.markket.place',
  STORE_SLUG: (STORE_SLUG as string) || 'calima',
  colors: {
    primary: COLOR_PRIMARY as string || '#0067ff',
    accent: COLOR_ACCENT as string || '#38b2ac',
  },
  POSTHOG_ID: POSTHOG_ID as string || '',
  url: BASE_URL.startsWith('http') ? BASE_URL : 'https://caliman.org/',
  STRIPE_PUBLISHABLE_KEY: PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};
