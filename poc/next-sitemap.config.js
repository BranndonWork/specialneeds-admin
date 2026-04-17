/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_HOST
    ? `https://${process.env.NEXT_PUBLIC_HOST}`
    : 'https://www.specialneeds.com',

  generateRobotsTxt: true,
  outDir: './public',
  generateIndexSitemap: true,  // auto-creates sitemap-0.xml, sitemap-1.xml, etc. when URLs exceed per-file limit
  trailingSlash: true,

  exclude: [
    // Auth / utility pages
    '/login',
    '/logout',
    '/forgot-password',
    '/reset-password',
    '/blocked',
    '/offline',
    '/waitlist',
    // Sections excluded pending system fixes (separate tickets)
    '/virtual-authors',
    '/virtual-authors/*',
    '/authors',
    '/authors/*',
    '/events',
    '/events/*',
    // Component files incorrectly co-located in pages/ — not real routes
    '/checkout/CheckoutForm',
    '/checkout/useCheckout',
    '/directory/components',
    '/directory/components/*',
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/login/',
          '/logout/',
          '/forgot-password/',
          '/reset-password/',
        ],
      },
    ],
    additionalSitemaps: [],
  },

  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/articles/')) {
      priority = 0.8;
      changefreq = 'weekly';   // new articles published frequently; individual ones stable but section active
    } else if (path.startsWith('/directory/')) {
      priority = 0.8;
      changefreq = 'monthly';  // listings are stable once created
    } else if (['/about/', '/faq/', '/privacy-policy/', '/terms-and-conditions/'].includes(path)) {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  additionalPaths: async (config) => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://api.specialneeds.com';

    const fetchPaths = async (endpoint, changefreq) => {
      try {
        const res = await fetch(`${base}${endpoint}`);
        if (!res.ok) return [];
        const items = await res.json();
        return items.map(item => ({
          loc: `/${item.slug}/`,
          lastmod: item.updated_at,
          changefreq,
          priority: 0.8,
        }));
      } catch (err) {
        console.error(`[next-sitemap] ${endpoint} fetch failed:`, err.message);
        return [];
      }
    };

    const sources = [
      { endpoint: '/api/v1/articles/sitemap/', changefreq: 'weekly' },
      { endpoint: '/api/v1/listings/sitemap/', changefreq: 'monthly' },
    ];

    const results = await Promise.all(sources.map(s => fetchPaths(s.endpoint, s.changefreq)));
    const paths = results.flat();

    console.log(`[next-sitemap] additionalPaths: ${paths.length} paths (${sources.length} sources active)`);
    return paths;
  },
};
