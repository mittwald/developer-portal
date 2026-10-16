import React, { type ReactNode } from "react";
import type { Props } from "@theme/Footer/Copyright";
import { Text } from "@mittwald/flow-react-components";

/** Footer copyright rendered with Flow typography. */
export default function FooterCopyright({ copyright }: Props): ReactNode {
  return (
    <Text elementType="div" align="center">
      <small>{copyright}</small>
    </Text>
  );
}
