import type { ComponentType } from "react";
import { UnknownComponent } from "@/components/fallback/UnknownComponent";

type CanvasComponentType = ComponentType<Record<string, unknown>>;

const registry: Record<string, CanvasComponentType> = {};

/**
 * Register a React component for a Canvas component_id.
 * Called by each Code Component module to self-register.
 */
export function registerComponent(id: string, component: CanvasComponentType) {
  registry[id] = component;
}

/**
 * Resolve a component_id (e.g. "js.hero") to a React component.
 * Returns UnknownComponent if no match is found.
 */
export function resolve(
  componentId: string
): CanvasComponentType {
  const component = registry[componentId];
  if (!component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[canvas-registry] No component registered for "${componentId}"`);
    }
    return (props: Record<string, unknown>) =>
      UnknownComponent({ componentId, ...props });
  }
  return component;
}

/**
 * Get all registered component IDs.
 */
export function getRegisteredIds(): string[] {
  return Object.keys(registry);
}
