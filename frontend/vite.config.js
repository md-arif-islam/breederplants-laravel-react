import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/dist/", // This makes asset URLs absolute, e.g. "/dist/assets/index-XYZ.js"
    plugins: [react()],
    server: {
        host: true,
    },
    build: {
        outDir: "../public/dist",
        emptyOutDir: true,
    },
});
