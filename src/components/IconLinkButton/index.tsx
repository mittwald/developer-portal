import React, { type ReactNode } from "react";
import clsx from "clsx";
import { Button, Link } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

interface IconLinkButtonProps {
  href: string;
  /** Accessible name, the button only shows the icon */
  label: string;
  /** A Flow icon (e.g. `<IconEdit />`), or another icon wrapped in Flow's
   * `<Icon>` */
  icon: ReactNode;
  /** e.g. "_blank" for external links */
  target?: string;
  size?: "m" | "s";
  className?: string;
}

/**
 * An icon-only link: a Flow link combined with a plain secondary icon button,
 * as documented for Flow links. Flow's external link icon is hidden, the icon
 * already marks the destination.
 */
export default function IconLinkButton({
  href,
  label,
  icon,
  target,
  size = "m",
  className,
}: IconLinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      aria-label={label}
      className={clsx(styles.link, className)}
    >
      <Button variant="plain" color="secondary" size={size}>
        {icon}
      </Button>
    </Link>
  );
}
