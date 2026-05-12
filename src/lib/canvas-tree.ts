/**
 * Canvas tree types — confirmed from canvas module source and astro demo.
 *
 * The tree is FLAT: each node has a parent_uuid + slot that establishes
 * hierarchy. The renderer assembles the tree at runtime.
 */

export interface CanvasComponent {
  uuid: string;
  component_id: string; // e.g. "js.hero", "js.card"
  parent_uuid: string | null; // null for root nodes
  slot: string | null; // slot name in parent; null for root
  inputs: string | Record<string, unknown>; // JSON string (Canvas ≤1.3) or object (Canvas ≥1.4)
}

export interface CanvasPageResource {
  id: string;
  type: string;
  langcode: string;
  status: boolean;
  title: string;
  description?: string;
  path?: {
    alias: string;
    langcode: string;
  };
  components: CanvasComponent[];
  /** SEO image — media entity reference, resolved separately. */
  image?: {
    type: string;
    id: string;
    meta?: {
      drupal_internal__target_id: number;
    };
  };
}
