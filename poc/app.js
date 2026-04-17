/**
 * Custom Next.js server.
 *
 * This server setup is used to create a custom HTTP server for a Next.js application.
 * It uses the built-in HTTP module to listen for requests and the Next.js server to handle them.
 * The server runs in development mode if the NODE_ENV environment variable is not set to 'production'.
 *
 * The hostname and port for the server are determined by environment variables with defaults provided.
 *
 * Upon server preparation, it creates an HTTP server that parses the incoming request URL
 * and uses the Next.js request handler to handle the request. Any errors during request handling
 * are caught and logged, and an internal server error response is sent.
 *
 * If the server encounters an error during its startup, it will log the error and exit the process.
 * Upon successful startup, it logs a ready message with the server's URL.
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV == "development";
const hostname = process.env.NEXT_PUBLIC_HOST;
const port = parseInt(process.env.NEXT_PUBLIC_PORT, 0) || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
