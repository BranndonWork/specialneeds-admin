// pages/api/[...slug].js

export const serve404 = (res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(404).json({ error: "API route not found" });
};

export default function handler(req, res) {
  return serve404(res);
}
