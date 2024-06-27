import { OpenAPIV3 } from "openapi-types";
import Tabs from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import generateCurlCodeExample from "@site/src/openapi/generateCurlCodeExample";
import generateJavascriptCodeExample from "@site/src/openapi/generateJavascriptCodeExample";
import generatePHPCodeExample from "@site/src/openapi/generatePHPCodeExample";
import { ReactElement } from "react";

interface OperationUsageProps {
  method: string;
  url: string;
  spec: OpenAPIV3.OperationObject;
  baseURL: string;
  withJavascript?: boolean;
  withPHP?: boolean;
  children?: ReactElement<TabItemProps>[] | ReactElement<TabItemProps>;
}

export function OperationUsage(props: OperationUsageProps) {
  const {
    method,
    url,
    spec,
    baseURL,
    withJavascript = true,
    withPHP = true,
  } = props;
  let { children = [] } = props;

  if (!Array.isArray(children)) {
    children = [children];
  }

  if (withPHP && !children.some((i) => i.key === "php")) {
    children.unshift(
      <TabItem key="php" value="php" label="PHP SDK">
        <CodeBlock language="php">
          {generatePHPCodeExample(method, url, spec, baseURL)}
        </CodeBlock>
      </TabItem>,
    );
  }

  if (withJavascript && !children.some((i) => i.key === "javascript")) {
    children.unshift(
      <TabItem key="javascript" value="javascript" label="JavaScript SDK">
        <CodeBlock language="javascript">
          {generateJavascriptCodeExample(method, url, spec, baseURL)}
        </CodeBlock>
      </TabItem>,
    );
  }

  if (!children.some((i) => i.key === "curl")) {
    children.unshift(
      <TabItem key="curl" value="curl" label="cURL">
        <CodeBlock language="shell-session">
          {generateCurlCodeExample(method, url, spec, baseURL)}
        </CodeBlock>
      </TabItem>,
    );
  }

  return (
    <Tabs groupId="usage-language" defaultValue="curl">
      {children}
    </Tabs>
  );
}
