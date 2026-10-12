import React, { type ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useBackToTopButton } from "@docusaurus/theme-common/internal";
import { Button, Icon } from "@mittwald/flow-react-components";
import { IconArrowUp } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Back to top as Flow icon button. Ejected from @docusaurus/theme-classic;
 * uses the internal useBackToTopButton hook.
 */
export default function BackToTopButton(): ReactNode {
  const { shown, scrollToTop } = useBackToTopButton({ threshold: 300 });
  return (
    <div
      className={clsx(
        ThemeClassNames.common.backToTopButton,
        styles.container,
        shown && styles.shown,
      )}
    >
      <Button
        variant="soft"
        color="secondary"
        aria-label={translate({
          id: "theme.BackToTopButton.buttonAriaLabel",
          message: "Scroll back to top",
          description: "The ARIA label for the back to top button",
        })}
        onPress={scrollToTop}
      >
        <Icon>
          <IconArrowUp />
        </Icon>
      </Button>
    </div>
  );
}
