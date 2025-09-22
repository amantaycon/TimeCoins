import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    global: "globalThis", // 👈 Fix for "global is not defined"
  },
  resolve: {
    alias: {
      util: "rollup-plugin-node-polyfills/polyfills/util", // 👈 Fix util dependency
    },
  },
  optimizeDeps: {
    include: ["sockjs-client", "stompjs"], // 👈 Pre-bundle websocket deps
  },
});
