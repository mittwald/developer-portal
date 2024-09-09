import FeatureRow from "@site/src/components/FeatureRow";
import clsx from "clsx";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";
import React from "react";
import Intro, { IntroHeader } from "@site/src/components/Intro";
import Icon from "@mittwald/flow-react-components/Icon";
import { IconScript } from "@tabler/icons-react";
import Translate from "@docusaurus/Translate";

function ScriptingIntro() {
  return (
    <Intro>
      <IntroHeader>
        <Icon>
          <IconScript />
        </Icon>
        <h3>
          <Translate id={"cli.scripting.title"}>Script it your way</Translate>
        </h3>
      </IntroHeader>
      <p>
        <Translate id={"cli.scripting.body"}>
          With our CLI, you can automate your workflows and repetitive tasks by
          writing scripts. The CLI is built with scripting in mind and supports
          both interactive and non-interactive modes.
        </Translate>
      </p>
    </Intro>
  );
}

function ScriptingDocumentation() {
  return (
    <>
      <h3>
        <Translate id="index.reference.title">API documentation</Translate>
      </h3>
      <p>
        <Translate id={"index.reference.body"}>
          All endpoints and parameters of our API at a glance, including human
          readable references and machine readable specifications in the OpenAPI
          format.
        </Translate>
      </p>
    </>
  );
}

function ScriptingExample() {
  return (
    <>
      <h3>
        <Translate id="index.reference.title">API documentation</Translate>
      </h3>
      <p>
        <Translate id={"index.reference.body"}>
          All endpoints and parameters of our API at a glance, including human
          readable references and machine readable specifications in the OpenAPI
          format.
        </Translate>
      </p>
    </>
  );
}

export default function ScriptingFeature() {
  return (
    <FeatureRow variant>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <ScriptingIntro />
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <ScriptingDocumentation />
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <ScriptingExample />
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
