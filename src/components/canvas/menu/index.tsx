"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { sortLinksetMenu } from "drupal-canvas";

interface MenuItem {
  id: string;
  title: string;
  href: string;
  _children: MenuItem[];
  _hasSubmenu: boolean;
}

interface MenuProps {
  menuName?: string;
  menuLevel?: string;
  menuDepth?: string;
  displayMode?: "hamburger" | "horizontal" | "vertical" | "items";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  alignment?: "left" | "right" | "center" | "even";
  columns?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

const variationClasses: Record<string, string> = {
  primary: "variation-primary",
  secondary: "variation-secondary",
  tertiary: "variation-tertiary",
  accent: "variation-accent",
  muted: "variation-muted",
  light: "variation-light",
  dark: "variation-dark",
};

function filterMenuTree(
  items: MenuItem[],
  startLevel: number,
  maxDepth: number,
  currentLevel: number = 1,
): MenuItem[] {
  if (currentLevel < startLevel) {
    return items.flatMap((item) =>
      filterMenuTree(
        item._children || [],
        startLevel,
        maxDepth,
        currentLevel + 1,
      ),
    );
  }
  if (maxDepth > 0 && currentLevel >= startLevel + maxDepth) {
    return items.map((item) => ({
      ...item,
      _children: [],
      _hasSubmenu: false,
    }));
  }
  return items.map((item) => ({
    ...item,
    _children: filterMenuTree(
      item._children || [],
      startLevel,
      maxDepth,
      currentLevel + 1,
    ),
    _hasSubmenu:
      (item._children || []).length > 0 &&
      (maxDepth === 0 || currentLevel < startLevel + maxDepth - 1),
  }));
}

// Menu spacing — kept consistent across horizontal/items/vertical modes.
// Item gap is the small breathing room between adjacent menu items;
// nested submenu indent and submenu vertical padding stay structural.
const MENU_ITEM_GAP = "gap-1";
const MENU_NESTED_INDENT = "ml-4";
const MENU_SUBMENU_PADDING = "py-1";

const alignmentClasses: Record<string, string> = {
  left: `flex flex-row flex-wrap items-center justify-start ${MENU_ITEM_GAP}`,
  right: `flex flex-row flex-wrap items-center justify-end ${MENU_ITEM_GAP}`,
  center: `flex flex-row flex-wrap items-center justify-center ${MENU_ITEM_GAP}`,
  even: `flex flex-row flex-wrap items-center justify-between ${MENU_ITEM_GAP} w-full`,
};

function MenuItems({
  items,
  alignment = "left",
  columns = "0",
}: {
  items: MenuItem[];
  alignment?: string;
  columns?: string;
}) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (menuKey: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const colNum = parseInt(columns, 10);
  const useGrid = colNum >= 1 && colNum <= 6;

  const listStyle: React.CSSProperties = useGrid
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
        gap: "0.5rem",
      }
    : {};

  const listClassName = useGrid
    ? ""
    : alignmentClasses[alignment] || alignmentClasses.left;

