import fs from "node:fs";
import path from "node:path";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { FLOW_DARK_SCOPE_CLASS } from "./flowDarkScopeClass";

/** Extracts the declarations of the rule with exactly this selector */
function declarationsOf(css: string, selector: string): string {
  const start = css.indexOf(`${selector}{`);
  if (start < 0) {
    throw new Error(`Flow CSS has no rule for ${selector}`);
  }
  const from = start + selector.length + 1;
  return css.slice(from, css.indexOf("}", from));
}

/**
 * Lets sections show Flow in dark mode, whatever the page's color mode
 * (`.flow-dark-scope`). Flow switches its tokens on `:root[data-theme]` only,
 * and its component tokens are resolved there, so changing a few colors on a
 * section is not enough: the scope declares all of Flow's tokens again, with
 * the dark values. They are taken from Flow's CSS at build time, so they stay
 * in sync with Flow updates.
 */
export default function flowDarkScopePlugin(context: LoadContext): Plugin {
  const flowCss = fs.readFileSync(
    require.resolve("@mittwald/flow-react-components/all.css"),
    "utf-8",
  );
  const scope = `.${FLOW_DARK_SCOPE_CLASS}`;
  const css = [
    `${scope}{${declarationsOf(flowCss, ":root")};${declarationsOf(flowCss, ":root[data-theme=dark]")};color-scheme:dark}`,
    `${scope} [class*=flow--]{color-scheme:dark}`,
  ].join("\n");

  const file = path.join(context.generatedFilesDir, "flow-dark-scope.css");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, css);

  return {
    name: "flow-dark-scope",
    getClientModules() {
      return [file];
    },
  };
}
