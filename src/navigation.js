import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
      // links: [
      //   {
      //     text: 'SaaS',
      //     href: getPermalink('/homes/saas'),
      //   },
      //   {
      //     text: 'Startup',
      //     href: getPermalink('/homes/startup'),
      //   },
      //   {
      //     text: 'Mobile App',
      //     href: getPermalink('/homes/mobile-app'),
      //   },
      //   {
      //     text: 'Personal',
      //     href: getPermalink('/homes/personal'),
      //   },
      // ],
    },
    {
      text: 'About us',
      href: getPermalink('/about'),
    },
    // {
    // text: 'Pages',
    // links: [
        // {
        //   text: 'Features (Anchor Link)',
        //   href: getPermalink('/#features'),
        // },
        // {
        //   text: 'Services',
        //   href: getPermalink('/services'),
        // },
        // {
        //   text: 'Pricing',
        //   href: getPermalink('/pricing'),
        // },
    // {
    //   text: 'About us',
    //   href: getPermalink('/about'),
    // },
        // {
        //   text: 'Contact',
        //   href: getPermalink('/contact'),
        // },
    // ],
    // },
    // {
    //   text: 'Landing',
    //   links: [
    //     {
    //       text: 'Lead Generation',
    //       href: getPermalink('/landing/lead-generation'),
    //     },
    //     {
    //       text: 'Long-form Sales',
    //       href: getPermalink('/landing/sales'),
    //     },
    //     {
    //       text: 'Click-Through',
    //       href: getPermalink('/landing/click-through'),
    //     },
    //     {
    //       text: 'Product Details (or Services)',
    //       href: getPermalink('/landing/product'),
    //     },
    //     {
    //       text: 'Coming Soon or Pre-Launch',
    //       href: getPermalink('/landing/pre-launch'),
    //     },
    //     {
    //       text: 'Subscription',
    //       href: getPermalink('/landing/subscription'),
    //     },
    //   ],
    // },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    // {
    //   text: 'Blog',
    //   links: [
    //     {
    //       text: 'Blog List',
    //       href: getBlogPermalink(),
    //     },
    //     {
    //       text: 'Article',
    //       href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
    //     },
    //     {
    //       text: 'Article (with MDX)',
    //       href: getPermalink('markdown-elements-demo-post', 'post'),
    //     },
    //     {
    //       text: 'Category Page',
    //       href: getPermalink('tutorials', 'category'),
    //     },
    //     {
    //       text: 'Tag Page',
    //       href: getPermalink('astro', 'tag'),
    //     },
    //   ],
    // },
    // {
    //   text: 'Join',
    //   href: '#',
    // },
  ],
  // actions: [{ text: 'Download', href: 'https://github.com/onwidget/astrowind', target: '_blank' }],
};

export const footerData = {
  links: [
    // {
    //   title: 'Platform',
    //   links: [
    //     { text: 'Developer API', href: '#' },
    //     { text: 'Partners', href: '#' },
    //     { text: 'Atom', href: '#' },
    //     { text: 'Electron', href: '#' },
    //     { text: 'AstroWind Desktop', href: '#' },
    //   ],
    // },
    // {
    //   title: 'Support',
    //   links: [
    //     {
    //       text: 'Terms',
    //       href: getPermalink('/terms'),
    //     },
    //     {
    //       text: 'Privacy policy',
    //       href: getPermalink('/privacy'),
    //     },
    //   ],
    // links: [
    //   { text: 'Docs', href: '#' },
    //   { text: 'Community Forum', href: '#' },
    //   { text: 'Professional Services', href: '#' },
    //   { text: 'Skills', href: '#' },
    //   { text: 'Status', href: '#' },
    // ],
    // },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Partnerships', href: '/about/partners' },
        { text: 'Blog', href: '/blog' },
        { text: 'Communities', href: '/communities' },
        { text: 'Code of Conduct', href: '/code-of-conduct' },
    //     { text: 'Press', href: '#' },
    //     { text: 'Inclusion', href: '#' },
    //     { text: 'Social Impact', href: '#' },
    //     { text: 'Shop', href: '#' },
      ],
    },
    // {
    //   title: 'Events',
    //   links: [
    //     { text: 'Inaugural Summit - June\'5-6', href: '/summit/2024/brooklyn' },
    //     // { text: 'Happy Hour - March\'27', href: 'https://lu.ma/calima-hh-march' },

    //   ],
    // },
    {
      title: 'Services & Projects',
      links: [
        // { text: 'Xcelerator Business summit', href: '/2024/xcelerator/' },
        // { text: 'Startup Weekend Latinx 2024', href: '/2024/startup-weekend-hhm' },
        { text: 'Markket.place', href: '/2024/markketplace' },
        { text: 'Sanar EHR', href: '/2024/calima-ehr' },
        { text: 'Community Summit 2025', href: '/summit/2025' },
        { text: 'Club San Fernando NYS', href: '/san_fernando_notion' },
        { text: 'Fractional Executives', href: '/2024/fractional-executives' },
        { text: 'The Germinator Colombia', href: '/redirect/germinator' },
      ]
    },
    {
      title: 'Locations',
      links: [
        { text: 'Cali', href: '/cali' },
        { text: 'Cohoes', href: '/cohoes' },
        { text: 'Troy', href: '/troy' },
        { text: 'Jersey City', href: '/jersey-city' },
        { text: 'Brooklyn', href: '/brooklyn' },
        { text: 'Chicago', href: '/chicago' }
      ]
    }
  ],
  secondaryLinks: [
    { text: 'Terms & Policies', href: getPermalink('/terms') },
    {
      text: 'Documentation', href: getPermalink('/docs'),
    },
  ],
  socialLinks: [
    // { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/calimasc/' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://linkedin.com/company/caliman/' },
    { ariaLabel: 'LinkedIn Group', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/groups/12950275/' },
    { ariaLabel: 'Lu.ma', icon: 'tabler:calendar-event', href: 'https://lu.ma/calima' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/calimania/calimania.github.io' },
    { ariaLabel: 'CrunchBase', icon: 'tabler:brand-crunchbase', href: 'https://www.crunchbase.com/organization/kalima-d4f6' },
  ],
  footNote: `
    Made by <a class="text-blue-600 hover:underline dark:text-gray-200" href="#/"> Calima</a> · All rights reserved.
  `,
};
