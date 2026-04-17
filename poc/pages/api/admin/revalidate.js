const CACHE_API_URL = process.env.CACHE_API_URL;
const CACHE_API_TOKEN = process.env.CACHE_API_TOKEN;

const toRedisKey = (path) => 'isr:' + path.replace(/^\/|\/$/g, '').replace(/\//g, ':');

async function deleteFromRedisCache(path) {
  if (!CACHE_API_URL || !CACHE_API_TOKEN) return;
  try {
    await fetch(`${CACHE_API_URL}/cache/${toRedisKey(path)}`, {
      method: 'DELETE',
      headers: { 'X-Cache-Token': CACHE_API_TOKEN },
    });
  } catch {
    // best-effort — revalidation still works without this
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-revalidate-token'];
  if (!token || token !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { paths } = req.body;
  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'paths must be a non-empty array of strings' });
  }

  const revalidated = [];
  const failed = [];

  for (const path of paths) {
    try {
      await Promise.all([
        res.revalidate(path),
        deleteFromRedisCache(path),
      ]);
      revalidated.push(path);
    } catch (err) {
      failed.push({ path, error: err.message });
    }
  }

  const status = failed.length > 0 && revalidated.length === 0 ? 500 : 200;
  return res.status(status).json({ revalidated, failed });
}
