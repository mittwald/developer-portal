import React, { FC } from "react";
import Translate from "@docusaurus/Translate";
import MDXComponents from "@theme/MDXComponents";
import {
  Alert,
  Content,
  Heading,
  Icon,
  Text,
} from "@mittwald/flow-react-components";
import styles from "@site/src/components/TerraformResourceHint.module.css";
import { IconBrandTerraform } from "@tabler/icons-react";

// Rendered like any other Markdown link
const MDXLink = MDXComponents.a;

interface TerraformResourceHintProps {
  resource: string;
  description?: string;
}

/** Hint linking to a Terraform resource, styled like the OperationHint */
const TerraformResourceHint: FC<TerraformResourceHintProps> = ({
  description,
  resource,
}) => {
  const baseURL =
    "https://registry.terraform.io/providers/mittwald/mittwald/latest/docs";
  const url = `${baseURL}/resources/${resource}`;

  return (
    <Alert status="info">
      <Heading>Terraform</Heading>
      <Content>
        <Text>
          <Translate id="components.TerraformResourceHint.text" />:
        </Text>
        <ul className={styles.links}>
          <li className={styles.item}>
            <Icon className={styles.icon}>
              <IconBrandTerraform />
            </Icon>
            <span>
              <MDXLink href={url}>mittwald_{resource}</MDXLink>
              {description && <> – {description}</>}
            </span>
          </li>
          <li className={styles.item}>
            <Icon className={styles.icon}>
              <IconBrandTerraform />
            </Icon>
            <MDXLink href={baseURL}>
              <Translate id="components.TerraformResourceHint.provider" />
            </MDXLink>
          </li>
        </ul>
      </Content>
    </Alert>
  );
};

export default TerraformResourceHint;
