import FeatureRow from "@site/src/components/FeatureRow";
import clsx from "clsx";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";
import React from "react";
import Intro from "@site/src/components/Intro";
import { Heading, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconScript } from "@tabler/icons-react";
import Translate from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";

function DevelopmentIntro() {
  return (
    <Intro>
      <Icon>
        <IconScript />
      </Icon>
      <Heading level={2} size="l">
        <Translate id={"cli.dev.title"}>Supercharge your development</Translate>
      </Heading>
      <Text>
        <Translate id={"cli.dev.body"}>
          The mittwald CLI can integrate seamlessly into your development
          workflow. It can simplify your development tasks and even help you set
          up your local development environment.
        </Translate>
      </Text>
    </Intro>
  );
}

function DevelopmentDocumentation() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="cli.dev.features.title">Development features</Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"cli.dev.features.body"}>
          Typical development tasks that can be simplified with the mittwald CLI
          include:
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <Translate id="cli.dev.features.bootstrapping">
              Bootstrapping new projects on the mittwald platform
            </Translate>
          </li>
          <li>
            <Translate id="cli.dev.features.localdev">
              Setting up local development environments
            </Translate>
          </li>
          <li>
            <Translate id="cli.dev.features.operations">
              Supporting operational tasks
            </Translate>
          </li>
        </ul>
      </Text>
    </FeatureCard>
  );
}

function DevelopmentExample() {
  return (
    <FeatureCard>
      <CodeBlock language="shell-session">{`$ # Setup ddev project
$ mw ddev init

$ # Pull your project files from mittwald
$ ddev pull mittwald

$ # Start your local environment
$ ddev start`}</CodeBlock>
      <Link href="/docs/v2/platform/development/ddev/">
        <Translate id={"cli.dev.ddev"}>
          More about our DDEV integration
        </Translate>
      </Link>
    </FeatureCard>
  );
}

export default function DevelopmentFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row margin-bottom--lg">
          <div className="col col--12">
            <DevelopmentIntro />
          </div>
        </div>
        <div className="row">
          <div className={clsx("col col--6")}>
            <DevelopmentDocumentation />
          </div>
          <div className={clsx("col col--6")}>
            <DevelopmentExample />
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
