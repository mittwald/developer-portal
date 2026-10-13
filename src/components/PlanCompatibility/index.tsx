import React, { ReactNode } from "react";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import MDXComponents from "@theme/MDXComponents";
import { Text } from "@mittwald/flow-react-components";
import Admonition from "@theme/Admonition";

// Rendered like any other Markdown link (Flow link, external link icon)
const MDXLink = MDXComponents.a;

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
    .map((feature): ReactNode =>
      featureDefinitions[feature].url ? (
        <MDXLink href={featureDefinitions[feature].url}>
          <Translate id={`compat.${feature}`} />
        </MDXLink>
      ) : (
        <Translate id={`compat.${feature}`} />
      ),
    )
    .map((n): ReactNode => <span className={styles.compatName}>{n}</span>)
    .reduce((prev, curr) => [prev, ", ", curr]);

  return (
    <Admonition type={"note"} title={translate({ id: "compat.title" })}>
      <Text elementType="p">
        <Translate id="compat.body">
          This documentation requires the following mStudio features which might
          not be available in all hosting plans
        </Translate>
        : {names}.
      </Text>
    </Admonition>
  );
}
