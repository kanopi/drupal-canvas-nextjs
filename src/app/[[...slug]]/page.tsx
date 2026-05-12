import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getDraftData } from "next-drupal/draft";
import { drupal } from "@/lib/drupal";
import type { CanvasPageResource } from "@/lib/canvas-tree";
import { CanvasRenderer } from "@/lib/canvas-renderer";
import "@/components/canvas";

export const dynamic = "force-dynamic";

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

async function resolveMediaImage(
  targetId: number,
): Promise<{ src: string; alt: string; width: number; height: number } | null> {
  if (!DRUPAL_BASE_URL) return null;
  try {
    const res = await fetch(
      `${DRUPAL_BASE_URL}/api/media-resolve?ids=${targetId}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[String(targetId)] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") ?? "");

  const page = await fetchCanvasPage(path, false);
  if (!page) return {};

  const metadata: Metadata = {
    title: page.title,
    openGraph: {
      title: page.title,
    },
  };

  if (page.description) {
    metadata.description = page.description;
    if (metadata.openGraph) {
      (metadata.openGraph as Record<string, unknown>).description = page.description;
    }
  }

  const imageTargetId = page.image?.meta?.drupal_internal__target_id;
  if (imageTargetId) {
    const image = await resolveMediaImage(imageTargetId);
    if (image) {
      metadata.openGraph = {
        ...metadata.openGraph,
        images: [
          {
            url: image.src,
            width: image.width,
            height: image.height,
            alt: image.alt,
          },
        ],
      };
    }
  }

  return metadata;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") ?? "");

  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  const page = await fetchCanvasPage(path, isDraftMode);

  if (!page) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-gray-600">
          No canvas page found at <code>{path}</code>
        </p>
      </div>
    );
  }

  // Hide unpublished content unless in draft mode.
  if (!isDraftMode && page.status === false) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Not Found</h1>
      </div>
    );
  }

  return (
    <>
      {isDraftMode && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-sm text-amber-800">
          Draft mode enabled.{" "}
          <a href="/api/disable-draft" className="underline">
            Exit
          </a>
        </div>
      )}
      <CanvasRenderer components={page.components ?? []} />
    </>
  );
}

async function fetchCanvasPage(
  path: string,
  isDraftMode: boolean
): Promise<CanvasPageResource | null> {
  try {
    const translated = await drupal.translatePath(path);

    if (!translated?.jsonapi?.resourceName) {
      return null;
    }

    const type = translated.jsonapi.resourceName;
    const uuid = translated.entity.uuid;

    // In draft mode, fetch the working copy (latest revision).
    const params: Record<string, string> = {};
    if (isDraftMode) {
      const draftData = await getDraftData();
      if (draftData?.resourceVersion) {
        params.resourceVersion = draftData.resourceVersion;
      }
    }

    const hasAuth = !!(process.env.DRUPAL_CLIENT_ID && process.env.DRUPAL_CLIENT_SECRET);

    const resource = await drupal.getResource<CanvasPageResource>(type, uuid, {
      params,
      withAuth: isDraftMode && hasAuth,
    });

    // Fetch page metadata (image, description) from custom endpoint.
    // JSON:API strips relationships during deserialization, so we use
    // a dedicated API that returns the image media target_id directly.
    const entityId = translated.entity.id;
    if (resource && entityId) {
      try {
        const metaRes = await fetch(
          `${DRUPAL_BASE_URL}/api/page-meta/${entityId}`,
          { next: { revalidate: 300 } },
        );
        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (meta.description) resource.description = meta.description;
          if (meta.image_target_id) {
            resource.image = {
              type: "media--image",
              id: "",
              meta: { drupal_internal__target_id: meta.image_target_id },
            };
          }
        }
      } catch {
        // Metadata is optional — continue without it.
      }
    }

    return resource;
  } catch (error) {
    console.error(`Failed to fetch canvas page at ${path}:`, error);
    return null;
  }
}
