# Canvas Code Component Development Guide

This guide covers how to create, modify, and push Canvas Code Components in `drupal-canvas-nextjs`.

## Architecture

Canvas Code Components exist in three places:

1. **React source** — `src/components/canvas/<name>/index.tsx` — what Next.js renders.
2. **Canvas metadata** — `src/components/canvas/<name>/component.yml` — props, slots, machine name. Pushed to Drupal by `canvas push`.
3. **Recipe config** — `config/canvas.js_component.<name>.yml` inside the sibling [`drupal/ui`](https://www.drupal.org/project/ui) recipe checkout — what fresh installs receive when they apply the recipe.

The Canvas CLI (`canvas push`) keeps (1) and (2) in sync with the running Drupal site. Use `npm run canvas:sync-recipe -- --recipe-path ../ui` to keep (3) in sync after a push.

## Component structure

Each component lives in its own directory under `src/components/canvas/`:

```
src/components/canvas/hero/
  component.yml    # Canvas metadata (props, slots, machine name)
  index.tsx        # React component (default export)
```

### component.yml

Defines the component's metadata for the Canvas editor:

```yaml
name: Hero
machineName: hero
status: true
required: []
props:
  properties:
    title:
      type: string
      title: Title
      description: The hero heading text
      examples:
        - Welcome to our site
    backgroundImage:
      type: string
      format: uri
      title: Background Image
    darkVariant:
      type: boolean
      title: Dark Variant
slots:
  content:
    title: Content
    description: Main content area below the title
```

### index.tsx

A standard React component with a default export:

```tsx
import { type ReactNode } from "react";

interface HeroProps {
  title?: string;
  backgroundImage?: string;
  darkVariant?: boolean;
  content?: ReactNode;
}

export default function Hero({
  title = "Welcome",
  backgroundImage,
  darkVariant = false,
  content,
}: HeroProps) {
  return (
    <section className={darkVariant ? "bg-neutral-900 text-white" : "bg-white text-neutral-900"}>
      <h1 className="text-4xl font-bold">{title}</h1>
      {content && <div>{content}</div>}
    </section>
  );
}
```

## Naming conventions

| Context | Format | Example |
|---|---|---|
| Directory name | snake_case | `cta_banner/` |
| `machineName` in YAML | snake_case | `cta_banner` |
| Canvas component ID | `js.<machineName>` | `js.cta_banner` |
| React export | PascalCase | `CtaBanner` |
| Prop machine names | camelCase of their title | `backgroundImage` (title: "Background Image") |

**The prop machine name must be the camelCase version of its title.** The CLI enforces this. If your title is "Background Image", the prop key must be `backgroundImage`. Not `image`, not `bgImage` — exactly `backgroundImage`.

## Canvas CLI constraints

The Canvas CLI validates and bundles components for the Drupal editor preview. It has strict rules about what components can import.

### Banned imports

| Import | Error | Reason |
|---|---|---|
| `@/lib/utils` | "cannot be used for local files" | Canvas provides its own `cn()` at this path |
| `@/components/ui/*` | "invalid component name" | Canvas treats these as component dependencies |
| `../utils` or any `../` | "relative imports not supported" | Must stay within the component directory |
| `drupal-canvas/utils` | Module not found in Next.js build | Only available inside Canvas runtime |

### Allowed imports

| Import | Example |
|---|---|
| React | `import { useState } from "react"` |
| npm packages | `import Image from "next/image"` |
| Files within the component directory | `import styles from "./styles.module.css"` |

### No `cn()` utility

Since `@/lib/utils` is banned, you cannot use `cn()` for conditional class merging. Use template literals instead:

```tsx
// Don't do this:
import { cn } from "@/lib/utils";
<div className={cn("p-4", darkVariant && "bg-black")} />

// Do this:
<div className={`p-4 ${darkVariant ? "bg-black" : "bg-white"}`} />
```

### Global CSS limitations

The Canvas CLI uses a browser-based Tailwind compiler that cannot resolve npm `@import` statements. The project has two CSS files:

- `src/app/globals.css` — used by Next.js, can import npm packages (`shadcn/tailwind.css`, `tw-animate-css`)
- `src/canvas-global.css` — used by Canvas CLI (configured in `canvas.config.json`), only `@import "tailwindcss"` plus raw CSS

If you add CSS custom properties or theme tokens, add them to **both** files.

### Client-side interactivity

Components that use React hooks (`useState`, `useRef`, etc.) must include the `"use client"` directive:

```tsx
"use client";
import { useState } from "react";

export default function Tabs({ tabsJson = "[]" }) {
  const [activeTab, setActiveTab] = useState(0);
  // ...
}
```

## Creating a new component

### 1. Scaffold the files

```bash
mkdir src/components/canvas/my_component
```

Create `component.yml` and `index.tsx` following the conventions above.

### 2. Register with the canvas registry

Add the component to `src/components/canvas/index.ts`:

```typescript
import MyComponent from "./my_component";
registerComponent("js.my_component", MyComponent);
```

### 3. Verify the Next.js build

```bash
pnpm build
```

### 4. Push to Drupal

```bash
NODE_OPTIONS='--use-system-ca' npx canvas push
```

You must be logged in first:

```bash
NODE_OPTIONS='--use-system-ca' npx canvas login --client-id canvas_cli
```

### 5. Export Drupal config to recipe

```bash
cd drupal
ddev drush config:get canvas.js_component.my_component --format=yaml > recipes/nextjs/config/canvas.js_component.my_component.yml
```

Strip `uuid` and `_core` keys from the exported file before committing.

## Props

### Supported prop types

| JSON Schema type | Canvas editor UI | React prop type |
|---|---|---|
| `string` | Text input | `string` |
| `string` + `format: uri` | URL input | `string` |
| `boolean` | Toggle | `boolean` |
| `integer` | Number input | `number` |
| `string` + `enum` | Dropdown select | `string` |

### Rich text props

Canvas delivers rich text as HTML strings in the `inputs` JSON. Render with `dangerouslySetInnerHTML`:

```tsx
{description && (
  <div dangerouslySetInnerHTML={{ __html: description }} />
)}
```

### JSON-encoded complex props

For complex data (arrays of objects), use a string prop that contains JSON. Parse it in the component:

```yaml
# component.yml
props:
  properties:
    itemsJson:
      type: string
      title: Items JSON
      description: JSON array of {label, href} objects
```

```tsx
// index.tsx
const items = JSON.parse(itemsJson || "[]");
```

## Slots

Slots let editors nest other components inside your component. They appear as `ReactNode` props:

```yaml
# component.yml
slots:
  content:
    title: Content
    description: Main content area
  footer:
    title: Footer
    description: Footer content
```

```tsx
interface CardProps {
  title?: string;
  content?: ReactNode;
  footer?: ReactNode;
}
```

The Canvas renderer groups child components by their `slot` value and passes them as props. A slot with `null` name maps to `"default"`.

## Variations

Container components (`section`, `hero`, `header`, `footer`, `card`, `cta_banner`) expose a `variation` prop with four options — **primary**, **secondary**, **accent**, **muted** — that map directly to shadcn's surface utility pairs. Leave the prop empty for the component's default rendering.

| Variation | Utility classes | When to use |
|---|---|---|
| (empty / None) | — | Component's default rendering |
| primary | `bg-primary text-primary-foreground` | Vivid call-to-action surface |
| secondary | `bg-secondary text-secondary-foreground` | Subdued action surface |
| accent | `bg-accent text-accent-foreground` | Hover / highlighted surface |
| muted | `bg-muted text-muted-foreground` | Subdued background |

The token set comes straight from `src/canvas-global.css`'s `:root` and `.dark` blocks (shadcn-canonical). Dark mode is handled by the global `.dark` class on `<html>` (toggled by the Dark Mode Switch component); each token has light + dark values so all surfaces adapt automatically.

### Adding a `variation` prop to a new component

`component.yml`:

```yaml
props:
  properties:
    # ... CONTENT, BEHAVIOR props first
    variation:
      type: string
      enum: ["primary", "secondary", "accent", "muted"]
      meta:enum:
        primary: Primary
        secondary: Secondary
        accent: Accent
        muted: Muted
      title: Variation
      description: Surface variation for this component. Leave empty for the default surface.
    # ... LAYOUT, SPACING props after
```

`index.tsx`:

```tsx
interface MyComponentProps {
  // ...
  variation?: "primary" | "secondary" | "accent" | "muted";
}

const variationClasses: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
};

export default function MyComponent({ variation, /* ... */ }: MyComponentProps) {
  const surfaceClasses = variation ? variationClasses[variation] : "";
  return <div className={surfaceClasses}>{/* ... */}</div>;
}
```

### Where the pieces live

- Token defaults: `src/canvas-global.css` (loaded by both Next.js via `layout.tsx` and the Canvas editor via `npx canvas push`).
- `variation` prop: `src/components/canvas/{section,hero,header,footer,card,cta_banner}/component.yml`.

## How the renderer works

The Canvas tree is a **flat array** of nodes. Each node has:

- `uuid` — unique ID
- `component_id` — e.g. `js.hero`
- `parent_uuid` — parent node's UUID (null for root nodes)
- `slot` — slot name in parent (null for default slot)
- `inputs` — JSON-stringified prop values

The renderer (`src/lib/canvas-renderer.tsx`) assembles the hierarchy at runtime:

1. **Index**: group nodes by `parent_uuid`
2. **Render**: starting from root nodes, recursively render children grouped by slot
3. **Resolve**: look up `component_id` in the registry to find the React component

## Canvas CLI reference

| Command | Purpose |
|---|---|
| `canvas login --client-id canvas_cli` | Authenticate with Drupal |
| `canvas push` | Build and push components to Drupal |
| `canvas pull` | Pull components from Drupal |
| `canvas build` | Build components locally |
| `canvas scaffold` | Create a new component scaffold |
| `canvas validate` | Lint components |

All commands require `NODE_OPTIONS='--use-system-ca'` when connecting to DDEV sites (self-signed TLS certificates).

## Configuration

### canvas.config.json

```json
{
  "componentDir": "./src/components/canvas",
  "pagesDir": "./pages",
  "outputDir": "dist",
  "globalCssPath": "./src/canvas-global.css"
}
```

### Environment variables

Set in `.env.local` (not committed):

```
CANVAS_SITE_URL=https://nextjs-starter.ddev.site
```

OAuth credentials are stored by `canvas login` at `~/.config/drupal-canvas/oauth.json`.

## Drupal setup requirements

For the Canvas CLI to work, the Drupal site needs:

1. **Simple OAuth keys** — `ddev drush simple-oauth:generate-keys /var/www/html/keys`
2. **OAuth consumer** — with `authorization_code` + `refresh_token` grants, PKCE enabled, redirect URI `http://localhost:4444/callback`, and administrator role
3. **canvas_oauth module** — provides the OAuth scopes the CLI needs (`canvas:js_component`, `canvas:asset_library`, etc.)
