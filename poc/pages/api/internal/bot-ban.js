import getRedisClient from "../../../lib/redis";
import { recordBan, isBanned, banKey } from "../../../lib/bot-guard";

// This route is only callable from middleware via the shared secret.
// Never expose INTERNAL_BAN_SECRET publicly (no NEXT_PUBLIC_ prefix).
const validateSecret = (req) =>
  req.headers["x-internal-secret"] === process.env.INTERNAL_BAN_SECRET?.trim();

const handler = async (req, res) => {
  if (!validateSecret(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const redis = getRedisClient();
  const { action, ip, path } = req.body || {};

  if (!ip) return res.status(400).json({ error: "Missing ip" });

  if (req.method === "POST" && action === "ban") {
    await recordBan(redis, ip, path);
    return res.status(200).json({ banned: true });
  }

  if (req.method === "POST" && action === "check") {
    const banned = await isBanned(redis, ip);
    return res.status(200).json({ banned });
  }

  if (req.method === "POST" && action === "unban") {
    await redis.del(banKey(ip));
    return res.status(200).json({ unbanned: true });
  }

  return res.status(400).json({ error: "Invalid action" });
};

export default handler;
