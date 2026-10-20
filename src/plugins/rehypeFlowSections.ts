/**
 * Groups the top-level content of a Markdown page into sections, one per
 * `h2` (content before the first `h2` forms its own section). The sections
 * carry `data-flow-section`, which MDXComponents renders as a Flow `Section`.
 *
 * Only root-level nodes are grouped, so headings inside components (tabs,
 * admonitions, …) stay where they are. MDX ESM nodes (imports/exports) stay
 * at the root, where MDX expects them. Thematic breaks at the end of a
 * section are dropped, as Flow separates the sections itself.
 */

interface Node {
  type: string;
  tagName?: string;
  value?: string;
  children?: Node[];
  properties?: Record<string, unknown>;
}

function isWhitespace(node: Node) {
  return node.type === "text" && !node.value?.trim();
}

function isThematicBreak(node: Node) {
  return node.type === "element" && node.tagName === "hr";
}

function isFootnotes(node: Node) {
  return (
    node.type === "element" &&
    node.tagName === "section" &&
    node.properties?.dataFootnotes !== undefined
  );
}

function createSection(children: Node[]): Node {
  return {
    type: "element",
    tagName: "section",
    properties: { dataFlowSection: true },
    children,
  };
}

export default function rehypeFlowSections() {
  return (tree: Node) => {
    const root: Node[] = [];
    let current: Node[] = [];

    const flush = () => {
      // A thematic break ("---") at the end of a section would double the
      // separator Flow draws between sections
      while (
        current.length > 0 &&
        (isWhitespace(current[current.length - 1]!) ||
          isThematicBreak(current[current.length - 1]!))
      ) {
        current.pop();
      }
      if (current.some((node) => !isWhitespace(node))) {
        root.push(createSection(current));
      }
      current = [];
    };

    for (const node of tree.children ?? []) {
      if (node.type === "mdxjsEsm") {
        root.push(node);
        continue;
      }
      // The footnotes (appended by remark-gfm) form a section of their own
      if (isFootnotes(node)) {
        flush();
        node.properties = { ...node.properties, dataFlowSection: true };
        root.push(node);
        continue;
      }
      if (node.type === "element" && node.tagName === "h2") {
        flush();
      }
      current.push(node);
    }
    flush();

    tree.children = root;
  };
}
