import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import NavbarItem, { type Props as NavbarItemProps } from "@theme/NavbarItem";
import {
  Button,
  ClearPropsContext,
  ContextMenu,
  ContextMenuTrigger,
  HeaderNavigation,
  Icon,
  Link,
  MenuItem,
} from "@mittwald/flow-react-components";
import {
  IconBrandGithub,
  IconDeviceDesktop,
  IconLanguage,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import toggleStyles from "@site/src/theme/ColorModeToggle/styles.module.css";
import styles from "./styles.module.css";

/**
 * Navbar item type `custom-flowHeaderActions`: the right part of the header as
 * a Flow header navigation with external links (`items`), the language switch
 * and the color mode toggle. In Docusaurus' mobile sidebar the regular link
 * and locale items are rendered (the toggle sits in the sidebar header).
 */

interface LinkConfig {
  href: string;
  label: string;
  /** Renders the link as an icon (the label is used as accessible name) */
  icon?: keyof typeof linkIcons;
}

const linkIcons = {
  github: IconBrandGithub,
};

interface Props {
  items: LinkConfig[];
  mobile?: boolean;
}

/** URL of the current page in another locale */
function useLocaleUrl(): (locale: string) => string {
  const { siteConfig, i18n } = useDocusaurusContext();
  const { pathname, search, hash } = useLocation();
  const pathWithoutBase = pathname.startsWith(siteConfig.baseUrl)
    ? pathname.slice(siteConfig.baseUrl.length)
    : pathname.replace(/^\//, "");
  return (locale) =>
    `${i18n.localeConfigs[locale]!.baseUrl}${pathWithoutBase}${search}${hash}`;
}

function LocaleSwitch() {
  const { i18n } = useDocusaurusContext();
  const localeUrl = useLocaleUrl();
  const label = translate({
    id: "theme.navbar.mobileLanguageDropdown.label",
    message: "Languages",
    description: "The label for the mobile language switcher dropdown",
  });

  return (
    <ContextMenuTrigger>
      <Button aria-label={label}>
        <Icon>
          <IconLanguage />
        </Icon>
      </Button>
      <ContextMenu
        selectionMode="single"
        selectedKeys={[i18n.currentLocale]}
        onAction={(locale) => {
          // A locale is a separate build, so leave the client router
          window.location.assign(localeUrl(String(locale)));
        }}
      >
        {i18n.locales.map((locale) => (
          <MenuItem key={locale} id={locale}>
            {i18n.localeConfigs[locale]!.label}
          </MenuItem>
        ))}
      </ContextMenu>
    </ContextMenuTrigger>
  );
}

function ColorModeButton() {
  const { colorMode, setColorMode } = useColorMode();
  const { disableSwitch } = useThemeConfig().colorMode;
  if (disableSwitch) {
    return null;
  }

  const label = translate({
    message: "Switch between dark and light mode (currently {mode})",
    id: "theme.colorToggle.ariaLabel",
    description: "The ARIA label for the color mode toggle",
  }).replace(
    "{mode}",
    translate({
      message: colorMode === "dark" ? "dark mode" : "light mode",
      id:
        colorMode === "dark"
          ? "theme.colorToggle.ariaLabel.mode.dark"
          : "theme.colorToggle.ariaLabel.mode.light",
    }),
  );

  // All three icons are rendered; "data-theme-choice" on <html> picks the
  // visible one, which also works before React hydrates
  return (
    <Button
      aria-label={label}
      onPress={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
    >
      <Icon
        className={clsx(toggleStyles.toggleIcon, toggleStyles.lightToggleIcon)}
      >
        <IconSun />
      </Icon>
      <Icon
        className={clsx(toggleStyles.toggleIcon, toggleStyles.darkToggleIcon)}
      >
        <IconMoon />
      </Icon>
      <Icon
        className={clsx(toggleStyles.toggleIcon, toggleStyles.systemToggleIcon)}
      >
        <IconDeviceDesktop />
      </Icon>
    </Button>
  );
}

export default function FlowHeaderActions({ items, mobile }: Props): ReactNode {
  if (mobile) {
    return (
      <>
        {items.map((item) => (
          <NavbarItem key={item.label} {...(item as NavbarItemProps)} mobile />
        ))}
        <NavbarItem type="localeDropdown" mobile />
      </>
    );
  }

  return (
    <HeaderNavigation
      aria-label={translate({
        id: "theme.navbar.headerActions.label",
        message: "Links and settings",
        description: "The ARIA label of the actions in the navbar",
      })}
    >
      {items.map((item) => {
        const LinkIcon = item.icon ? linkIcons[item.icon] : undefined;
        return LinkIcon ? (
          // Link combined with a button, as documented for Flow links. The
          // header navigation would treat it as a text link, so it is placed
          // outside of its props context.
          <li key={item.href} className={styles.item}>
            <ClearPropsContext>
              <Link href={item.href} target="_blank" aria-label={item.label}>
                <Button variant="plain" color="secondary">
                  <Icon>
                    <LinkIcon />
                  </Icon>
                </Button>
              </Link>
            </ClearPropsContext>
          </li>
        ) : (
          <Link key={item.href} href={item.href} target="_blank">
            {item.label}
          </Link>
        );
      })}
      <LocaleSwitch />
      <ColorModeButton />
    </HeaderNavigation>
  );
}
