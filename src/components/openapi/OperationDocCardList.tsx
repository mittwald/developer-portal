import {
  APIVersion,
  getOperationByTag,
  OperationWithMeta,
  useSpec,
} from "@site/src/openapi/specs";
import OperationDocCard from "@site/src/components/openapi/OperationDocCard";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import compareOperation from "@site/src/openapi/compareOperation";
import { typedList } from "@mittwald/flow-react-components/List";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import Avatar from "@mittwald/flow-react-components/Avatar";
import styles from "@site/src/components/openapi/OperationDocCardList.module.css";
import clsx from "clsx";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";
import OperationLink, {
  buildOperationUrl,
} from "@site/src/components/openapi/OperationLink";

interface Props {
  apiVersion: APIVersion;
  tag: string;
}

type EnrichedOperation = OperationWithMeta & {
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
      deprecationState: o.operation.deprecated
        ? "deprecated"
        : "not deprecated",
    }));

  return (
    <OperationList.List batchSize={100}>
      <OperationList.StaticData data={operations} />
      <OperationList.Search autoSubmit />
      <OperationList.Sorting property="method" name="Method" />
      <OperationList.Sorting property="path" name="Path" defaultEnabled />
      <OperationList.Filter property="method" mode="some" name="Method" />
      <OperationList.Filter
        property="deprecationState"
        mode="some"
        name="Deprecation"
        defaultSelected={["not deprecated"]}
      />
      <OperationList.Item
        href={(op) => buildOperationUrl(p.apiVersion, op.operation)}
      >
        {(op) => (
          <OperationList.ItemView>
            <Avatar
              className={clsx(styles.method, styles[`method-${op.method}`])}
            >
              {op.method}
            </Avatar>
            <Heading>
              {op.operation.summary}
              {op.operation.deprecated && (
                <AlertBadge status="warning">deprecated</AlertBadge>
              )}
            </Heading>
            <Text>{op.path}</Text>
          </OperationList.ItemView>
        )}
      </OperationList.Item>
    </OperationList.List>
  );
}
