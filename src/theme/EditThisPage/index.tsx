import React, { type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/EditThisPage";
import { Button, Icon, Link } from "@mittwald/flow-react-components";
import { IconPencil } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * "Edit this page" as a Flow link combined with an icon button; the section
 * header of the page title places it on the right (see DocItem/Content).
 * Swizzled (ejected) from @docusaurus/theme-classic.
 */
export default function EditThisPage({ editUrl }: Props): ReactNode {
  const label = translate({
    id: "theme.common.editThisPage",
    message: "Edit this page",
    description: "The link label to edit the current page",
  });

  return (
    <Link
      href={editUrl}
      target="_blank"
      aria-label={label}
      className={`${ThemeClassNames.common.editThisPage} ${styles.link}`}
    >
      {/* Sized like the buttons Flow places in a page title */}
      <Button variant="plain" color="secondary" size="m">
        <Icon>
          <IconPencil />
        </Icon>
      </Button>
    </Link>
  );
}
