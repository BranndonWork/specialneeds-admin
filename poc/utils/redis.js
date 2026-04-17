// utils/redis.js
import redis from "redis";
import redisConfig from "../config/redisConfig";

const client = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
});

client.on("error", (error) => {
  console.error(`Redis error: ${error}`);
});

export default client;
