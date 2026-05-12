import { createElement, type ReactNode } from "react";
import type { CanvasComponent } from "./canvas-tree";
import { resolve } from "./canvas-registry";

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

/**
 * Normalize Canvas input values.
 *
 * Canvas wraps some values in { value, sourceType } structures.
 * This strips those wrappers to extract the actual values.
 */
function normalizeInputValue(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(normalizeInputValue);

  const record = obj as Record<string, unknown>;
  if ("value" in record && "sourceType" in record) {
    return normalizeInputValue(record.value);
  }
  if (
    "value" in record &&
    typeof record.value === "string" &&
    Object.keys(record).length <= 2
  ) {
    return record.value;
  }

  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    normalized[key] = normalizeInputValue(value);
  }
  return normalized;
}

function parseInputs(inputs: string | Record<string, unknown>): Record<string, unknown> {
  if (!inputs) return {};
  // Canvas ≥1.4 passes inputs as objects; ≤1.3 passed JSON strings.
  const raw = typeof inputs === "string" ? JSON.parse(inputs) : inputs;
  return normalizeInputValue(raw) as Record<string, unknown>;
}

/**
 * Collect all media target_id values from component inputs.
 */
function collectMediaIds(components: CanvasComponent[]): Set<string> {
  const ids = new Set<string>();
  for (const node of components) {
    const inputs = parseInputs(node.inputs);
    findTargetIds(inputs, ids);
  }
  return ids;
}

function findTargetIds(obj: unknown, ids: Set<string>): void {
  if (obj === null || obj === undefined || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => findTargetIds(item, ids));
    return;
  }
  const record = obj as Record<string, unknown>;
  if (
    "target_id" in record &&
    Object.keys(record).length === 1 &&
    (typeof record.target_id === "string" || typeof record.target_id === "number")
  ) {
    ids.add(String(record.target_id));
    return;
  }
  for (const value of Object.values(record)) {
    findTargetIds(value, ids);
  }
}

/**
 * Fetch resolved media data from Drupal for a set of media IDs.
 */
async function resolveMediaIds(
  ids: Set<string>,
): Promise<Record<string, { src: string; alt: string; width: number; height: number }>> {
  if (ids.size === 0 || !DRUPAL_BASE_URL) return {};
  try {
    const res = await fetch(
      `${DRUPAL_BASE_URL}/api/media-resolve?ids=${Array.from(ids).join(",")}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Replace { target_id } references with resolved image data.
 */
function replaceTargetIds(
  obj: unknown,
  mediaMap: Record<string, { src: string; alt: string; width: number; height: number }>,
): unknown {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => replaceTargetIds(item, mediaMap));

  const record = obj as Record<string, unknown>;
  if (
    "target_id" in record &&
    Object.keys(record).length === 1 &&
    (typeof record.target_id === "string" || typeof record.target_id === "number")
  ) {
    const resolved = mediaMap[String(record.target_id)];
    return resolved || record;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = replaceTargetIds(value, mediaMap);
  }
  return result;
}

/**
 * Render a flat Canvas component tree into React elements.
 *
 * This is an async server component that resolves media references
 * before rendering.
 */
export async function CanvasRenderer({
  components,
}: {
  components: CanvasComponent[];
}) {
  if (!components || components.length === 0) {
    return null;
  }

  // Resolve media references.
  const mediaIds = collectMediaIds(components);
  const mediaMap = await resolveMediaIds(mediaIds);

  // Phase 1: Index
  const childrenMap = new Map<string, CanvasComponent[]>();
  const roots: CanvasComponent[] = [];

  for (const node of components) {
    if (node.parent_uuid === null) {
      roots.push(node);
    } else {
      const siblings = childrenMap.get(node.parent_uuid) ?? [];
      siblings.push(node);
      childrenMap.set(node.parent_uuid, siblings);
    }
  }

  // Phase 2: Render from roots
  return <>{roots.map((node) => renderNode(node, childrenMap, mediaMap))}</>;
}

function renderNode(
  node: CanvasComponent,
  childrenMap: Map<string, CanvasComponent[]>,
  mediaMap: Record<string, { src: string; alt: string; width: number; height: number }>,
): ReactNode {
  const Component = resolve(node.component_id);
  let inputs = parseInputs(node.inputs);

  // Replace { target_id } references with resolved image data.
  if (Object.keys(mediaMap).length > 0) {
    inputs = replaceTargetIds(inputs, mediaMap) as Record<string, unknown>;
  }

  const children = childrenMap.get(node.uuid) ?? [];

  // Group children by slot
  const slotChildren: Record<string, ReactNode[]> = {};
  for (const child of children) {
    const slotName = child.slot ?? "default";
    if (!slotChildren[slotName]) slotChildren[slotName] = [];
    slotChildren[slotName].push(renderNode(child, childrenMap, mediaMap));
  }

  // Single child in a slot = element; multiple = array
  const slotProps: Record<string, ReactNode> = {};
  for (const [slot, rendered] of Object.entries(slotChildren)) {
    slotProps[slot] = rendered.length === 1 ? rendered[0] : rendered;
  }

  return createElement(Component, {
    key: node.uuid,
    ...inputs,
    ...slotProps,
  });
}
