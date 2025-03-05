import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    if (mode === "development") {
        return {
            plugins: [react()],
        };
    }

    return {
        base: "./",
        plugins: [react()],
        server: {
            host: true,
        },
        build: {
            outDir: "./dist", // Keeps the build output inside "dist"
            emptyOutDir: true,
        },
    };
});
