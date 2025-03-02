import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    if (mode === "development") {
        return {
            plugins: [react()],
        };
    }

    return {
        base: "/dist/",
        plugins: [react()],
        server: {
            host: true,
        },
        build: {
            outDir: "../public/dist",
            emptyOutDir: true,
        },
    };
});
