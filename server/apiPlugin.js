import { handleApiRequest } from "./apiRouter.js";

export function adminApiPlugin() {
  return {
    name: "admin-api-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/api")) {
          return handleApiRequest(req, res);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/api")) {
          return handleApiRequest(req, res);
        }
        next();
      });
    }
  };
}

