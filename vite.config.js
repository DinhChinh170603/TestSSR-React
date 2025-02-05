import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  esbuild: {
    loader: "jsx", // Đảm bảo xử lý JSX
    include: /src\/.*\.[tj]sx?$/, // Xử lý file .js, .jsx, .ts, .tsx
    exclude: /node_modules/, // Loại trừ node_modules
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
  build: {
    ssr: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/server.jsx"),
      external: ["react-dom/server", "react-router-dom/server"],
    },
  },
});
