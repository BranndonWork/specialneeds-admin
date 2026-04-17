import { createChallenge } from 'altcha-lib';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const challenge = await createChallenge({
    hmacKey: process.env.ALTCHA_HMAC_KEY,
    maxNumber: 100000,
  });

  return res.status(200).json(challenge);
}
