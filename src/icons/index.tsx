import React, { type FC } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTurnDownLeft,
  faBook,
  faCloud,
  faFileCircleQuestion,
  faListCheck,
  faMoon,
  faPlug,
  faRocket,
  faSun,
  faUserRobot,
  faUsers,
} from "@fortawesome/sharp-regular-svg-icons";
// The Pro sharp-regular variant outlines both halves; the system color mode
// shows one half filled, which only the solid style draws (as on
// flow.mittwald.de)
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import {
  faBluesky,
  faGithub,
  faInstagram,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faThreads,
  faTwitch,
  faTwitter,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/**
 * Icons the portal needs beyond Flow's icon set, drawn with FontAwesome like
 * the icons on flow.mittwald.de: sharp regular (Pro, see
 * `dev/installProIcons.ts`), brands from the free brands set. Place them in a
 * Flow `Icon` like any other icon.
 */

type IconProps = Omit<React.ComponentProps<typeof FontAwesomeIcon>, "icon">;

// Passes on the props a Flow `Icon` sets on its icon (e.g. class names)
function fontAwesomeIcon(icon: IconDefinition, defaults?: IconProps) {
  const FontAwesomeIconComponent: FC<IconProps> = (props) => (
    <FontAwesomeIcon icon={icon} {...defaults} {...props} />
  );
  return FontAwesomeIconComponent;
}

export const IconBook = fontAwesomeIcon(faBook);
export const IconCloud = fontAwesomeIcon(faCloud);
export const IconColorModeDark = fontAwesomeIcon(faMoon);
export const IconColorModeLight = fontAwesomeIcon(faSun);
export const IconColorModeSystem = fontAwesomeIcon(faCircleHalfStroke, {
  flip: "horizontal",
});
export const IconListCheck = fontAwesomeIcon(faListCheck);
export const IconNotFound = fontAwesomeIcon(faFileCircleQuestion);
export const IconPlug = fontAwesomeIcon(faPlug);
export const IconRobot = fontAwesomeIcon(faUserRobot);
export const IconRocket = fontAwesomeIcon(faRocket);
export const IconTextWrap = fontAwesomeIcon(faArrowTurnDownLeft);
export const IconUsers = fontAwesomeIcon(faUsers);

export const IconBrandBluesky = fontAwesomeIcon(faBluesky);
export const IconBrandGithub = fontAwesomeIcon(faGithub);
export const IconBrandInstagram = fontAwesomeIcon(faInstagram);
export const IconBrandLinkedin = fontAwesomeIcon(faLinkedin);
export const IconBrandMastodon = fontAwesomeIcon(faMastodon);
export const IconBrandStackoverflow = fontAwesomeIcon(faStackOverflow);
export const IconBrandThreads = fontAwesomeIcon(faThreads);
export const IconBrandTwitch = fontAwesomeIcon(faTwitch);
export const IconBrandTwitter = fontAwesomeIcon(faTwitter);
export const IconBrandX = fontAwesomeIcon(faXTwitter);
export const IconBrandYoutube = fontAwesomeIcon(faYoutube);
