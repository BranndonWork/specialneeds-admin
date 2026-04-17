import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  const { slot, category, page_url } = req.query;

  const params = new URLSearchParams({ slot });
  if (category) params.set('category', category);
  if (page_url) params.set('page_url', page_url);

  try {
    const upstream = await fetch(buildEndpoint(`/ads/?${params}`));
    const data = await upstream.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ad: null });
  }
}
