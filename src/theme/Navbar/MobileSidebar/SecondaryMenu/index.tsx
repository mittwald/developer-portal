import React, { type ReactNode } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import { Button, IconChevronLeft, Text } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Secondary menu of the mobile navigation (e.g. the docs sidebar), with a
 * plain Flow button back to the navbar items. Ejected from
 * @docusaurus/theme-classic.
 */
export default function NavbarMobileSidebarSecondaryMenu(): ReactNode {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0;
  const secondaryMenu = useNavbarSecondaryMenu();

  // The existing translation starts with an arrow; the button has an icon
  const backLabel = translate({
    id: "theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel",
    message: "← Back to main menu",
    description:
      "The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)",
  }).replace(/^←\s*/, "");

  return (
    <>
      {/* edge-case: prevent returning to the primaryMenu when it's empty */}
      {!isPrimaryMenuEmpty && (
        <Button
          variant="plain"
          color="secondary"
          size="s"
          className={styles.back}
          onPress={() => secondaryMenu.hide()}
        >
          <IconChevronLeft />
          <Text>{backLabel}</Text>
        </Button>
      )}
      {secondaryMenu.content}
    </>
  );
}
