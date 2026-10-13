import React, { type ReactNode } from "react";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import { Button, IconMenu } from "@mittwald/flow-react-components";

/**
 * Mobile menu toggle as a plain Flow icon button, like the compact header
 * menu (NavbarItem/FlowHeaderNavigation). Ejected from
 * @docusaurus/theme-classic; the wrapper keeps Infima's `navbar__toggle`
 * class, which shows the toggle on small screens only.
 */
export default function MobileSidebarToggle(): ReactNode {
  const { toggle, shown } = useNavbarMobileSidebar();
  return (
    <span className="navbar__toggle">
      <Button
        variant="plain"
        color="secondary"
        onPress={toggle}
        aria-expanded={shown}
        aria-label={translate({
          id: "theme.docs.sidebar.toggleSidebarButtonAriaLabel",
          message: "Toggle navigation bar",
          description:
            "The ARIA label for hamburger menu button of mobile navigation",
        })}
      >
        <IconMenu />
      </Button>
    </span>
  );
}
