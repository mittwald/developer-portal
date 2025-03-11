import React, { FC } from "react";
import Translate from "@docusaurus/Translate";
import { Alert, Content, Heading } from "@mittwald/flow-react-components";
import clsx from "clsx";
import styles from "@site/src/components/TerraformResourceHint.module.css";
import { IconBrandTerraform } from "@tabler/icons-react";

interface TerraformResourceHintProps {
  resource: string;
  description?: string;
}

const TerraformResourceHint: FC<TerraformResourceHintProps> = ({
  description,
  resource,
}) => {
  const heading = <Translate id="components.TerraformResourceHint.text" />;
  const baseURL =
    "https://registry.terraform.io/providers/mittwald/mittwald/latest/docs";
  const url = `${baseURL}/resources/${resource}`;
  const cls = clsx("card", "margin-bottom--xs", styles.card, styles.compact);

  return (
    <Alert status="info">
      <Heading>{heading}:</Heading>
      <Content className={styles.cardRow}>
        <div className={cls}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <IconBrandTerraform />
            </div>
            <a href={url} className={styles.headerText}>
              <strong>
                Terraform Resource: <code>mittwald_{resource}</code>
              </strong>
              {description && <div>{description}</div>}
            </a>
          </div>
        </div>
        <div className={cls}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <IconBrandTerraform />
            </div>
            <a href={baseURL} className={styles.headerText}>
              <strong>
                <Translate id="components.TerraformResourceHint.provider" />
              </strong>
            </a>
          </div>
        </div>
      </Content>
    </Alert>
  );
};

export default TerraformResourceHint;
