import React, { ReactNode } from "react";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import Admonition from "@theme/Admonition";

type PlanDefinition = {
  name: string;
  url: string;
};

const planNames: Record<string, PlanDefinition> = {
  psl: { name: "proSpace lite", url: "https://www.mittwald.de/prospace" },
  ps: { name: "proSpace", url: "https://www.mittwald.de/prospace" },
  ss: { name: "Space Server", url: "https://www.mittwald.de/space-server" }
};

export interface PlanCompatibilityProps {
  plans: string[];
}

export default function PlanCompatibility({ plans }: PlanCompatibilityProps) {
  const names: ReactNode = plans
    .map(
      (plan): ReactNode => (
        <Link to={planNames[plan].url} target="_blank">
          {planNames[plan].name}
        </Link>
      )
    )
    .map((n): ReactNode => <span className={styles.compatName}>{n}</span>)
    .reduce((prev, curr) => [prev, ", ", curr]);

  return (
    <Admonition type={"note"} title={translate({ id: "compat.title" })}>
      <p>
        <Translate id="compat.body">
          This documentation applies only to the following plans
        </Translate>
        : {names}.
      </p>
    </Admonition>
  );
}
