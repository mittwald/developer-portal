import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Schema from "@site/src/components/openapi/Schema";
import SchemaExample from "@site/src/components/openapi/SchemaExample";
import { APIVersion } from "@site/src/openapi/specs";
import { OpenAPIV3 } from "openapi-types";

interface Props {
  schema: OpenAPIV3.SchemaObject;
}

/**
 * This component renders a schema with an example in a tabbed view.
 *
 * @param schema The schema to render and to generate an example for
 * @see Schema
 * @see SchemaExample
 */
export default function SchemaWithExample({ schema }: Props) {
  return (
    <Tabs groupId="component" defaultValue="schema">
      <TabItem value="schema" label="Schema">
        <Schema schema={schema} />
      </TabItem>
      <TabItem value="example" label="Example">
        <SchemaExample schema={schema} />
      </TabItem>
    </Tabs>
  );
}