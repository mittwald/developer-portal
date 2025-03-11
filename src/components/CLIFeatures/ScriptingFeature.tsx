import FeatureRow from "@site/src/components/FeatureRow";
import clsx from "clsx";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";
import React from "react";
import Intro, { IntroHeader } from "@site/src/components/Intro";
import { Icon } from "@mittwald/flow-react-components";
import { IconScript } from "@tabler/icons-react";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";

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
        <Translate id="cli.scripting.usecases.title">
          Scripting use cases
        </Translate>
      </h3>
      <p>
        <Translate id={"cli.scripting.usecases.body"}>
          By using the CLI in your scripts, you can easily automate repetitive
          tasks without the need to interact with the web interface or knowing
          your way around the API. Typical use cases include:
        </Translate>
      </p>
      <ul>
        <li>
          <Translate id="cli.scripting.batchprocessing">
            Batch processing
          </Translate>
        </li>
        <li>
          <Translate id="cli.scripting.import-export">
            Data import/export
          </Translate>
        </li>
        <li>
          <Translate id="cli.scripting.bootstrapping">
            Project bootstrapping
          </Translate>
        </li>
        <li>
          <Translate id="cli.scripting.cicd">CI/CD integration</Translate>
        </li>
      </ul>
    </>
  );
}

function ScriptingExample() {
  return (
    <>
      <CodeBlock language="shell" showLineNumbers>{`emails=(
  "alice@mittwald.example"
  "bob@mittwald.example"
)

for t in \${emails[@]} ; do
  mw mail address create -q \\
    --address \$t \\
    --random-password
done`}</CodeBlock>
      <p className="padding--md">
        <Link to="/docs/v2/category/cli-examples">
          <Translate id={"cli.scripting.examples"}>More examples</Translate>
        </Link>
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
            <div className={clsx(styles.feature)}>
              <ScriptingExample />
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
