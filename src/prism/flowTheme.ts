// Copied from the Flow docs (mittwald/flow, apps/docs/src/lib/liveCode/
// components/LiveCodeEditor/lib/flowTheme.ts). It only references Flow design
// tokens, so one theme covers light and dark mode.
import { type PrismTheme } from "prism-react-renderer";

/**
 * Colors the live editor's code like Flow's `CodeBlock`, whose CodeMirror theme
 * maps the same syntax tokens. Prism nests its tokens and merges the styles of
 * all of them, outermost first — so `script`, the JavaScript inside a JSX tag,
 * resets to the plain color instead of inheriting the tag's.
 *
 * Prism leaves identifiers untokenized, so they take the plain color, which is
 * the variable color CodeMirror gives them. Only the text between JSX tags
 * keeps the content color.
 */
export const flowTheme: PrismTheme = {
  plain: {
    // Deviates from the Flow docs (variable color): many portal code blocks
    // are untokenized shell output or CLI help, which would be all blue
    color: "var(--code-block--content-color)",
    backgroundColor: "var(--code-block--background-color)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--color--code-syntax--comment)",
        fontStyle: "italic",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "var(--color--code-syntax--keyword)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "var(--color--code-syntax--string)",
      },
    },
    {
      types: ["number", "boolean", "constant", "builtin"],
      style: {
        color: "var(--color--code-syntax--number)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "var(--color--code-syntax--function)",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "var(--color--code-syntax--variable)",
      },
    },
    {
      types: ["property"],
      style: {
        color: "var(--color--code-syntax--property)",
      },
    },
    {
      types: ["class-name", "type"],
      style: {
        color: "var(--color--code-syntax--type)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--color--code-syntax--operator)",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--color--code-syntax--comment)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "var(--color--code-syntax--type)",
      },
    },
    {
      types: ["script", "maybe-class-name"],
      style: {
        color: "var(--color--code-syntax--variable)",
      },
    },
    {
      types: ["plain-text"],
      style: {
        color: "var(--code-block--content-color)",
      },
    },
    {
      types: ["property-access"],
      style: {
        color: "var(--color--code-syntax--property)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--color--code-syntax--property)",
      },
    },
    {
      types: ["attr-value"],
      style: {
        color: "var(--color--code-syntax--string)",
      },
    },
    {
      types: ["attr-equals"],
      style: {
        color: "var(--color--code-syntax--operator)",
      },
    },
    {
      types: ["invalid"],
      style: {
        color: "var(--color--code-syntax--invalid)",
        textDecorationLine: "underline",
      },
    },
  ],
};
