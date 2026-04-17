// ./config/config.js

// IMPORTANT: Do not store any sensitive data (e.g. API keys, passwords, etc) in this file.
import imageMappings from "../public/assets/imageMappings.json";

const config = {
  // endpoints
  // API_ENDPOINT
  private: {
    apiEndpoint: process.env.API_ENDPOINT,
  },

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,

  // site features
  userAuthEnabled: process.env.NEXT_PUBLIC_USER_AUTH_ENABLED === "true",
  listingReviewsEnabled: process.env.NEXT_PUBLIC_LISTING_REVIEWS_ENABLED === "true",
  newsletterEnabled: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false", // default true
  articleFeedbackEnabled: process.env.NEXT_PUBLIC_ARTICLE_FEEDBACK_ENABLED === "true",
  claimListingEnabled: process.env.NEXT_PUBLIC_CLAIM_LISTING_ENABLED === "true",

  // API version configuration
  apiVersion: parseInt(process.env.NEXT_PUBLIC_API_VERSION || "1", 10),

  // other
  env: process.env.NODE_ENV || process.env.NEXT_PUBLIC_ENV || "development",
  host: process.env.NEXT_PUBLIC_HOST,
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  port: process.env.NEXT_PUBLIC_PORT,
  algoliaId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  algoliaPublicKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,

  cloudflare: imageMappings.cloudflare,

  images: imageMappings.images,
};

export default config;
