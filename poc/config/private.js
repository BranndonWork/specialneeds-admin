// ./config/private.js

const privateConfig = {
  apiEndpoint: process.env.API_ENDPOINT,
  serverToken: process.env.SERVER_TO_SERVER_TOKEN || "",
  jwtSecret: process.env.JWT_SECRET_KEY,
  cacheBuster: process.env.CACHE_BUSTER,

  CLOUDFLARE_R2_API_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_API_ACCESS_KEY_ID,
  CLOUDFLARE_R2_API_ACCESS_KEY_SECRET: process.env.CLOUDFLARE_R2_API_ACCESS_KEY_SECRET,
  CLOUDFLARE_BASE_URL: process.env.CLOUDFLARE_BASE_URL,
  CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
  CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
};

export default privateConfig;
