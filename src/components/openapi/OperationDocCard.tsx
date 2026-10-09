import Link from "@docusaurus/Link";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./OperationDocCard.module.css";
import clsx from "clsx";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import { Badge } from "@mittwald/flow-react-components";
import { APIVersion, OperationWithMeta } from "@site/src/openapi/specs";
import isDeprecated from "@site/src/openapi/isDeprecated";
import buildDocumentId from "@site/src/openapi/buildDocumentId";
import OperationLink from "@site/src/components/openapi/OperationLink";

interface Props {
  apiVersion: APIVersion;
  operation: OperationWithMeta;
}

export default function OperationDocCard(p: Props) {
  const { apiVersion } = p;
  const { operation, method, path } = p.operation;
  const deprecated = isDeprecated(operation);

  return (
    <div
      className={clsx(
        "card",
        "margin-bottom--md",
        styles.card,
        deprecated ? styles.deprecated : null,
      )}
    >
      <OperationLink apiVersion={apiVersion} operation={p.operation}>
        <div className={styles.header}>
          <HTTPMethod method={method} deprecated={deprecated} />
          <div className={styles.headerText}>
            {operation.summary ? (
              <Markdown>{operation.summary}</Markdown>
            ) : null}
            <div className={styles.path}>
              <OperationPath path={path} />
            </div>
          </div>
          {deprecated ? (
            <Badge color="orange">deprecated!</Badge>
          ) : null}
        </div>
      </OperationLink>
    </div>
  );
}
