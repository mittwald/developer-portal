import React, { useEffect, type ReactNode } from "react";
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from "@docusaurus/theme-common/internal";
import Translate from "@docusaurus/Translate";
import NavbarMobileSidebarPrimaryMenu from "@theme/Navbar/MobileSidebar/PrimaryMenu";
import NavbarMobileSidebarSecondaryMenu from "@theme/Navbar/MobileSidebar/SecondaryMenu";
import {
  Content,
  Heading,
  Modal,
  useOverlayController,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Mobile navigation as Flow off-canvas modal on the right, where the menu
 * toggle is; Flow brings the backdrop, the close button and the scroll lock.
 * Shows either the navbar items or the contextual secondary menu (e.g. the
 * docs sidebar). Ejected from @docusaurus/theme-classic (replaces Layout and
 * Header; logo and color mode toggle stay in the navbar).
 */
export default function NavbarMobileSidebar(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const secondaryMenu = useNavbarSecondaryMenu();
  const controller = useOverlayController("Modal");

  // Docusaurus owns the state (toggle button, closing on navigation); the
  // Flow controller follows it
  useEffect(() => {
    controller.setOpen(mobileSidebar.shown);
  }, [controller, mobileSidebar.shown]);

  if (!mobileSidebar.shouldRender) {
    return null;
  }

  return (
    <Modal
      offCanvas
      offCanvasOrientation="right"
      controller={controller}
      // Closed by Flow (close button, backdrop, Escape)
      onOpenChange={(isOpen) => {
        if (!isOpen && mobileSidebar.shown) {
          mobileSidebar.toggle();
        }
      }}
    >
      <Heading>
        <Translate
          id="theme.navbar.mobileSidebar.title"
          description="The heading of the mobile navigation"
        >
          Menu
        </Translate>
      </Heading>
      <Content className={styles.content}>
        <div className="menu">
          {secondaryMenu.shown ? (
            <NavbarMobileSidebarSecondaryMenu />
          ) : (
            <NavbarMobileSidebarPrimaryMenu />
          )}
        </div>
      </Content>
    </Modal>
  );
}
