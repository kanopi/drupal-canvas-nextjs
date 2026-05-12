import { drupal } from "@/lib/drupal";
import { enableDraftMode } from "next-drupal/draft";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response | never> {
  // Type assertion needed: next-drupal 2.x expects Next.js 15 types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await enableDraftMode(request as any, drupal);
}
