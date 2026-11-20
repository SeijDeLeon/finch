# Public site apps

Everything here is part of the public documentation site, not the Finch library. Each folder is an
independent Vite + React app with its own `package.json`, lockfile and dev server.

| Folder | Published at | Dev command (from repo root) |
|---|---|---|
| `website/` | `/finch/` | `npm run dev:website` |
| `examples/example1/` | `/finch/example1/` | `npm run dev:example1` |
| `examples/example2/` | `/finch/example2/` | `npm run dev:example2` |
| *(root `.storybook/`)* | `/finch/storybook/` | `npm run storybook` |

`npm run build:site` builds the library, then each app, and assembles them into `site-dist/`
(see [`scripts/build-site.mjs`](../scripts/build-site.mjs)). `npm run preview:site` serves that
folder under `/finch/` with GitHub Pages' rules, so broken asset paths and missing routes fail
locally the way they would on Pages. Pass `-- --skip-install` to `build:site` to reuse existing
`node_modules` for faster local rebuilds.

The examples depend on the Finch library through `"@blueskyproject/finch": "file:../../.."`, a link
to the repository root, so run `npm install` (or `npm ci`) and `npm run build` at the root before
running an example's dev server. Rebuild the library to pick up library changes.

## Adding an example

1. Copy an existing example to `apps/examples/<name>/`. The folder name becomes the URL:
   `/finch/<name>/`. `build:site` picks up every folder there that has a `package.json`.
2. In its `vite.config.ts`, set the build base to match. The build fails if it does not:
   ```ts
   base: command === 'build' ? '/finch/<name>/' : '/',
   ```
3. Rename the package in `package.json`, add a `dev:<name>` script to the root `package.json` if
   you want one, then run `npm install` in the folder and commit its `package-lock.json`.
4. Use `<BrowserRouter basename={import.meta.env.BASE_URL}>` and define routes as `/`, `/foo`, and
   so on, never `/finch/<name>/foo`. Navigate with `<Link>`/`<NavLink>`.

### Deep routes and GitHub Pages

GitHub Pages has no single-page-app fallback: opening or refreshing `/finch/<name>/foo` directly
returns a 404 unless a file exists there. List every client-side route in the app's
`static-routes.json`:

```json
["qserverpage", "controls"]
```

`build:site` copies the app's `index.html` to `<route>/index.html` for each entry. Keep the list in
sync with the app's routes. Dynamic segments such as `/runs/:uid` cannot be listed and won't load
directly; they would need a different fallback strategy or other hosting.

## Rules for example code

- **Import Finch only from `@blueskyproject/finch`** (and `@blueskyproject/finch/style.css`, once).
  Never from `../../../src/...` or `dist/` internals. The examples double as a check that the public
  exports are enough to build a real app.
- **Everything on GitHub Pages is static.** No server, mock API, Queue Server, Tiled or EPICS IOC
  runs there. Examples must work on simulated or placeholder data (for example
  `useSimOphydPVSocket`) and say so on the page. Connecting to real services needs a separately
  running backend and is outside what the published site can show.
- **No secrets.** Every `VITE_*` variable is baked into the public bundle. Don't put API keys,
  tokens or internal hostnames in example code or env files.
- Keep app CSS class names prefixed (the examples use `ex-`). Finch's stylesheet ships Tailwind
  utility classes such as `grid` and `card`, and an unprefixed app class with the same name will
  override the library's layout.
