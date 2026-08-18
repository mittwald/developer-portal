import React from "react";
import type AdmonitionType from "@theme/Admonition";
import OriginalAdmonition from "@theme-original/Admonition";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof AdmonitionType>;

export default function AdmonitionWrapper(props: Props): JSX.Element {
  return <OriginalAdmonition {...props} />;
}
