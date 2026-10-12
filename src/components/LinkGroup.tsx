import React, { Fragment, type ReactNode } from "react";
import {
  Content,
  Label,
  LabeledValue,
  Text,
} from "@mittwald/flow-react-components";

interface LinkGroupProps {
  title: ReactNode;
  links: ReactNode[];
}

/**
 * Related links under a common title, as Flow labeled value. Used in the
 * (dark) feature cards of the landing pages; the labeled value content does
 * not pass on the card's color, so the text sets it again.
 */
export default function LinkGroup({ title, links }: LinkGroupProps) {
  return (
    <LabeledValue>
      <Label>{title}</Label>
      <Content>
        <Text color="dark">
          {links.map((link, i) => (
            <Fragment key={i}>
              {link}
              {i < links.length - 1 && " | "}
            </Fragment>
          ))}
        </Text>
      </Content>
    </LabeledValue>
  );
}
