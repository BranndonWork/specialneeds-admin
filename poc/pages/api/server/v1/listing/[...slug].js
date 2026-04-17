// ./pages/api/v1/listing/index.js
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import withInternalHeaders from "@utils/server/api/withInternalHeaders";

const endpoint = "/api/v1/listing/parent-cat/child-cat/listing-title/";

const LISTING_CACHE_TTL = 60 * 60;

async function handler(req, res) {
  const slug = req.query.slug.join("/");
  const api = new SpecialNeedsAPI({ req, res });
  try {
    switch (req.method) {
      case "GET":
        const response = await api.query(`/listings/display/${slug}/`, "GET");
        if (response?.error) throw new Error(response.error);
        // Set cache headers - let CDN and browser handle caching
        res.setHeader(
          "Cache-Control",
          `public, max-age=${LISTING_CACHE_TTL}, stale-while-revalidate`
        );
        res.status(200).json(response?.data || response);
        break;
      default:
        res.status(405).json({ error: "Method not allowed." });
        break;
    }
  } catch (error) {
    console.error(`Error in ${endpoint}: ${error}`);
    const message = error.message || error || "Unknown error.";
    res.status(500).json({ errorMessage: "Internal server error.", error: message });
  }
}

export default withInternalHeaders(handler);
