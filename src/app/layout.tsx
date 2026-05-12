import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { CanvasComponent } from "@/lib/canvas-tree";
import "@/canvas-global.css";
import "@/components/canvas";
import { CanvasRenderer } from "@/lib/canvas-renderer";
import { fetchPageRegions } from "@/lib/page-regions";
import { PageRegions } from "@/components/PageRegions";

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "";

interface SiteBranding {
  siteName: string;
  faviconUrl: string;
  faviconMimeType: string;
}

async function fetchSiteBranding(): Promise<SiteBranding> {
  const fallback: SiteBranding = { siteName: "Drupal", faviconUrl: "", faviconMimeType: "" };
  if (!DRUPAL_BASE_URL) return fallback;
  try {
    const res = await fetch(`${DRUPAL_BASE_URL}/api/site-branding`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const faviconUrl = data?.themeAssets?.favicon?.url || "";
    return {
      siteName: data?.branding?.siteName || "Drupal",
      faviconUrl: faviconUrl.startsWith("http") ? faviconUrl : (faviconUrl ? `${DRUPAL_BASE_URL}${faviconUrl}` : ""),
      faviconMimeType: data?.themeAssets?.favicon?.mimeType || "image/x-icon",
    };
  } catch {
    return fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, faviconUrl, faviconMimeType } = await fetchSiteBranding();
  const metadata: Metadata = {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
  };

  if (faviconUrl) {
    metadata.icons = {
      icon: { url: faviconUrl, type: faviconMimeType },
    };
  }

  return metadata;
}

function renderRegion(name: string, components: CanvasComponent[]): ReactNode {
  if (components.length === 0) {
    return null;
  }

  const content = <CanvasRenderer components={components} />;

  switch (name) {
    case "header":
      return (
        <header key={name} role="banner">
          {content}
        </header>
      );
    case "footer":
      return (
        <footer key={name} role="contentinfo">
          {content}
        </footer>
      );
    case "breadcrumb":
      return (
        <nav key={name} aria-label="Breadcrumb">
          {content}
        </nav>
      );
    case "primary_menu":
      return (
        <nav key={name} aria-label="Primary menu">
          {content}
        </nav>
      );
    case "secondary_menu":
      return (
        <nav key={name} aria-label="Secondary menu">
          {content}
        </nav>
      );
    case "sidebar_first":
    case "sidebar_second":
      return (
        <aside key={name} role="complementary">
          {content}
        </aside>
      );
    default:
      return (
        <div key={name} data-region={name}>
          {content}
        </div>
      );
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { beforeContent, afterContent } = await fetchPageRegions();

  // Inline script: applies the stored dark-mode preference before the page
  // paints, preventing a flash of light on dark-preferred sessions. Pairs with
  // the dark_mode_switch component, which writes to localStorage.theme.
  const darkModeBootstrap = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(s===null&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");}}catch(e){}})();`;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-neutral-900 focus:underline"
        >
          Skip to main content
        </a>
        <PageRegions>
          {Object.entries(beforeContent).map(([name, components]) =>
            renderRegion(name, components),
          )}
        </PageRegions>
        <main id="main-content">
          <div className="flex-1">{children}</div>
        </main>
        <PageRegions>
          {Object.entries(afterContent).map(([name, components]) =>
            renderRegion(name, components),
          )}
        </PageRegions>
      </body>
    </html>
  );
}
