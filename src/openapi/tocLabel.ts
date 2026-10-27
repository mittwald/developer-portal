import { translate } from "@docusaurus/Translate";

/**
 * Docusaurus builds the table of contents as HTML strings at compile time, so
 * a heading translated with <Translate> shows up there with its default
 * (English) text. The generated operation pages use such headings
 * (generator/templates/operation.mdx.ejs); this returns the TOC label (HTML)
 * for a heading, translated where needed.
 */
export default function tocLabel(id: string, value: string): string {
  if (!value.startsWith("<Translate>")) {
    return value;
  }
  switch (id) {
    case "usage-examples":
      return escapeHTML(
        translate({
          id: "openapi.operation.usage.title",
          message: "Usage examples",
        }),
      );
    default:
      return value;
  }
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
