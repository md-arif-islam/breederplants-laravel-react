import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/dist/",
    plugins: [react()],
    server: {
        host: true,
    },
    build: {
        outDir: "../public/dist",
        emptyOutDir: true,
    },
});

/* import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
});
 */
