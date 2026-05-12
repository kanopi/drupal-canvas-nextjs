import { getPageData } from "drupal-canvas";

interface PageTitleProps {
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const headingStyles: Record<string, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

export default function PageTitle({ headingElement = "h1" }: PageTitleProps) {
  const { pageTitle } = getPageData();

  if (!pageTitle) return null;

  const HeadingTag = headingElement;

  return <HeadingTag className={headingStyles[HeadingTag] ?? headingStyles.h1}>{pageTitle}</HeadingTag>;
}
