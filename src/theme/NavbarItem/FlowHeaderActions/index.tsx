import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import {
  useColorMode,
  useThemeConfig,
  type ColorMode,
} from "@docusaurus/theme-common";
import {
  Button,
  ClearPropsContext,
  ContextMenu,
  ContextMenuTrigger,
  HeaderNavigation,
  Icon,
  IconDesktop,
  IconLanguage,
  Link,
  MenuItem,
} from "@mittwald/flow-react-components";
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import IconLinkButton from "@site/src/components/IconLinkButton";
import styles from "./styles.module.css";

/**
 * Navbar item type `custom-flowHeaderActions`: the right part of the header as
 * a Flow header navigation with external links (`items`), the language switch
 * and the color mode toggle. The actions are always in the header, so they
 * are not repeated in Docusaurus' mobile sidebar.
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
        <IconLanguage />
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

function getNextColorMode(colorMode: ColorMode | null): ColorMode | null {
  switch (colorMode) {
    case null:
      return "light";
    case "light":
      return "dark";
    case "dark":
      return null;
  }
}

function getColorModeLabel(colorMode: ColorMode | null): string {
  switch (colorMode) {
    case null:
      return translate({
        message: "system mode",
        id: "theme.colorToggle.ariaLabel.mode.system",
        description: "The name for the system color mode",
      });
    case "light":
      return translate({
        message: "light mode",
        id: "theme.colorToggle.ariaLabel.mode.light",
        description: "The name for the light color mode",
      });
    case "dark":
      return translate({
        message: "dark mode",
        id: "theme.colorToggle.ariaLabel.mode.dark",
        description: "The name for the dark color mode",
      });
  }
}

function ColorModeButton() {
  const { colorModeChoice, setColorMode } = useColorMode();
  const { disableSwitch } = useThemeConfig().colorMode;
  if (disableSwitch) {
    return null;
  }

  const label = translate(
    {
      message: "Switch between system, light and dark mode (currently {mode})",
      id: "theme.colorToggle.ariaLabel",
      description: "The ARIA label for the color mode toggle",
    },
    { mode: getColorModeLabel(colorModeChoice) },
  );

  return (
    <Button
      aria-label={label}
      onPress={() => setColorMode(getNextColorMode(colorModeChoice))}
    >
      <Icon className={clsx(styles.toggleIcon, styles.lightToggleIcon)}>
        <IconSun />
      </Icon>
      <Icon className={clsx(styles.toggleIcon, styles.darkToggleIcon)}>
        <IconMoon />
      </Icon>
      <IconDesktop
        className={clsx(styles.toggleIcon, styles.systemToggleIcon)}
      />
    </Button>
  );
}

export default function FlowHeaderActions({ items, mobile }: Props): ReactNode {
  // The actions stay in the header on small screens as well
  if (mobile) {
    return null;
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
              <IconLinkButton
                href={item.href}
                target="_blank"
                label={item.label}
                icon={
                  <Icon>
                    <LinkIcon />
                  </Icon>
                }
              />
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
