import React from "react";
import type AdmonitionType from "@theme/Admonition";
import type { WrapperProps } from "@docusaurus/types";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";
import { translate } from "@docusaurus/Translate";

type Props = WrapperProps<typeof AdmonitionType>;

export default function AdmonitionWrapper(props: Props): JSX.Element {
  const status = {
    note: "info",
    caution: "warning",
    warning: "warning",
  };

  return (
    <InlineAlert status={status[props.type]}>
      <Heading>
        {props.title ??
          translate({
            id: `theme.admonition.${props.type}`,
            message: props.type,
          })}
      </Heading>
      <Content>{props.children}</Content>
    </InlineAlert>
  );

  // return (
  //   <>
  //     <Admonition {...props} />
  //   </>
  // );
}
