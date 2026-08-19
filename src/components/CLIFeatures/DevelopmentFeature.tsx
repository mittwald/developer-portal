import FeatureRow from "@site/src/components/FeatureRow";
import clsx from "clsx";
import React from "react";
import Intro, { IntroHeader } from "@site/src/components/Intro";
import {
  Heading,
  Icon,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { IconScript } from "@tabler/icons-react";
import Translate from "@docusaurus/Translate";
import Link from "@site/src/components/Link";
import CodeBlock from "@theme/CodeBlock";

function DevelopmentIntro() {
  return (
    <Intro>
      <IntroHeader>
        <Icon>
          <IconScript />
        </Icon>
        <h3>
          <Translate id={"cli.dev.title"}>
            Supercharge your development
          </Translate>
        </h3>
      </IntroHeader>
      <p>
        <Translate id={"cli.dev.body"}>
          The mittwald CLI can integrate seamlessly into your development
          workflow. It can simplify your development tasks and even help you set
          up your local development environment.
        </Translate>
      </p>
    </Intro>
  );
}

function DevelopmentDocumentation() {
  return (
    <Section>
      <Heading>
        <Translate id="cli.dev.features.title">Development features</Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"cli.dev.features.body"}>
          Typical development tasks that can be simplified with the mittwald CLI
          include:
        </Translate>
      </Text>
      <Text>
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
    </Section>
  );
}

function DevelopmentExample() {
  return (
    <Section>
      <CodeBlock language="shell-session">{`$ # Setup ddev project
$ mw ddev init

$ # Pull your project files from mittwald
$ ddev pull mittwald

$ # Start your local environment
$ ddev start`}</CodeBlock>
      <Text elementType="p">
        <Link to="/docs/v2/platform/development/ddev/">
          <Translate id={"cli.dev.ddev"}>
            More about our DDEV integration
          </Translate>
        </Link>
      </Text>
    </Section>
  );
}

export default function DevelopmentFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <DevelopmentIntro />
          </div>
          <div className={clsx("col col--4")}>
            <LayoutCard>
              <DevelopmentDocumentation />
            </LayoutCard>
          </div>
          <div className={clsx("col col--4")}>
            <LayoutCard>
              <DevelopmentExample />
            </LayoutCard>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
