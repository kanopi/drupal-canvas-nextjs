import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for Drupal's Linkset menu API.
 *
 * Avoids CORS issues by fetching server-side from the Drupal backend
 * and returning the response to the browser.
 *
 * GET /api/menu/main → proxies to DRUPAL_BASE_URL/system/menu/main/linkset
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ menuName: string }> },
) {
  const { menuName } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_DRUPAL_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${baseUrl}/system/menu/${menuName}/linkset`,
      {
        headers: { Accept: "application/linkset+json" },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Drupal returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch menu from Drupal" },
      { status: 502 },
    );
  }
}
