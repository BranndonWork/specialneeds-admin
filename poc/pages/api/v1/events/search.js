import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  const queryString = new URLSearchParams(req.query).toString();
  const url = buildEndpoint(`/events/search/${queryString ? '?' + queryString : ''}`);

  try {
    const data = await fetch(url).then(r => r.json());
    res.setHeader('Cache-Control', 'no-cache, no-store');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
