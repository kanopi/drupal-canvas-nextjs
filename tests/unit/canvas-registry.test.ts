import { describe, it, expect } from "vitest";
import {
  registerComponent,
  resolve,
  getRegisteredIds,
} from "@/lib/canvas-registry";

function MockComponent() {
  return null;
}

describe("canvas-registry", () => {
  it("registers and resolves a component", () => {
    registerComponent("js.test_mock", MockComponent);
    const resolved = resolve("js.test_mock");
    expect(resolved).toBe(MockComponent);
  });

  it("returns a fallback for unregistered component_id", () => {
    const resolved = resolve("js.does_not_exist");
    expect(resolved).not.toBe(MockComponent);
    expect(typeof resolved).toBe("function");
  });

  it("lists registered component IDs", () => {
    registerComponent("js.registry_test", MockComponent);
    const ids = getRegisteredIds();
    expect(ids).toContain("js.registry_test");
  });
});
