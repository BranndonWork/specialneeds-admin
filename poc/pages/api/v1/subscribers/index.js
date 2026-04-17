import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const url = buildEndpoint("/subscribers/");
  console.log("[api/v1/subscribers] POST", url, req.body);

  try {
    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await apiRes.json();
    console.log("[api/v1/subscribers] response", apiRes.status, data);

    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("[api/v1/subscribers] error", err.message);
    return res.status(500).json({ error: err.message });
  }
}
