// @ts-nocheck
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { pathToFileURL } from "node:url";

export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react()];

  // Only load the admin CMS server middleware when running dev/preview server
  if (command === "serve") {
    try {
      const pluginFilePath = path.resolve(process.cwd(), "server/apiPlugin.js");
      const pluginUrl = pathToFileURL(pluginFilePath).href;
      const { adminApiPlugin } = await import(/* @vite-ignore */ pluginUrl);
      plugins.push(adminApiPlugin());
    } catch (err) {
      console.error("[vite] Admin API plugin load error:", err);
    }
  }

  return {
    plugins
  };
});
