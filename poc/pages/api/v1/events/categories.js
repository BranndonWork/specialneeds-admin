import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  const queryString = new URLSearchParams(req.query).toString();
  const url = buildEndpoint(`/events/categories/${queryString ? '?' + queryString : ''}`);

  try {
    const data = await fetch(url).then(r => r.json());
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
