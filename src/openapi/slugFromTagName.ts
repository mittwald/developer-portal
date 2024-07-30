export function slugFromTagName(tagName: string): string {
  return tagName
    .replace(/ /g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/, "");
}
