import React from "react";
import type AdmonitionType from "@theme/Admonition";
import type { WrapperProps } from "@docusaurus/types";
import { Alert } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { translate } from "@docusaurus/Translate";
import { processAdmonitionProps } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

type Props = WrapperProps<typeof AdmonitionType>;

// The default labels are lowercase ("note", "important"); Docusaurus only
// capitalizes them via CSS
function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function AdmonitionWrapper(
  unprocessedProps: Props,
): React.JSX.Element {
  // Moves a title given in Markdown (":::note[Title]"), which MDX passes as
  // first child, to the title prop; otherwise it would stay an (empty)
  // element in the content
  const props = processAdmonitionProps(unprocessedProps);
  const status =
    props.type === "danger"
      ? "danger"
      : props.type === "warning" || props.type === "caution"
        ? "warning"
        : "info";

  return (
    <Alert status={status}>
      <Heading>
        {props.title ??
          capitalize(
            translate({
              id: `theme.admonition.${props.type}`,
              message: props.type,
            }),
          )}
      </Heading>
      <Content className={styles.content}>{props.children}</Content>
    </Alert>
  );
}
