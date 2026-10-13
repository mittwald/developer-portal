import React, { type ReactNode, useEffect, useState } from "react";
import type MermaidType from "@theme/Mermaid";
import Mermaid from "@theme-original/Mermaid";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof MermaidType>;

/**
 * Renders the diagram once the Flow font (Inter) is loaded. Mermaid measures
 * the labels while rendering; measured with the fallback font, they end up
 * too narrow for Inter and get clipped. Swizzled (wrapped) from
 * @docusaurus/theme-mermaid.
 */
export default function MermaidWrapper(props: Props): ReactNode {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const done = () => setFontLoaded(true);
    Promise.all([
      document.fonts.load("16px Inter"),
      document.fonts.load("bold 16px Inter"),
    ]).then(done, done);
  }, []);

  return fontLoaded ? <Mermaid {...props} /> : null;
}
