import React, { type ReactNode } from "react";
import Logo from "@theme/Logo";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useThemeConfig } from "@docusaurus/theme-common";
import MittwaldMark from "@site/src/components/MittwaldMark";
import styles from "./styles.module.css";

/**
 * The navbar logo; on very small screens the mittwald logo and the
 * "Developer Portal" title give way to the mittwald "m." mark, so the header
 * fits into one row. Swizzled (ejected) from @docusaurus/theme-classic.
 */
export default function NavbarLogo(): ReactNode {
  const { navbar } = useThemeConfig();
  const homeLink = useBaseUrl(navbar.logo?.href || "/");
  return (
    <>
      <Logo
        className="navbar__brand"
        imageClassName="navbar__logo"
        titleClassName="navbar__title text--truncate"
      />
      <Link to={homeLink} className={styles.markLink}>
        <MittwaldMark
          label={navbar.logo?.alt || "mittwald"}
          className={styles.mark}
        />
      </Link>
    </>
  );
}
