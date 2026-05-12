# drupal-canvas-nextjs

A Next.js starter that renders pages built with [Drupal Canvas Code Components](https://www.drupal.org/project/canvas). Pair it with the [`drupal/ui`](https://www.drupal.org/project/ui) and [`kanopi/nextjs`](https://github.com/kanopi/nextjs) Drupal recipes to get a full decoupled stack.

## What's here

- 43 Canvas Code Components in `src/components/canvas/` — each ships with an `index.tsx` (frontend render) and a `component.yml` (Canvas metadata).
- A Canvas page renderer in `src/lib/canvas-renderer.tsx` that walks the flat Canvas tree and dispatches to registered React components.
- `src/canvas-global.css` — the shadcn token contract plus the `.variation-*` classes that drive the colored variations across container components.
- Next.js App Router scaffolding (catch-all route, layout, API handlers for site data, draft preview, revalidate, and menu fetching).
- A sync script (`scripts/sync-recipe-yml.sh`) that copies pushed Canvas config back into a sibling `ui` recipe checkout.

## Quick start

This repo expects a Drupal site running one of:
- `drupal/ui` (UI components only — coupled mode) ➜ see [drupal.org/project/ui](https://www.drupal.org/project/ui)
- `kanopi/nextjs` (UI + decoupled bridge) ➜ see [kanopi/nextjs](https://github.com/kanopi/nextjs)
- [`kanopi/next-canvas-dev`](https://github.com/kanopi/next-canvas-dev) (sibling-clone dev stack — easiest)

Then:

```bash
cp .env.example .env.local
# edit .env.local — point NEXT_PUBLIC_DRUPAL_BASE_URL at your Drupal site
npm install
npm run dev
```

Visit http://localhost:3000.

## Editing components

Edit `src/components/canvas/<name>/index.tsx` (and `component.yml` if props change).

```bash
npx canvas login --client-id canvas_cli   # one-time, against your Drupal site
npx canvas push                            # pushes components + canvas-global.css
```

The Canvas editor at your Drupal site sees the changes immediately.

## Keeping the recipe config in sync

When you change a component, the Canvas config in the `drupal/ui` recipe goes out of date. After `canvas push`, run:

```bash
npm run canvas:sync-recipe -- --recipe-path ../ui
```

The script exports config from your Drupal site, strips instance UUIDs, and writes the result into the sibling `ui/config/` directory. Commit the diff there separately.

## Tests

```bash
npm test                 # unit tests (Vitest)
npm run lint
```

## Architecture

The Next.js front end fetches Canvas pages from Drupal via `next-drupal`. The Canvas tree is a flat array of nodes — each with `uuid`, `component_id`, `parent_uuid`, `slot`, and `inputs`. The renderer assembles the hierarchy at runtime by indexing parent–child relationships and dispatching to registered React components.

See [`docs/COMPONENT_DEVELOPMENT.md`](docs/COMPONENT_DEVELOPMENT.md) for the full component authoring guide.

## Related repos

| Repo | What it is |
| --- | --- |
| [`drupal/ui`](https://www.drupal.org/project/ui) | The component library recipe (43 components, editor scaffolding, home page). |
| [`kanopi/nextjs`](https://github.com/kanopi/nextjs) | The decoupled site template recipe (applies `ui`, adds the decoupled bridge). |
| [`kanopi/next_canvas`](https://github.com/kanopi/next_canvas) | The Drupal module exposing site branding / page regions / page meta / media resolver REST endpoints. |
| [`kanopi/next-canvas-dev`](https://github.com/kanopi/next-canvas-dev) | A sibling-clone DDEV dev stack that wires all four together for end-to-end work. |

## License

GPL-2.0-or-later (for the components, mirroring `drupal/ui`). The Next.js scaffolding code is MIT.
