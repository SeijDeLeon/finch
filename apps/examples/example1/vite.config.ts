import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served at /finch/example1/ in the combined Pages site; at / when run standalone.
export default defineConfig(({ command }) => ({
    plugins: [react()],
    base: command === 'build' ? '/finch/example1/' : '/',
    resolve: {
        // @blueskyproject/finch is a `file:` link to the repo root, so its own imports of these
        // packages would otherwise resolve from the root node_modules and load a second copy
        // (invalid hook calls, missing router/query context).
        dedupe: ['react', 'react-dom', 'react-router', '@tanstack/react-query'],
    },
    // Stop Vite from picking up the repo root's Tailwind postcss.config.js.
    css: { postcss: {} },
    // Finch's plot components pull in plotly.js (~4.5 MB), which dominates the bundle.
    build: { chunkSizeWarningLimit: 6000 },
}));
