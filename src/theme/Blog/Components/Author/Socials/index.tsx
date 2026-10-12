import React, { type ComponentType, type ReactNode } from "react";
import type { Props } from "@theme/Blog/Components/Author/Socials";
import { Flex } from "@mittwald/flow-react-components";
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
  IconMail,
  IconWorld,
} from "@tabler/icons-react";

/**
 * Social links of a changelog author as Flow links with Tabler icon buttons
 * (instead of the theme's own SVG logos). Ejected from
 * @docusaurus/theme-classic.
 */

const socialPlatforms: Record<
  string,
  { Icon: ComponentType; label: string } | undefined
> = {
  twitter: { Icon: IconBrandTwitter, label: "Twitter" },
  github: { Icon: IconBrandGithub, label: "GitHub" },
  stackoverflow: { Icon: IconBrandStackoverflow, label: "Stack Overflow" },
  linkedin: { Icon: IconBrandLinkedin, label: "LinkedIn" },
  x: { Icon: IconBrandX, label: "X" },
  bluesky: { Icon: IconBrandBluesky, label: "Bluesky" },
  instagram: { Icon: IconBrandInstagram, label: "Instagram" },
  threads: { Icon: IconBrandThreads, label: "Threads" },
  mastodon: { Icon: IconBrandMastodon, label: "Mastodon" },
  youtube: { Icon: IconBrandYoutube, label: "YouTube" },
  twitch: { Icon: IconBrandTwitch, label: "Twitch" },
  email: { Icon: IconMail, label: "Email" },
};

function SocialLink({ platform, link }: { platform: string; link: string }) {
  const { Icon: PlatformIcon, label } = socialPlatforms[platform] ?? {
    Icon: IconWorld,
    label: platform,
  };
  return (
    <IconLinkButton
      href={link}
      target={link.startsWith("mailto:") ? undefined : "_blank"}
      label={label}
      icon={<PlatformIcon />}
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
