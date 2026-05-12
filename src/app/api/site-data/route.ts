import { NextResponse } from "next/server";

/**
 * Proxy for Drupal site data (branding, theme assets).
 *
 * Fetches from the nextjs_extras module's /api/site-branding endpoint
 * which returns site name, slogan, home URL, and logo path.
 *
 * GET /api/site-data
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_DRUPAL_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/site-branding`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Drupal returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Make relative logo URLs absolute for the Next.js frontend
    let logoUrl = data.themeAssets?.logo?.url || "";
    if (logoUrl && !logoUrl.startsWith("http")) {
      logoUrl = `${baseUrl}${logoUrl}`;
    }

    return NextResponse.json({
      branding: data.branding || {
        homeUrl: "/",
        siteName: "",
        siteSlogan: "",
      },
      baseUrl,
      themeAssets: {
        logo: { url: logoUrl },
        favicon: { url: "", mimeType: "" },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site data from Drupal" },
      { status: 502 },
    );
  }
}
