// ./config/redisConfig.js

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD == "" ? undefined : redisConfig.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
};

export default redisConfig;
