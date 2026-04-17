// ./pages/api/server/v1/listing/index.js
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import withInternalHeaders from "@utils/server/api/withInternalHeaders";

const endpoint = "/api/server/v1/listing/";
const LISTING_CACHE_TTL = 2; // Keep the cache for this many seconds before checking for changes from the API.

const handler = async (req, res) => {
  try {
    let response = null;
    const api = new SpecialNeedsAPI({ req, res });
    switch (req.method) {
      case "GET":
        const start = new Date();
        const { id, slug } = req.query;
        if (id) {
          response = await api.query(`listings/${id}/`, "GET");
        } else if (slug) {
          response = await api.query(`listings/display/${slug}/`, "GET");
        } else {
          res.status(400).json({ error: "Missing id." });
          break;
        }

        if (response?.status == 404) {
          console.log("LISTING NOT FOUND", { response, endpoint });
          res.status(404).json({ error: "Listing not found." });
          break;
        }

        if (response?.error) throw new Error(response.error);
        const duration = new Date() - start;
        res.setHeader("X-Response-Time", duration);
        res.setHeader("Cache-Control", `public, max-age=${LISTING_CACHE_TTL}`);
        res.status(200).json(response?.data || response);
        break;
      case "POST":
        response = await api.query("listings", "PUT", req.body);
        if (response?.error) {
          res.status(500).json({ errorMessage: "Internal server error.", error: response.error });
        } else if (!response?.response) {
          res.status(500).json({ errorMessage: "Internal server error.", error: "No response." });
        }
        res.status(200).json(response.response);
        break;
      default:
        res.status(405).json({ error: "Method not allowed." });
        break;
    }
  } catch (error) {
    console.error(`Error in ${endpoint}: ${error}`);
    res.status(500).json({ errorMessage: "Internal server error.", error: error.message });
  }
};

export default withInternalHeaders(handler);
