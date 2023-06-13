import React from "react";

import Admonition from "@theme/Admonition";
import Translate from "@docusaurus/Translate";
import OperationLink from "../OperationLink";

export default function OperationHint({ tag, operation }) {
  return (
    <Admonition type="info">
      <Translate id={"components.OperationHint.text"}>
        For details please refer to the endpoint documentation for the following
        endpoint
      </Translate>
      :{" "}
      <OperationLink tag={tag} operation={operation}>
        <code>{operation}</code>
      </OperationLink>
    </Admonition>
  );
}
