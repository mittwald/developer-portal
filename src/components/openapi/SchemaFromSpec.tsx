import Schema from "@site/src/components/openapi/Schema";
import { useEffect, useState } from "react";
import { OpenAPIV3 } from "openapi-types";
import TabItem from "@theme/TabItem";
import SchemaExample from "@site/src/components/openapi/SchemaExample";
import Tabs from "@theme/Tabs";

type APIVersion = `v${number}`;

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
 * @todo This component should be refactored to support static site generation;
 *    right now, it only works on the browser and loads the entire OpenAPI spec
 *    for each render.
 */
function SchemaFromSpec({ apiVersion, path, withExample }: Props) {
  const [spec, setSpec] = useState<OpenAPIV3.Document | null>(null);

  useEffect(() => {
    (async () => {
      const specURL = `https://api.mittwald.de/${apiVersion}/openapi.json`;
      const spec = await (await fetch(specURL)).json();

      setSpec(spec);
    })();
  }, [apiVersion, path]);

  if (spec === null) {
    return <p>Loading...</p>;
  }

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
    return <Tabs groupId="component" defaultValue="schema">
      <TabItem value="schema" label="Schema">
        <Schema schema={current} />
      </TabItem>
      <TabItem value="example" label="Example">
        <SchemaExample schema={current} />
      </TabItem>
    </Tabs>;
  }

  return <Schema schema={current} />;
}

export default SchemaFromSpec;