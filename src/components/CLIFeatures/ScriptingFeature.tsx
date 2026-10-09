import FeatureRow from "@site/src/components/FeatureRow";
import clsx from "clsx";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";
import React from "react";
import Intro from "@site/src/components/Intro";
import { Heading, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconScript } from "@tabler/icons-react";
import Translate from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";

function ScriptingIntro() {
  return (
    <Intro>
      <Icon>
        <IconScript />
      </Icon>
      <Heading level={2} size="l">
        <Translate id={"cli.scripting.title"}>Script it your way</Translate>
      </Heading>
      <Text>
        <Translate id={"cli.scripting.body"}>
          With our CLI, you can automate your workflows and repetitive tasks by
          writing scripts. The CLI is built with scripting in mind and supports
          both interactive and non-interactive modes.
        </Translate>
      </Text>
    </Intro>
  );
}

function ScriptingDocumentation() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="cli.scripting.usecases.title">
          Scripting use cases
        </Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"cli.scripting.usecases.body"}>
          By using the CLI in your scripts, you can easily automate repetitive
          tasks without the need to interact with the web interface or knowing
          your way around the API. Typical use cases include:
        </Translate>
      </Text>
      <Text elementType="div">
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
      </Text>
    </FeatureCard>
  );
}

function ScriptingExample() {
  return (
    <FeatureCard>
      <CodeBlock language="shell" showLineNumbers>{`emails=(
  "alice@mittwald.example"
  "bob@mittwald.example"
)

for t in \${emails[@]} ; do
  mw mail address create -q \\
    --address \$t \\
    --random-password
done`}</CodeBlock>
      <Link href="/docs/v2/category/cli-examples">
        <Translate id={"cli.scripting.examples"}>More examples</Translate>
      </Link>
    </FeatureCard>
  );
}

export default function ScriptingFeature() {
  return (
    <FeatureRow variant>
      <div className="container">
        <div className="row margin-bottom--lg">
          <div className="col col--12">
            <ScriptingIntro />
          </div>
        </div>
        <div className="row">
          <div className={clsx("col col--6")}>
            <ScriptingDocumentation />
          </div>
          <div className={clsx("col col--6")}>
            <ScriptingExample />
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
