import Schema from "@site/src/components/openapi/Schema";
import TabItem from "@theme/TabItem";
import SchemaExample from "@site/src/components/openapi/SchemaExample";
import Tabs from "@theme/Tabs";
import { APIVersion, specs } from "@site/src/openapi/specs";
import SchemaWithExample from "@site/src/components/openapi/SchemaWithExample";

interface Props {
  apiVersion: APIVersion;
  ref: string;
  withExample: boolean;
}

/**
 * Fetches the OpenAPI spec from the mittwald API and renders the schema at the given path.
 *
 * @param apiVersion API version from which to load the schema ("v1", "v2", etc.)
 * @param path The path to the schema in the OpenAPI spec
 * @param withExample Whether to render an example of the schema
 */
export default function SchemaFromSpec({
  apiVersion,
  path,
  withExample,
}: Props) {
  const spec = specs[apiVersion];

  let refPath = path.split("/");
  let current = spec;

  while (refPath.length > 0) {
    const key = refPath.shift();
    if (key === "#") {
      continue;
    }

    current = current[key];
  }

  if (withExample) {
    return <SchemaWithExample schema={current} />;
  }

  return <Schema schema={current} />;
}
