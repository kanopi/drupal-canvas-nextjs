import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, within, cleanup } from "@testing-library/react";
import { CanvasRenderer } from "@/lib/canvas-renderer";
import { registerComponent } from "@/lib/canvas-registry";
import type { CanvasComponent } from "@/lib/canvas-tree";

function TestHeading({ title }: { title?: string }) {
  return <h1 data-testid="heading">{title}</h1>;
}

function TestSection({ content }: { content?: React.ReactNode }) {
  return (
    <section data-testid="section">
      <div data-testid="section-content">{content}</div>
    </section>
  );
}

function TestCard({ title, footer }: { title?: string; footer?: React.ReactNode }) {
  return (
    <div data-testid="card">
      <h2>{title}</h2>
      {footer && <div data-testid="card-footer">{footer}</div>}
    </div>
  );
}

beforeEach(() => {
  registerComponent("js.test_heading", TestHeading);
  registerComponent("js.test_section", TestSection);
  registerComponent("js.test_card", TestCard);
});

afterEach(cleanup);

describe("CanvasRenderer", () => {
  it("renders nothing for empty components array", () => {
    const { container } = render(<CanvasRenderer components={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders a single root component", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "root-1",
        component_id: "js.test_heading",
        parent_uuid: null,
        slot: null,
        inputs: JSON.stringify({ title: "Hello World" }),
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    expect(view.getByTestId("heading")).toHaveTextContent("Hello World");
  });

  it("renders nested components via parent_uuid", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "section-1",
        component_id: "js.test_section",
        parent_uuid: null,
        slot: null,
        inputs: "{}",
      },
      {
        uuid: "heading-1",
        component_id: "js.test_heading",
        parent_uuid: "section-1",
        slot: "content",
        inputs: JSON.stringify({ title: "Nested" }),
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    const section = view.getByTestId("section");
    const heading = within(section).getByTestId("heading");
    expect(section).toContainElement(heading);
    expect(heading).toHaveTextContent("Nested");
  });

  it("groups children by slot name", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "card-1",
        component_id: "js.test_card",
        parent_uuid: null,
        slot: null,
        inputs: JSON.stringify({ title: "My Card" }),
      },
      {
        uuid: "footer-content",
        component_id: "js.test_heading",
        parent_uuid: "card-1",
        slot: "footer",
        inputs: JSON.stringify({ title: "Footer Text" }),
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    const footer = view.getByTestId("card-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Footer Text");
  });

  it("renders multiple root components", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "h1",
        component_id: "js.test_heading",
        parent_uuid: null,
        slot: null,
        inputs: JSON.stringify({ title: "First" }),
      },
      {
        uuid: "h2",
        component_id: "js.test_heading",
        parent_uuid: null,
        slot: null,
        inputs: JSON.stringify({ title: "Second" }),
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    const headings = view.getAllByTestId("heading");
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent("First");
    expect(headings[1]).toHaveTextContent("Second");
  });

  it("normalizes { value, sourceType } input wrappers", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "wrapped-1",
        component_id: "js.test_heading",
        parent_uuid: null,
        slot: null,
        inputs: JSON.stringify({
          title: { value: "Unwrapped Title", sourceType: "static" },
        }),
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    expect(view.getByTestId("heading")).toHaveTextContent("Unwrapped Title");
  });

  it("handles empty inputs gracefully", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "empty-1",
        component_id: "js.test_heading",
        parent_uuid: null,
        slot: null,
        inputs: "",
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    const view = within(container);
    expect(view.getByTestId("heading")).toBeInTheDocument();
  });

  it("renders UnknownComponent for unregistered component_id", () => {
    const components: CanvasComponent[] = [
      {
        uuid: "unknown-1",
        component_id: "js.nonexistent",
        parent_uuid: null,
        slot: null,
        inputs: "{}",
      },
    ];

    const { container } = render(<CanvasRenderer components={components} />);
    expect(container.textContent).toContain("js.nonexistent");
  });
});
