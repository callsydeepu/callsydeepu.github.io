import http from "node:http";
import { handleApiRequest } from "./apiRouter.js";

const PORT = parseInt(process.env.PORT || "5174", 10);
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(async (req, res) => {
  try {
    await handleApiRequest(req, res);
  } catch (err) {
    console.error("[CMS Server] Unhandled error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[CMS Server] Backend listening on http://${HOST}:${PORT}`);
  console.log(`[CMS Server] Node version: ${process.version}`);
  console.log(`[CMS Server] Ready to receive API and Admin requests.`);
});

function gracefulShutdown(signal) {
  console.log(`\n[CMS Server] Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log("[CMS Server] HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

