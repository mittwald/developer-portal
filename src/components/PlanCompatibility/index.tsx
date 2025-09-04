import React, { ReactNode } from "react";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import Admonition from "@theme/Admonition";

type FeatureDefinition = {
  url?: string;
};

const featureDefinitions: Record<string, FeatureDefinition> = {
  nodejs: { url: "https://www.mittwald.de/produkte/nodejs" },
  container: { url: "https://www.mittwald.de/mstudio/container-hosting" },
  ai: { url: "https://www.mittwald.de/mstudio/ai-hosting" },
  redis: {},
};

export interface PlanCompatibilityProps {
  features: (keyof typeof featureDefinitions)[];
}

export default function PlanCompatibility({
  features,
}: PlanCompatibilityProps) {
  const names: ReactNode = features
    .map(
      (feature): ReactNode =>
        featureDefinitions[feature].url ? (
          <Link to={featureDefinitions[feature].url} target="_blank">
            <Translate id={`compat.${feature}`} />
          </Link>
        ) : (
          <Translate id={`compat.${feature}`} />
        ),
    )
    .map((n): ReactNode => <span className={styles.compatName}>{n}</span>)
    .reduce((prev, curr) => [prev, ", ", curr]);

  return (
    <Admonition type={"note"} title={translate({ id: "compat.title" })}>
      <p>
        <Translate id="compat.body">
          This documentation requires the following mStudio features which might
          not be available in all hosting plans
        </Translate>
        : {names}.
      </p>
    </Admonition>
  );
}
