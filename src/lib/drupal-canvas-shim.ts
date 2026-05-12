/**
 * Local shim for the "drupal-canvas" package.
 *
 * In the Canvas editor, "drupal-canvas" is provided by the module's import map
 * and reads from window.drupalSettings. In the Next.js build, this shim is
 * resolved instead via the webpack alias in next.config.ts.
 *
 * Functions return safe defaults when drupalSettings is unavailable (SSR).
 */

interface PageData {
  pageTitle: string;
  breadcrumbs: Array<{ key: string; text: string; url: string }>;
  mainEntity: { bundle: string; entityTypeId: string; uuid: string } | null;
}

interface SiteData {
  branding: { homeUrl: string; siteName: string; siteSlogan: string };
  baseUrl: string;
  themeAssets: {
    logo: { url: string };
    favicon: { url: string; mimeType: string };
  };
}

interface LinksetMenuItem {
  id: string;
  title: string;
  href: string;
  hierarchy: string[];
  _children: LinksetMenuItem[];
  _hasSubmenu: boolean;
  [key: string]: unknown;
}

function getDrupalSettings() {
  if (typeof window !== "undefined") {
    return (window as any).drupalSettings?.canvasData?.v0;
  }
  return null;
}

export function getPageData(): PageData {
  const settings = getDrupalSettings();
  const data: PageData = {
    pageTitle: settings?.pageTitle || "",
    breadcrumbs: settings?.breadcrumbs || [],
    mainEntity: settings?.mainEntity || null,
  };
  if (typeof window !== "undefined" && window.parent) {
    window.parent.postMessage(
      { type: "_canvas_useswr_data_fetch", id: "getPageData()", data },
      "*",
    );
  }
  return data;
}

export function getSiteData(): SiteData {
  const settings = getDrupalSettings();
  const data: SiteData = {
    branding: settings?.branding || {
      homeUrl: "",
      siteName: "",
      siteSlogan: "",
    },
    baseUrl:
      settings?.baseUrl ||
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ||
      "",
    themeAssets: settings?.themeAssets || {
      logo: { url: "" },
      favicon: { url: "", mimeType: "" },
    },
  };
  if (typeof window !== "undefined" && window.parent) {
    window.parent.postMessage(
      { type: "_canvas_useswr_data_fetch", id: "getSiteData()", data },
      "*",
    );
  }
  return data;
}

export function sortLinksetMenu(data: any): LinksetMenuItem[] {
  if (!data?.linkset?.length) return [];

  const map = new Map<string, LinksetMenuItem>();
  const roots: LinksetMenuItem[] = [];

  data.linkset[0].item.forEach((item: any) => {
    const id = item.hierarchy.join("|");
    map.set(id, { ...item, id, _children: [], _hasSubmenu: false });
  });

  data.linkset[0].item.forEach((item: any) => {
    const id = item.hierarchy.join("|");
    const node = map.get(id)!;
    if (item.hierarchy.length === 1) {
      roots.push(node);
    } else {
      const parentId = item.hierarchy.slice(0, -1).join("|");
      const parent = map.get(parentId);
      if (parent) {
        parent._children.push(node);
        parent._hasSubmenu = true;
      }
    }
  });

  return roots;
}

export function sortMenu(items: any[]): any[] {
  const map = new Map<string | number, any>();
  const roots: any[] = [];

  items.forEach((item: any) => {
    map.set(item.id, { ...item, _children: [], _hasSubmenu: false });
  });

  items.forEach((item: any) => {
    const node = map.get(item.id)!;
    if (item.parent && map.has(item.parent)) {
      const parent = map.get(item.parent)!;
      parent._children.push(node);
      parent._hasSubmenu = true;
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function getNodePath(node: any): string {
  return (
    node?.path?.alias ||
    (node?.drupal_internal__nid ? `/node/${node.drupal_internal__nid}` : "#")
  );
}

export function cn(...args: any[]): string {
  return args.filter(Boolean).join(" ");
}

// Re-export the Canvas Image component for use in code components.
export { default as Image } from "./canvas-image";

/**
 * Resolve a Drupal image src to a full URL.
 *
 * In the Canvas editor, src is same-origin so relative paths work.
 * In the Next.js frontend, relative paths need the Drupal base URL prepended.
 */
export function resolveImageSrc(src: string): string {
  if (!src) return src;
  // Already absolute — return as-is.
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  // In Drupal context, relative paths work.
  if (typeof window !== "undefined" && (window as any).drupalSettings?.canvasData) {
    return src;
  }
  // Next.js context — prepend the Drupal base URL.
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "";
  return baseUrl ? `${baseUrl}${src}` : src;
}
