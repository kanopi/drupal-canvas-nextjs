"use client";

import useSWR from "swr";
import { getSiteData } from "drupal-canvas";

interface BrandingProps {
  showLogo?: boolean;
  showSiteName?: boolean;
  showSiteSlogan?: boolean;
}

export default function Branding({
  showLogo = true,
  showSiteName = true,
  showSiteSlogan = true,
}: BrandingProps) {
  // In Drupal/Canvas context, getSiteData() reads from drupalSettings.
  // In Next.js context, fetch from the /api/site-data proxy.
  const isDrupalContext =
    typeof window !== "undefined" &&
    !!(window as any).drupalSettings?.canvasData;

  const drupalData = isDrupalContext ? getSiteData() : null;

  const { data: fetchedData } = useSWR(
    isDrupalContext ? null : "/api/site-data",
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const siteData = drupalData || fetchedData;
  if (!siteData) return null;

  const { homeUrl, siteName, siteSlogan } = siteData.branding || {};
  const logoUrl = siteData.themeAssets?.logo?.url;

  if (!siteName && !siteSlogan && !logoUrl) return null;

  const hasLink = showLogo && logoUrl || showSiteName && siteName;

  const inner = (
    <>
      {showLogo && logoUrl && (
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="h-8 w-auto flex-shrink-0"
        />
      )}
      {(showSiteName || showSiteSlogan) && (
        <div>
          {showSiteName && siteName && (
            <span className="text-xl font-bold text-foreground">{siteName}</span>
          )}
          {showSiteSlogan && siteSlogan && (
            <p className="text-sm text-muted-foreground">{siteSlogan}</p>
          )}
        </div>
      )}
    </>
  );

  if (hasLink) {
    return (
      <a
        href={homeUrl || "/"}
        className="flex items-center gap-3 hover:opacity-80"
        aria-label={siteName || "Home"}
      >
        {inner}
      </a>
    );
  }

  return <div className="flex items-center gap-3">{inner}</div>;
}
