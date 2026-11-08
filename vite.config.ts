import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react()];

  // Only load the admin CMS server middleware when running dev/preview server
  if (command === "serve") {
    try {
      const apiPluginModule = "./server/apiPlugin.js";
      // @ts-ignore
      const { adminApiPlugin } = await import(/* @vite-ignore */ apiPluginModule);
      plugins.push(adminApiPlugin());
    } catch {
      // Dev CMS plugin skipped
    }
  }

  return {
    plugins
  };
});
