import type { CanvasComponent } from "./canvas-tree";

export interface PageRegionsData {
  theme: string;
  beforeContent: Record<string, CanvasComponent[]>;
  afterContent: Record<string, CanvasComponent[]>;
}

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

export async function fetchPageRegions(): Promise<PageRegionsData> {
  const fallback: PageRegionsData = {
    theme: "",
    beforeContent: {},
    afterContent: {},
  };

  if (!DRUPAL_BASE_URL) {
    return fallback;
  }

  try {
    const res = await fetch(`${DRUPAL_BASE_URL}/api/page-regions`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(
        `[page-regions] Failed to fetch: ${res.status} ${res.statusText}`,
      );
      return fallback;
    }

    return (await res.json()) as PageRegionsData;
  } catch (error) {
    console.error("[page-regions] Fetch error:", error);
    return fallback;
  }
}
