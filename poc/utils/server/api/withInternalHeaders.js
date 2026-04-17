// utils/withInternalHeaders.js

import { serve404 } from "../../../pages/api/[...slug]";

export default function withInternalHeaders(handler) {
  return async function internalHeadersChecker(req, res) {
    const specialNeedsHeader = req.headers["x-specialneeds-internal-request"];
    if (!specialNeedsHeader || specialNeedsHeader !== "true") {
      // Serve a 404 response to obscure the fact that this is an API route
      return serve404(res);
    }

    // If header check passes, call the actual handler
    return handler(req, res);
  };
}
