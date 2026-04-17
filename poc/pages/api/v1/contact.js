import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = buildEndpoint('/core/contact/');

  try {
    const djangoRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await djangoRes.json();
    return res.status(djangoRes.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', success: false });
  }
}
