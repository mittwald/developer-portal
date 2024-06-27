import Link from "@docusaurus/Link";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./OperationDocCard.module.css";
import clsx from "clsx";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import { APIVersion, OperationWithMeta } from "@site/src/openapi/specs";
import isDeprecated from "@site/src/openapi/isDeprecated";
import buildDocumentId from "@site/src/openapi/buildDocumentId";

interface Props {
  apiVersion: APIVersion;
  operation: OperationWithMeta;
  variant?: "compact";
}

export default function OperationDocCard(p: Props) {
  const { apiVersion, variant } = p;
  const { operation, method, path } = p.operation;
  const deprecated = isDeprecated(operation);
  const docId = buildDocumentId(operation);

  return (
    <div
      className={clsx(
        "card",
        variant === "compact" ? "margin-bottom--xs" : "margin-bottom--md",
        styles.card,
        deprecated ? styles.deprecated : null,
        variant === "compact" ? styles.compact : null
      )}
    >
      <Link to={`/docs/${apiVersion}/${docId}`}>
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
            <StatusBadge status="warning">deprecated!</StatusBadge>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
