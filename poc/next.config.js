// import config from "./config/config";

const path = require("path");

// REWRITES
const rewrites = [
  // Asset proxy rewrites - DISABLED - now handled by service worker
  // {
  //   source: "/assets/:path*",
  //   destination: "/api/v1/assets/proxy/assets/:path*",
  // },
  // {
  //   source: "/images/:path*",
  //   destination: "/api/v1/assets/proxy/images/:path*",
  // },
  // {
  //   source: "/wp-content/:path*",
  //   destination: "/api/v1/assets/proxy/wp-content/:path*",
  // },
];

const prodRewrites = [
  {
    source: "/t/js/script.js",
    destination: "https://plausible.io/js/script.js",
  },
  {
    source: "/t/api/event/",
    destination: "https://plausible.io/api/event",
  },
];

if (
  process.env.NEXT_PUBLIC_HOST === "www.specialneeds.com" ||
  process.env.NEXT_PUBLIC_HOST === "www2.specialneeds.com"
) {
  console.log("PRODUCTION MODE");
  rewrites.push(...prodRewrites);
} else if (process.env.NEXT_PUBLIC_HOST === "staging.specialneeds.com") {
  console.log("STAGING MODE");
} else {
  console.log("DEVELOPMENT MODE", { host: process.env.NEXT_PUBLIC_HOST });
}

const nextConfig = {
  cacheHandler: process.env.CACHE_API_URL
    ? require.resolve('./cache-handler.js')
    : undefined,
  cacheMaxMemorySize: 52428800, // 50MB in-memory LRU for hot pages (404, etc)

  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: { host: process.env.NEXT_PUBLIC_HOST, port: process.env.NEXT_PUBLIC_PORT },
  // Remove console.log in production builds (keep console.error and console.warn)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
    ],
  },
  webpack: (config, { dev }) => {
    // Fix source maps for better debugging in Firefox
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@api': path.join(__dirname, 'pages/api'),
      '@components': path.join(__dirname, 'components'),
      '@config': path.join(__dirname, 'config'),
      '@contexts': path.join(__dirname, 'contexts/index.js'),
      '@data': path.join(__dirname, 'data'),
      '@hoc': path.join(__dirname, 'hoc'),
      '@hooks': path.join(__dirname, 'hooks'),
      '@lib': path.join(__dirname, 'lib'),
      '@pages': path.join(__dirname, 'pages'),
      '@root': path.join(__dirname),
      '@utils': path.join(__dirname, 'utils'),
    };

    return config;
  },
  async redirects() {
    return [
      { source: '/users', destination: '/authors/', permanent: true },
      { source: '/users/', destination: '/authors/', permanent: true },
      { source: '/users/:slug', destination: '/authors/:slug', permanent: true },
    ];
  },
  async rewrites() {
    return rewrites;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
