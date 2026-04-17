// ./pages/api/v1/listing/search.js
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import withInternalHeaders from "@utils/server/api/withInternalHeaders";

const endpoint = "/api/v1/listing/search/";

const handler = async (req, res) => {
  const api = new SpecialNeedsAPI({ req, res });
  try {
    switch (req.method) {
      case "POST":
        const response = await api.query("listings/search", "POST", req.body);

        if (response?.data) {
          // Set cache headers - let CDN and browser handle caching
          res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
          res.status(200).json(response.data);
        } else {
          res.status(500).json({ errorMessage: "Failed to fetch search results." });
        }
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
