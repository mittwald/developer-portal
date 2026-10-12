import {
  APIVersion,
  getOperationByTag,
  OperationWithMeta,
  useSpec,
} from "@site/src/openapi/specs";
import compareOperation from "@site/src/openapi/compareOperation";
import { typedList } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "@site/src/components/openapi/OperationPath";
import { Deprecated } from "@site/src/components/openapi/RequiredOptional";
import { buildOperationUrl } from "@site/src/components/openapi/OperationLink";
import isDeprecated from "@site/src/openapi/isDeprecated";
import operationSummary from "@site/src/openapi/operationSummary";
import { translate } from "@docusaurus/Translate";

interface Props {
  apiVersion: APIVersion;
  tag: string;
}

type EnrichedOperation = OperationWithMeta & {
  title: string;
  deprecationState: "deprecated" | "not deprecated";
};

const OperationList = typedList<EnrichedOperation>();

export default function OperationDocCardList(p: Props) {
  const spec = useSpec(p.apiVersion);

  const operations: EnrichedOperation[] = getOperationByTag(spec, p.tag)
    .sort(compareOperation)
    .map((o) => ({
      ...o,
      ...o.operation,
      title: operationSummary(p.apiVersion, o.operation),
      deprecationState: isDeprecated(o.operation)
        ? "deprecated"
        : "not deprecated",
    }));

  const methodLabel = translate({
    id: "openapi.operations.method",
    message: "Method",
  });
  const pathLabel = translate({
    id: "openapi.operations.path",
    message: "Path",
  });

  return (
    <OperationList.List batchSize={100} aria-label={p.tag}>
      <OperationList.StaticData data={operations} />
      <OperationList.Search autoSubmit />
      <OperationList.Sorting property="method" name={methodLabel} />
      <OperationList.Sorting property="path" name={pathLabel} defaultEnabled />
      <OperationList.Filter property="method" mode="some" name={methodLabel} />
      <OperationList.Filter
        property="deprecationState"
        mode="some"
        name={translate({
          id: "openapi.operations.filter.deprecation",
          message: "Deprecation",
        })}

        defaultSelected={["not deprecated"]}
      >
        {/* The values are the badge texts, which are not translated */}
        {(value) =>
          value === "deprecated"
            ? "deprecated"
            : translate({
                id: "openapi.operations.filter.notdeprecated",
                message: "not deprecated",
              })
        }
      </OperationList.Filter>
      <OperationList.Item
        href={(op) => buildOperationUrl(p.apiVersion, op.operation)}
      >
        {(op) => (
          <OperationList.ItemView>
            <Heading>
              <HTTPMethod method={op.method} />
              {op.title}
              {op.deprecationState === "deprecated" && <Deprecated />}
            </Heading>
            <Text>
              <OperationPath path={op.path} />
            </Text>
          </OperationList.ItemView>
        )}
      </OperationList.Item>
    </OperationList.List>
  );
}
