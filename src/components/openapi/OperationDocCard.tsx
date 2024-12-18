import Link from "@docusaurus/Link";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./OperationDocCard.module.css";
import clsx from "clsx";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";
import { APIVersion, OperationWithMeta } from "@site/src/openapi/specs";
import isDeprecated from "@site/src/openapi/isDeprecated";
import buildDocumentId from "@site/src/openapi/buildDocumentId";
import OperationLink from "@site/src/components/openapi/OperationLink";

interface Props {
  apiVersion: APIVersion;
  operation: OperationWithMeta;
  variant?: "compact";
}

export default function OperationDocCard(p: Props) {
  const { apiVersion, variant } = p;
  const { operation, method, path } = p.operation;
  const deprecated = isDeprecated(operation);

  return (
    <div
      className={clsx(
        "card",
        variant === "compact" ? "margin-bottom--xs" : "margin-bottom--md",
        styles.card,
        deprecated ? styles.deprecated : null,
        variant === "compact" ? styles.compact : null,
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
            <AlertBadge status="warning">deprecated!</AlertBadge>
          ) : null}
        </div>
      </OperationLink>
    </div>
  );
}
