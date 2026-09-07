// Matches inline code spans (including those delimited by multiple backticks),
// so that their contents can be left untouched when escaping.
const codeSpan = /(`+[^`]*`+)/;

/**
 * Escapes characters that MDX would otherwise interpret as an expression or as
 * JSX. This is relevant for text that originates from the API specification
 * (like operation summaries or change descriptions), which regularly contains
 * path templates like `/v2/customers/{customerId}`.
 *
 * Content within inline code spans is left as-is; MDX does not interpret it,
 * and the backslashes would end up being rendered verbatim.
 */
export function escapeMdx(text: string): string;
export function escapeMdx(text: string | undefined): string | undefined;
export function escapeMdx(text: string | undefined): string | undefined {
  if (!text) {
    return text;
  }

  return text
    .split(codeSpan)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/[{}<>]/g, "\\$&")))
    .join("");
}
