import { verifySolution } from 'altcha-lib';
import buildEndpoint from '@utils/server/api/buildEndpoint';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { altcha, website_url, ...claimData } = req.body;

  // Honeypot — bots fill hidden fields, humans don't
  if (website_url) return res.status(200).json({ status: 'pending' });

  // Altcha validation
  if (!altcha) return res.status(422).json({ error: 'Missing captcha solution' });

  const valid = await verifySolution(altcha, process.env.ALTCHA_HMAC_KEY);
  if (!valid) return res.status(422).json({ error: 'Invalid captcha solution' });

  const { id } = req.query;
  const url = buildEndpoint(`/listings/${id}/claim/`);

  try {
    const djangoRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData),
    });
    const data = await djangoRes.json();
    return res.status(djangoRes.status).json(data);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
