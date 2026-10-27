import React, { Fragment, type ReactNode } from "react";
import { Text } from "@mittwald/flow-react-components";

interface LinkGroupProps {
  title: ReactNode;
  links: ReactNode[];
}

/**
 * Related links under a common title in bold text (not a Flow label), the
 * links in the line below. Used in the feature cards of the landing pages.
 */
export default function LinkGroup({ title, links }: LinkGroupProps) {
  return (
    <Text elementType="div" color="dark">
      <strong>{title}</strong>
      <br />
      {links.map((link, i) => (
        <Fragment key={i}>
          {link}
          {i < links.length - 1 && " | "}
        </Fragment>
      ))}
    </Text>
  );
}
