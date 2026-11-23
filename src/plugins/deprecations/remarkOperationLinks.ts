const OPERATION_PREFIX = "operation:";

interface Node {
  type: string;
  url?: string;
  name?: string | null;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: Node[];
}

interface Options {
  /** Throws for unknown operations */
  validateOperation: (operationId: string, apiVersion: string) => void;
}

function attribute(name: string, value: string) {
  return { type: "mdxJsxAttribute", name, value };
}

/**
 * Remark plugin for the deprecation pages:
 *  - turns links to `operation:<operationId>` (or
 *    `operation:<apiVersion>/<operationId>`) into `<OperationLink>` elements;
 *    with an empty link text, e.g. `[](operation:project-list-projects)`,
 *    OperationLink shows method and path,
 *  - validates the operations of these links and of `<OperationLink>`
 *    elements written directly, so that unknown operations fail the build.
 */
export default function remarkOperationLinks({ validateOperation }: Options) {
  const validate = (operationId: string, apiVersion: string, file: string) => {
    try {
      validateOperation(operationId, apiVersion);
    } catch (error) {
      throw new Error(`${file}: ${(error as Error).message}`);
    }
  };

  return (tree: Node, vfile: { path?: string }) => {
    const file = vfile.path ?? "deprecation";

    const visit = (node: Node) => {
      if (node.type === "link" && node.url?.startsWith(OPERATION_PREFIX)) {
        const ref = node.url.slice(OPERATION_PREFIX.length);
        const [apiVersion, operationId] = ref.includes("/")
          ? ref.split("/", 2)
          : ["v2", ref];
        validate(operationId, apiVersion, file);

        Object.assign(node, {
          type: "mdxJsxTextElement",
          name: "OperationLink",
          attributes: [
            attribute("operation", operationId),
            attribute("apiVersion", apiVersion),
          ],
        });
        delete node.url;
      } else if (
        (node.type === "mdxJsxTextElement" ||
          node.type === "mdxJsxFlowElement") &&
        node.name === "OperationLink"
      ) {
        const value = (name: string) =>
          node.attributes?.find((a) => a.name === name)?.value;
        const operationId = value("operation");
        const apiVersion = value("apiVersion") ?? "v2";
        if (typeof operationId === "string" && typeof apiVersion === "string") {
          validate(operationId, apiVersion, file);
        }
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}
