// Matches an inline code span: an opening run of backticks, its content, and a
// closing run of the same length. Spans delimited by a longer run may contain
// backticks themselves, so the closing run has to be matched via backreference
// rather than by simply looking for the next backtick.
const codeSpan = /(`+)[\s\S]*?\1(?!`)/g;

function escapeOutsideCode(text: string): string {
  return text.replace(/[{}<>]/g, "\\$&");
}

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

  let escaped = "";
  let offset = 0;

  for (const match of text.matchAll(codeSpan)) {
    escaped += escapeOutsideCode(text.slice(offset, match.index));
    escaped += match[0];
    offset = match.index + match[0].length;
  }

  return escaped + escapeOutsideCode(text.slice(offset));
}
