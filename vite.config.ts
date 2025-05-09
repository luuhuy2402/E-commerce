import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
export default defineConfig({
    plugins: [react(), visualizer()],
    test: {
        environment: "jsdom",
    },
    server: {
        port: 3000,
    },
    css: {
        devSourcemap: true,
    },
});
