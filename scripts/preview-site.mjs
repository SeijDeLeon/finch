#!/usr/bin/env node
/**
 * Serve site-dist/ under /finch/, the way GitHub Pages serves this project site.
 *
 * Mimics Pages on purpose, so local previews fail where Pages would:
 *   - files are only reachable under /finch/ (a wrong asset base shows up as a 404)
 *   - a directory is served from its index.html; without a trailing slash it 301s to one
 *   - there is NO single-page-app fallback: unknown paths get 404.html (or a plain 404)
 *
 * Usage: npm run build:site && npm run preview:site   (PORT=4173 by default)
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'site-dist');
const PREFIX = '/finch/';
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
    '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(ROOT)) {
    console.error('site-dist/ not found. Run `npm run build:site` first.');
    process.exit(1);
}

function send(res, status, file) {
    res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
}

function notFound(res) {
    const page = join(ROOT, '404.html');
    if (existsSync(page)) return send(res, 404, page);
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 Not Found (no SPA fallback, like GitHub Pages)');
}

createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = decodeURIComponent(url.pathname);

    if (path === '/' || path === '/finch') {
        res.writeHead(301, { Location: PREFIX }).end();
        return;
    }
    if (!path.startsWith(PREFIX)) return notFound(res);

    const file = normalize(join(ROOT, path.slice(PREFIX.length)));
    if (file !== ROOT && !file.startsWith(ROOT + sep)) return notFound(res);
    if (!existsSync(file)) return notFound(res);

    if (statSync(file).isDirectory()) {
        if (!path.endsWith('/')) {
            res.writeHead(301, { Location: `${path}/${url.search}` }).end();
            return;
        }
        const index = join(file, 'index.html');
        return existsSync(index) ? send(res, 200, index) : notFound(res);
    }
    send(res, 200, file);
}).listen(PORT, () => {
    console.log(`Previewing site-dist/ at http://localhost:${PORT}${PREFIX}`);
});
