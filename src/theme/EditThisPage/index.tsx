import React, { type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/EditThisPage";
import { Button, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconPencil } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * "Edit this page" as a Flow link combined with a button, the icon on the
 * right. Swizzled (ejected) from @docusaurus/theme-classic.
 */
export default function EditThisPage({ editUrl }: Props): ReactNode {
  return (
    <Link
      href={editUrl}
      target="_blank"
      className={`${ThemeClassNames.common.editThisPage} ${styles.link}`}
    >
      <Button variant="soft" color="secondary" size="s">
        <Text>
          {translate({
            id: "theme.common.editThisPage",
            message: "Edit this page",
            description: "The link label to edit the current page",
          })}
        </Text>
        <Icon>
          <IconPencil />
        </Icon>
      </Button>
    </Link>
  );
}
