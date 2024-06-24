import Link from "@docusaurus/Link";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./OperationDocCard.module.css";
import clsx from "clsx";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";

interface Props {
  method: string;
  path: string;
  docId: string;
  deprecated: boolean;
  summary: string;
}

function OperationDocCard(p: Props) {
  const { method, path, docId, deprecated, summary } = p;
  return <div className={clsx("card", "margin-bottom--md", styles.card, deprecated ? styles.deprecated : null)}>
    <Link to={"/docs/v2/" + docId}>
      <div className={styles.header}>
        <HTTPMethod method={method} deprecated={deprecated} />
        <div className={styles.path}>
          <OperationPath path={path} />
          {summary ? <Markdown>{summary}</Markdown> : null}
        </div>
        {deprecated ? <StatusBadge status="warning">deprecated!</StatusBadge> : null}
      </div>
    </Link>
  </div>;
}

export default OperationDocCard;