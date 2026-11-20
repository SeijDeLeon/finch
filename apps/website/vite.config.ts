import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served at /finch/ in the combined Pages site; at / when run standalone with `npm run dev`.
export default defineConfig(({ command }) => ({
    plugins: [react()],
    base: command === 'build' ? '/finch/' : '/',
    // An inline (empty) PostCSS config stops Vite from picking up the repo root's
    // Tailwind postcss.config.js, which is meant for the Finch library only.
    css: { postcss: {} },
}));
