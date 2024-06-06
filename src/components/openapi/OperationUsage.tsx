import { OpenAPIV3 } from "openapi-types";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import generateCurlCodeExample from "@site/src/openapi/generateCurlCodeExample";
import generateJavascriptCodeExample from "@site/src/openapi/generateJavascriptCodeExample";
import generatePHPCodeExample from "@site/src/openapi/generatePHPCodeExample";

interface OperationUsageProps {
  method: string,
  url: string,
  spec: OpenAPIV3.OperationObject,
  baseURL: string
}

export function OperationUsage({ method, url, spec, baseURL }: OperationUsageProps) {
  return <Tabs groupId="usage-language" defaultValue="curl">
    <TabItem value="curl" label="cURL">
      <CodeBlock language="shell-session">{generateCurlCodeExample(method, url, spec, baseURL)}</CodeBlock>
    </TabItem>
    <TabItem value="javascript" label="JavaScript SDK">
      <CodeBlock language="javascript">{generateJavascriptCodeExample(method, url, spec, baseURL)}</CodeBlock>
    </TabItem>
    <TabItem value="php" label="PHP SDK">
      <CodeBlock language="php">{generatePHPCodeExample(method, url, spec, baseURL)}</CodeBlock>
    </TabItem>
  </Tabs>;
}
