const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "";

export async function GET() {
  let siteName = "Drupal Canvas Site";
  let siteSlogan = "";

  if (DRUPAL_BASE_URL) {
    try {
      const res = await fetch(`${DRUPAL_BASE_URL}/api/site-branding`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        siteName = data?.branding?.siteName || siteName;
        siteSlogan = data?.branding?.siteSlogan || "";
      }
    } catch {
      // Use defaults.
    }
  }

  const lines = [
    `# ${siteName}`,
    "",
    siteSlogan ? `> ${siteSlogan}` : "",
    "",
    "This site is built with Drupal Canvas and Next.js.",
    "Content is managed through Drupal and rendered via a decoupled Next.js frontend.",
    "",
    "## Pages",
    "",
    "Pages are dynamically generated from Drupal Canvas content.",
    "Navigate to / for the homepage.",
  ].filter(Boolean);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
