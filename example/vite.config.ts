import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/react-chicane/",
  build: { sourcemap: true },
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
});
