import React from "react";
import type AdmonitionType from "@theme/Admonition";
import type { WrapperProps } from "@docusaurus/types";
import { Alert } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { translate } from "@docusaurus/Translate";

type Props = WrapperProps<typeof AdmonitionType>;

export default function AdmonitionWrapper(props: Props): JSX.Element {
  const status = {
    note: "info",
    caution: "warning",
    warning: "warning",
  };

  return (
    <Alert status={status[props.type]}>
      <Heading>
        {props.title ??
          translate({
            id: `theme.admonition.${props.type}`,
            message: props.type,
          })}
      </Heading>
      <Content>{props.children}</Content>
    </Alert>
  );

  // return (
  //   <>
  //     <Admonition {...props} />
  //   </>
  // );
}
