/**
 * Groups the top-level content of a Markdown page into sections, one per
 * `h2` (content before the first `h2` forms its own section). The sections
 * carry `data-flow-section`, which MDXComponents renders as a Flow `Section`.
 *
 * Only root-level nodes are grouped, so headings inside components (tabs,
 * admonitions, …) stay where they are. MDX ESM nodes (imports/exports) stay
 * at the root, where MDX expects them.
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
      if (node.type === "element" && node.tagName === "h2") {
        flush();
      }
      current.push(node);
    }
    flush();

    tree.children = root;
  };
}
