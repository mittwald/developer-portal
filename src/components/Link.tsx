import DocusaurusLink, { Props } from "@docusaurus/Link";
import React from "react";

function Link(props: Props) {
  return <DocusaurusLink {...props} className="flow--link" />;
}

export default Link;
