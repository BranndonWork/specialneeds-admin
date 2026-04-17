import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const url = buildEndpoint(`/listings/reviews/${id}/`);

  try {
    const data = await fetch(url).then(r => r.json());
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
