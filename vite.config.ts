import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import { adminApiPlugin } from "./server/apiPlugin.js";

export default defineConfig({
  plugins: [react(), adminApiPlugin()]
});
