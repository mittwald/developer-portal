import React, { type ReactNode } from "react";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarLogo from "@theme/Navbar/Logo";
import { Button, Icon } from "@mittwald/flow-react-components";
import { IconX } from "@tabler/icons-react";

/**
 * Header of the mobile sidebar; the close button is a plain Flow icon button
 * like the menu toggle. Ejected from @docusaurus/theme-classic.
 */

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <span className="navbar-sidebar__close">
      <Button
        variant="plain"
        color="secondary"
        onPress={() => mobileSidebar.toggle()}
        aria-label={translate({
          id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
          message: "Close navigation bar",
          description: "The ARIA label for close button of mobile sidebar",
        })}
      >
        <Icon>
          <IconX />
        </Icon>
      </Button>
    </span>
  );
}

export default function NavbarMobileSidebarHeader(): ReactNode {
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <NavbarColorModeToggle className="margin-right--md" />
      <CloseButton />
    </div>
  );
}
