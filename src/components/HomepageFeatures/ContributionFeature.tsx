import Translate from "@docusaurus/Translate";
import { Heading, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconHeartHandshake } from "@tabler/icons-react";
import clsx from "clsx";
import FeatureRow from "../FeatureRow";
import Intro from "../Intro";
import { NewBadge } from "@site/src/components/NewBadge";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";

function ContributionIntro() {
  return (
    <Intro>
      <Icon>
        <IconHeartHandshake />
      </Icon>
      <Heading level={2} size="l">
        <Translate id={"index.contribution.title"}>
          Build your own extensions for the mStudio marketplace
        </Translate>
      </Heading>
      <Text>
        <Translate id={"index.contribution.body"}>
          The mStudio marketplace is a platform for developers to build and
          distribute their own extensions. You can create extensions that
          integrate with the mStudio API and add new features to the mStudio
          platform.
        </Translate>
      </Text>
    </Intro>
  );
}

function ExtensionsFeature() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.contribution.extensions.title">
          Integrating extensions
        </Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"index.contribution.extensions.body"}>
          These guides will help you get started with building extensions for
          the mStudio marketplace.
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <Link href="/docs/v2/contribution">
              <Translate id="index.contribution.extensions.link-overview">
                Introduction and overview
              </Translate>
            </Link>
          </li>
          <li>
            <Link href="/docs/v2/contribution/overview/concepts/authentication/">
              <Translate id="index.contribution.extensions.link-auth">
                Integrating with mStudio access controls
              </Translate>
            </Link>
          </li>
          <li>
            <Link href="/docs/v2/category/reference/">
              <Translate id="index.contribution.extensions.link-api">
                API and webhook specifications
              </Translate>
            </Link>
          </li>
        </ul>
      </Text>
      <Text elementType="p">
        <Translate id="index.contribution.extensions.more">
          Check the complete documentation.
        </Translate>{" "}
        <Link href="/docs/v2/contribution">
          <Translate id="index.contribution.extensions.more.link">
            Read more!
          </Translate>
        </Link>
      </Text>
    </FeatureCard>
  );
}

function ToolsFeature() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.contribution.tools.title">
          Contributor tools
        </Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"index.contribution.tools.body"}>
          These guides will help you get started with building extensions for
          the mStudio marketplace.
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <strong>Flow</strong>:{" "}
            <Translate id="index.contribution.tools.flow">
              The mittwald design system and React component library.
            </Translate>
            <br />
            <Link href="https://github.com/mittwald/flow" target="_blank">
              GitHub
            </Link>{" "}
            |{" "}
            <Link href="https://flow.mittwald.de" target="_blank">
              Documentation
            </Link>
          </li>
        </ul>
      </Text>
      <Heading level={4}>
        <Translate id="index.contribution.tools.community-title">
          Community Contributions
        </Translate>
      </Heading>
      <Text elementType="div">
        <ul>
          <li>
            <Link
              href="https://github.com/nuonic-digital/mittwald-flow-mcp"
              target="_blank"
            >
              <Translate id="index.contribution.tools.community-mcp-flow">
                mittwald Flow MCP
              </Translate>
            </Link>{" "}
            <NewBadge />
            <br />
            <Translate id="index.contribution.tools.community-mcp-flow-desc">
              MCP server to work with mittwald flow frontend
            </Translate>
          </li>
        </ul>
      </Text>
    </FeatureCard>
  );
}

export default function ContributionFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row margin-bottom--lg">
          <div className="col col--12">
            <ContributionIntro />
          </div>
        </div>
        <div className="row">
          <div className={clsx("col col--6")}>
            <ExtensionsFeature />
          </div>
          <div className={clsx("col col--6")}>
            <ToolsFeature />
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
