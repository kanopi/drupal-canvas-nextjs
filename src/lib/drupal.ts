import { NextDrupal } from "next-drupal";

const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL!;
const clientId = process.env.DRUPAL_CLIENT_ID;
const clientSecret = process.env.DRUPAL_CLIENT_SECRET;

export const drupal = new NextDrupal(baseUrl, {
  ...(clientId && clientSecret
    ? { auth: { clientId, clientSecret } }
    : {}),
  debug: process.env.NODE_ENV === "development",
});
