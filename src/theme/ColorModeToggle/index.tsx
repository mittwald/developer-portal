import React, { type ReactNode } from "react";
import clsx from "clsx";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/ColorModeToggle";
import type { ColorMode } from "@docusaurus/theme-common";
import { Button, Icon } from "@mittwald/flow-react-components";
import {
  IconDeviceDesktop,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Color mode toggle as a plain Flow icon button. Swizzled (ejected) from
 * @docusaurus/theme-classic; the cycling logic and labels are unchanged.
 */

function getNextColorMode(
  colorMode: ColorMode | null,
  respectPrefersColorScheme: boolean,
) {
  // 2-value transition
  if (!respectPrefersColorScheme) {
    return colorMode === "dark" ? "light" : "dark";
  }

  // 3-value transition
  switch (colorMode) {
    case null:
      return "light";
    case "light":
      return "dark";
    case "dark":
      return null;
    default:
      throw new Error(`unexpected color mode ${colorMode}`);
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
    default:
      throw new Error(`unexpected color mode ${colorMode}`);
  }
}

function getColorModeAriaLabel(colorMode: ColorMode | null) {
  return translate(
    {
      message: "Switch between dark and light mode (currently {mode})",
      id: "theme.colorToggle.ariaLabel",
      description: "The ARIA label for the color mode toggle",
    },
    {
      mode: getColorModeLabel(colorMode),
    },
  );
}

function ColorModeToggle({
  className,
  respectPrefersColorScheme,
  value,
  onChange,
}: Props): ReactNode {
  const isBrowser = useIsBrowser();

  // All three icons are rendered; "data-theme-choice" on <html> picks the
  // visible one, which also works before React hydrates
  return (
    <div className={clsx(styles.toggle, className)}>
      <Button
        className={styles.toggleButton}
        variant="plain"
        color="secondary"
        isDisabled={!isBrowser}
        aria-label={getColorModeAriaLabel(value)}
        onPress={() =>
          onChange(getNextColorMode(value, respectPrefersColorScheme))
        }
      >
        <Icon className={clsx(styles.toggleIcon, styles.lightToggleIcon)}>
          <IconSun />
        </Icon>
        <Icon className={clsx(styles.toggleIcon, styles.darkToggleIcon)}>
          <IconMoon />
        </Icon>
        <Icon className={clsx(styles.toggleIcon, styles.systemToggleIcon)}>
          <IconDeviceDesktop />
        </Icon>
      </Button>
    </div>
  );
}

export default React.memo(ColorModeToggle);
