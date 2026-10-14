import React, { type ComponentType, type ReactNode } from "react";
import type { Props } from "@theme/Blog/Components/Author/Socials";
import {
  Flex,
  Icon,
  IconDomain,
  IconEmail,
} from "@mittwald/flow-react-components";
import IconLinkButton from "@site/src/components/IconLinkButton";
import {
  IconBrandBluesky,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandStackoverflow,
  IconBrandThreads,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandX,
  IconBrandYoutube,
} from "@site/src/icons";

/**
 * Social links of a changelog author as Flow links with FontAwesome brand icon
 * buttons (instead of the theme's own SVG logos). Ejected from
 * @docusaurus/theme-classic.
 */

/** A FontAwesome brand icon (Flow has no brand icons) as Flow icon */
function brandIcon(BrandIcon: ComponentType) {
  return (
    <Icon>
      <BrandIcon />
    </Icon>
  );
}

const socialPlatforms: Record<
  string,
  { icon: ReactNode; label: string } | undefined
> = {
  twitter: { icon: brandIcon(IconBrandTwitter), label: "Twitter" },
  github: { icon: brandIcon(IconBrandGithub), label: "GitHub" },
  stackoverflow: {
    icon: brandIcon(IconBrandStackoverflow),
    label: "Stack Overflow",
  },
  linkedin: { icon: brandIcon(IconBrandLinkedin), label: "LinkedIn" },
  x: { icon: brandIcon(IconBrandX), label: "X" },
  bluesky: { icon: brandIcon(IconBrandBluesky), label: "Bluesky" },
  instagram: { icon: brandIcon(IconBrandInstagram), label: "Instagram" },
  threads: { icon: brandIcon(IconBrandThreads), label: "Threads" },
  mastodon: { icon: brandIcon(IconBrandMastodon), label: "Mastodon" },
  youtube: { icon: brandIcon(IconBrandYoutube), label: "YouTube" },
  twitch: { icon: brandIcon(IconBrandTwitch), label: "Twitch" },
  email: { icon: <IconEmail />, label: "Email" },
};

function SocialLink({ platform, link }: { platform: string; link: string }) {
  const { icon, label } = socialPlatforms[platform] ?? {
    icon: <IconDomain />,
    label: platform,
  };
  return (
    <IconLinkButton
      href={link}
      target={link.startsWith("mailto:") ? undefined : "_blank"}
      label={label}
      icon={icon}
      size="s"
    />
  );
}

export default function BlogAuthorSocials({ author }: Props): ReactNode {
  const entries = Object.entries(author.socials ?? {});
  // The authors are stacked, so no space is kept for missing links
  if (entries.length === 0) {
    return null;
  }
  return (
    <Flex gap="xs" wrap="wrap">
      {entries.map(([platform, link]) => (
        <SocialLink key={platform} platform={platform} link={link} />
      ))}
    </Flex>
  );
}
