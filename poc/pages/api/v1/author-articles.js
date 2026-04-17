import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  const { author_slug, page = 1, page_size = 12 } = req.query;

  if (!author_slug) {
    return res.status(400).json({ error: "author_slug is required" });
  }

  const url = buildEndpoint(
    `/articles/?author_slug=${encodeURIComponent(author_slug)}&page=${page}&page_size=${page_size}`
  );

  const data = await fetch(url).then((r) => r.json());

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json(data);
}
