#!/usr/bin/env node
/**
 * Assemble the public Finch documentation site into site-dist/.
 *
 *   site-dist/             <- apps/website            (landing page)
 *   site-dist/storybook/   <- root `storybook build`  (component docs)
 *   site-dist/<name>/      <- apps/examples/<name>    (one per example folder)
 *
 * Every sub-build writes to its own output folder, which is then copied in, so no
 * step can clobber another's files. Run with `npm run build:site` from the repo root
 * after `npm ci`.
 *
 * Flags:
 *   --skip-install   reuse each app's existing node_modules instead of running `npm ci`
 *                    (faster local rebuilds; CI should not pass this).
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site-dist');
const WEBSITE_DIR = join(ROOT, 'apps', 'website');
const EXAMPLES_DIR = join(ROOT, 'apps', 'examples');
const SKIP_INSTALL = process.argv.includes('--skip-install');

function step(title) {
    console.log(`\n\x1b[1m▶ ${title}\x1b[0m`);
}

function fail(message) {
    console.error(`\n\x1b[31m✖ build:site failed: ${message}\x1b[0m`);
    process.exit(1);
}

function run(command, cwd, env = {}) {
    console.log(`  $ ${command}   (in ${relative(ROOT, cwd) || '.'})`);
    try {
        execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
    } catch {
        fail(`\`${command}\` exited with an error in ${relative(ROOT, cwd) || 'the repo root'}. See the output above.`);
    }
}

/** Install an app's dependencies: `npm ci` when it has a lockfile, unless --skip-install. */
function install(appDir) {
    if (SKIP_INSTALL && existsSync(join(appDir, 'node_modules'))) return;
    const hasLock = existsSync(join(appDir, 'package-lock.json'));
    run(hasLock ? 'npm ci --no-audit --no-fund' : 'npm install --no-audit --no-fund', appDir);
}

/** Copy a finished build into site-dist, refusing to overwrite another app's files. */
function copyInto(fromDir, toDir, label) {
    if (!existsSync(join(fromDir, 'index.html'))) {
        fail(`${label} build produced no index.html in ${relative(ROOT, fromDir)}.`);
    }
    if (toDir !== OUT && existsSync(toDir)) {
        fail(`${label} would overwrite existing site-dist/${relative(OUT, toDir)}. Is a folder name colliding?`);
    }
    cpSync(fromDir, toDir, { recursive: true });
}

// 1. Fresh output folder, cleared once.
step('Clearing site-dist/');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 2. The Finch library itself. Examples depend on it through a `file:` link, so its dist/
//    must be current before they build.
step('Building the Finch library (npm run build)');
run('npm run build', ROOT);

// 3. Landing page at the site root.
step('Building the landing page (apps/website)');
install(WEBSITE_DIR);
run('npm run build', WEBSITE_DIR);
copyInto(join(WEBSITE_DIR, 'dist'), OUT, 'apps/website');

// 4. Storybook under /storybook/. Its production base is /finch/storybook/ (.storybook/main.ts).
step('Building Storybook');
const storybookOut = join(ROOT, 'storybook-static');
run('npm run build-storybook', ROOT, { STORYBOOK_DISABLE_TELEMETRY: '1' });
copyInto(storybookOut, join(OUT, 'storybook'), 'Storybook');

// 5–6. Every folder in apps/examples/ with a package.json, plus its static deep routes.
const examples = existsSync(EXAMPLES_DIR)
    ? readdirSync(EXAMPLES_DIR, { withFileTypes: true })
          .filter((d) => d.isDirectory() && existsSync(join(EXAMPLES_DIR, d.name, 'package.json')))
          .map((d) => d.name)
          .sort()
    : [];
const requiredFiles = ['index.html', 'storybook/index.html'];

for (const name of examples) {
    const appDir = join(EXAMPLES_DIR, name);
    step(`Building example: ${name} -> /finch/${name}/`);

    const viteConfig = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs']
        .map((f) => join(appDir, f))
        .find(existsSync);
    if (!viteConfig || !readFileSync(viteConfig, 'utf8').includes(`/finch/${name}/`)) {
        fail(`apps/examples/${name}: its vite.config must set \`base\` to '/finch/${name}/' for builds.`);
    }

    install(appDir);
    run('npm run build', appDir);
    const target = join(OUT, name);
    copyInto(join(appDir, 'dist'), target, `apps/examples/${name}`);
    requiredFiles.push(`${name}/index.html`);

    // GitHub Pages has no SPA fallback, so each known client route gets its own copy of the
    // app's index.html. Assets are referenced absolutely (/finch/<name>/assets/...), so the
    // copies load the same bundle and React Router renders the right page from the URL.
    const routesFile = join(appDir, 'static-routes.json');
    const routes = existsSync(routesFile) ? JSON.parse(readFileSync(routesFile, 'utf8')) : [];
    if (!Array.isArray(routes)) fail(`${relative(ROOT, routesFile)} must be a JSON array of route paths.`);
    for (const raw of routes) {
        const route = String(raw).replace(/^\/+|\/+$/g, '');
        if (!route || route.includes(':') || route.includes('*') || route.includes('..')) {
            fail(`${relative(ROOT, routesFile)}: "${raw}" is not a static route.`);
        }
        const routeDir = join(target, route);
        if (existsSync(join(routeDir, 'index.html'))) {
            fail(`${name}: route "${route}" collides with a file the build already produced.`);
        }
        mkdirSync(routeDir, { recursive: true });
        cpSync(join(target, 'index.html'), join(routeDir, 'index.html'));
        requiredFiles.push(`${name}/${route}/index.html`);
        console.log(`  + /finch/${name}/${route}/`);
    }
}

// 7. Tell Pages not to run Jekyll (it would drop Storybook's underscore-prefixed files).
writeFileSync(join(OUT, '.nojekyll'), '');
requiredFiles.push('.nojekyll');

// 8. Final check of every entry point.
step('Verifying site-dist/');
const missing = requiredFiles.filter((f) => !existsSync(join(OUT, f)));
if (missing.length) fail(`missing expected files:\n  ${missing.join('\n  ')}`);
for (const f of requiredFiles) console.log(`  ✓ site-dist/${f}`);
console.log('\n\x1b[32m✔ Site assembled in site-dist/\x1b[0m');
