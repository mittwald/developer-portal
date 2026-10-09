import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useSidebarBreadcrumbs } from "@docusaurus/plugin-content-docs/client";
import { translate } from "@docusaurus/Translate";
import DocBreadcrumbsStructuredData from "@theme/DocBreadcrumbs/StructuredData";
import { Breadcrumb, Icon, Link } from "@mittwald/flow-react-components";
import { IconHome } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Doc breadcrumbs as Flow breadcrumb. Ejected from @docusaurus/theme-classic;
 * the home item is always shown, since the portal has a home page.
 */
export default function DocBreadcrumbs(): ReactNode {
  const breadcrumbs = useSidebarBreadcrumbs();

  if (!breadcrumbs) {
    return null;
  }

  const homeLabel = translate({
    id: "theme.docs.breadcrumbs.home",
    message: "Home page",
    description: "The ARIA label for the home page in the breadcrumbs",
  });

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        className={clsx(ThemeClassNames.docs.docBreadcrumbs, styles.container)}
        aria-label={translate({
          id: "theme.docs.breadcrumbs.navAriaLabel",
          message: "Breadcrumbs",
          description: "The ARIA label for the breadcrumbs",
        })}
      >
        <Breadcrumb size="s">
          <Link href="/" aria-label={homeLabel} className={styles.homeLink}>
            <Icon>
              <IconHome />
            </Icon>
          </Link>
          {breadcrumbs.map((item, idx) => {
            // Unlisted category links must not be linked
            const href =
              item.type === "category" && item.linkUnlisted
                ? undefined
                : item.href;
            return (
              <Link key={idx} href={href}>
                {item.label}
              </Link>
            );
          })}
        </Breadcrumb>
      </nav>
    </>
  );
}