  return (
    <ul className={listClassName} style={listStyle}>
      {items.map((item) => {
        const menuKey = `menu-${item.id}`;
        const isOpen = openSubmenus[menuKey];

        return (
          <li key={item.id} className="relative">
            <div className="flex items-center">
              <a
                href={item.href || "#"}
                className="inline-flex min-h-12 items-center px-3 text-sm text-foreground hover:text-foreground hover:bg-muted rounded-md"
              >
                {item.title}
              </a>
              {item._hasSubmenu && (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`Show submenu for ${item.title}`}
                  onClick={() => toggleSubmenu(menuKey)}
                  className="inline-flex min-h-12 min-w-12 items-center justify-center text-muted-foreground hover:text-foreground rounded"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
            {item._hasSubmenu && isOpen && (
              <ul className={`absolute left-0 top-full z-50 min-w-[200px] rounded-md border border-border bg-background ${MENU_SUBMENU_PADDING} shadow-popover`}>
                {item._children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href || "#"}
                      className="flex min-h-12 items-center px-4 text-sm text-foreground hover:bg-muted"
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function VerticalMenuItems({ items }: { items: MenuItem[] }) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (menuKey: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <ul className={`flex flex-col ${MENU_ITEM_GAP}`}>
      {items.map((item) => {
        const menuKey = `menu-${item.id}`;
        const isOpen = openSubmenus[menuKey];

        return (
          <li key={item.id}>
            <div className="flex items-center">
              <a
                href={item.href || "#"}
                className="inline-flex min-h-12 flex-1 items-center px-3 text-sm text-foreground hover:text-foreground hover:bg-muted rounded-md"
              >
                {item.title}
              </a>
              {item._hasSubmenu && (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`Show submenu for ${item.title}`}
                  onClick={() => toggleSubmenu(menuKey)}
                  className="inline-flex min-h-12 min-w-12 items-center justify-center text-muted-foreground hover:text-foreground rounded"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
            {item._hasSubmenu && isOpen && (
              <ul className={`${MENU_NESTED_INDENT} flex flex-col ${MENU_ITEM_GAP}`}>
                {item._children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href || "#"}
                      className="flex min-h-12 items-center px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Menu({
  menuName,
  menuLevel = "1",
  menuDepth = "0",
  displayMode = "hamburger",
  variation,
  alignment = "left",
  columns = "0",
}: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // In Drupal/Canvas context: fetch directly (same-origin).
  // In Next.js context: use the /api/menu proxy to avoid CORS.
  const isDrupalContext =
    typeof window !== "undefined" &&
    !!(window as any).drupalSettings?.canvasData;

  const fetchUrl = menuName
    ? isDrupalContext
      ? `/system/menu/${menuName}/linkset`
      : `/api/menu/${menuName}`
    : null;

  const { data, error, isLoading } = useSWR(fetchUrl, (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    }),
  );

  if (!menuName) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground italic">
        Set a menu name to display navigation.
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">Loading menu...</div>
    );
  }
  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-destructive">
        Error loading menu: {error.message}
      </div>
    );
  }
  if (!data) return null;

  const tree = sortLinksetMenu(data) as MenuItem[];
  const filtered = filterMenuTree(
    tree,
    parseInt(menuLevel, 10),
    parseInt(menuDepth, 10),
  );

  if (filtered.length === 0) return null;

  const navVariationClass = variation ? variationClasses[variation] : "";

  // Items mode — inline items with alignment/columns support, no hamburger logic.
  if (displayMode === "items") {
    return (
      <nav aria-label={`${menuName} navigation`} className={navVariationClass}>
        <MenuItems items={filtered} alignment={alignment} columns={columns} />
      </nav>
    );
  }

  if (displayMode === "vertical") {
    return (
      <nav aria-label={`${menuName} navigation`} className={navVariationClass}>
        <VerticalMenuItems items={filtered} />
      </nav>
    );
  }

  if (displayMode === "horizontal") {
    return (
      <nav aria-label={`${menuName} navigation`} className={navVariationClass}>
        <MenuItems items={filtered} alignment={alignment} columns={columns} />
      </nav>
    );
  }

  // Hamburger mode — uses JS viewport detection instead of CSS breakpoints
  // because the Canvas editor preview doesn't trigger CSS media queries.
  if (isMobile) {
    return (
      <nav aria-label={`${menuName} navigation`} className={navVariationClass}>
        <button
          type="button"
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        {menuOpen && (
          <div className="border-t border-border py-2">
            <VerticalMenuItems items={filtered} />
          </div>
        )}
      </nav>
    );
  }

  // Desktop: horizontal menu
  return (
    <nav aria-label={`${menuName} navigation`} className={navVariationClass}>
      <MenuItems items={filtered} alignment={alignment} columns={columns} />
    </nav>
  );
}
