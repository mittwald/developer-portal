import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDocsVersion } from "@docusaurus/plugin-content-docs/client";
import type { Props } from "@theme/DocVersionBadge";
import { Badge } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Version of the current doc (e.g. on the API v1 docs) as Flow badge.
 * Ejected from @docusaurus/theme-classic.
 */
export default function DocVersionBadge({ className }: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  if (!versionMetadata.badge) {
    return null;
  }
  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBadge,
        styles.badge,
      )}
    >
      <Badge>
        <Translate
          id="theme.docs.versionBadge.label"
          values={{ versionLabel: versionMetadata.label }}
        >
          {"Version: {versionLabel}"}
        </Translate>
      </Badge>
    </div>
  );
}
