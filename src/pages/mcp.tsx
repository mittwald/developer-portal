import React from "react";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";
import {
  Flex,
  Heading,
  Icon,
  Image,
  Link as FlowLink,
  Text,
} from "@mittwald/flow-react-components";
import {
  IconBook,
  IconBrandGithub,
  IconListCheck,
  IconPlugConnected,
  IconRobot,
  IconRocket,
  IconUsers,
} from "@tabler/icons-react";

import styles from "./cli.module.css";
import mcpStyles from "./mcp.module.css";
import demo from "@site/static/img/mcp-demo.png";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";
import FeatureRow from "@site/src/components/FeatureRow";
import Intro from "@site/src/components/Intro";
import Hero, { HeroEntries, HeroEntry } from "@site/src/components/Hero";

function MCPPageHeader() {
  return (
    <Hero>
      <Heading level={1} size="xxl">
        mittwald MCP
      </Heading>
      <Text elementType="p" align="center">
        <Translate id="mcp.description">
          Prompt your agent with intent. Let mittwald MCP execute the
          infrastructure work with safe, auditable tool calls.
        </Translate>
      </Text>
      <Image
        src={demo}
        withRoundedCorners={false}
        className={styles.demo}
        alt={translate({
          id: "mcp.img.alt",
          message:
            "An example of using mittwald MCP with an AI assistant to manage infrastructure.",
        })}
      />
      <HeroEntries>
        <HeroEntry
          href="/docs/v2/agentic-integration/mcp/getting-connected"
          icon={<IconRocket />}
          title={
            <Translate id="mcp.cta.firstWorkflow">Run first workflow</Translate>
          }
          description={
            <Translate id="mcp.cta.firstWorkflow.description">
              Connect your AI assistant to mittwald MCP and run your first
              workflow.
            </Translate>
          }
        />
        <HeroEntry
          href="/docs/v2/agentic-integration/mcp"
          icon={<IconBook />}
          title={
            <Translate id="mcp.cta.documentation">Documentation</Translate>
          }
          description={
            <Translate id="mcp.cta.documentation.description">
              Learn about authentication, the available tools and step-by-step
              tutorials.
            </Translate>
          }
        />
        <HeroEntry
          href="https://github.com/mittwald/mcp-server"
          target="_blank"
          icon={<IconBrandGithub />}
          title="GitHub"
          description={
            <Translate id="mcp.cta.github.description">
              Browse the source code of the MCP server and report issues.
            </Translate>
          }
        />
      </HeroEntries>
    </Hero>
  );
}

/** The MCP URL to copy, for a quick start */
function ServerURLSection() {
  return (
    <section className={mcpStyles.urlSection}>
      <Flex direction="column" align="center" gap="m" className="container">
        <Text elementType="p" align="center">
          <strong>
            <Translate id="mcp.url.intro.bold">
              Just want to get started quickly?
            </Translate>
          </strong>{" "}
          <Translate id="mcp.url.intro">
            Use this MCP URL in the AI assistant of your choice:
          </Translate>
        </Text>
        <CodeBlock language="text" className={mcpStyles.url}>
          https://mcp.mittwald.de/mcp
        </CodeBlock>
        <Text elementType="p" align="center">
          <Translate
            id="mcp.url.setupGuides"
            values={{
              link: (
                <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected">
                  <Translate id="mcp.url.setupGuides.link">
                    setup guides
                  </Translate>
                </FlowLink>
              ),
            }}
          >
            {"See our {link} for more detailed instructions."}
          </Translate>
        </Text>
      </Flex>
    </section>
  );
}

function OverviewFeature() {
  return (
    <FeatureRow
      variant
      intro={
        <Intro>
          <Icon>
            <IconRobot />
          </Icon>
          <Heading level={2} size="l">
            <Translate id="mcp.overview.agentFirst.title">
              Agent-first infrastructure
            </Translate>
          </Heading>
          <Text>
            <Translate id="mcp.overview.agentFirst.body">
              mittwald MCP connects your AI coding assistant to mittwald's
              infrastructure. Describe what you want in natural language, and
              let your agent handle the API calls.
            </Translate>
          </Text>
        </Intro>
      }
    >
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.overview.toolset.title">
            Comprehensive toolset
          </Translate>
        </Heading>
        <Text elementType="p">
          <Translate id="mcp.overview.toolset.body">
            Full coverage across projects, apps, databases, DNS, mail, security,
            and automation. One MCP endpoint for all mittwald operations.
          </Translate>
        </Text>
        <Text elementType="div">
          <ul>
            <li>
              <Translate id="mcp.overview.toolset.projects">
                Project and app management
              </Translate>
            </li>
            <li>
              <Translate id="mcp.overview.toolset.database">
                Database provisioning
              </Translate>
            </li>
            <li>
              <Translate id="mcp.overview.toolset.domain">
                Domain and SSL configuration
              </Translate>
            </li>
            <li>
              <Translate id="mcp.overview.toolset.backup">
                Backup and restore
              </Translate>
            </li>
          </ul>
        </Text>
      </FeatureCard>
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.overview.auth.title">
            Flexible authentication
          </Translate>
        </Heading>
        <Text elementType="p">
          <Translate id="mcp.overview.auth.body">
            Choose the auth method that fits your workflow:
          </Translate>
        </Text>
        <Text elementType="div">
          <ul>
            <li>
              <Translate
                id="mcp.overview.auth.oauth"
                values={{ bold: <strong>OAuth 2.1</strong> }}
              >
                {"{bold} for interactive agents with automatic token refresh"}
              </Translate>
            </li>
            <li>
              <Translate
                id="mcp.overview.auth.token"
                values={{ bold: <strong>API tokens</strong> }}
              >
                {"{bold} for CI/CD pipelines and headless environments"}
              </Translate>
            </li>
          </ul>
        </Text>
        <Text elementType="p">
          <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected">
            <Translate id="mcp.overview.auth.link">Setup guides →</Translate>
          </FlowLink>
        </Text>
      </FeatureCard>
    </FeatureRow>
  );
}

function GettingStartedFeature() {
  return (
    <FeatureRow
      intro={
        <Intro>
          <Icon>
            <IconPlugConnected />
          </Icon>
          <Heading level={2} size="l">
            <Translate id="mcp.getStarted.title">Get started</Translate>
          </Heading>
          <Text>
            <Translate id="mcp.getStarted.body">
              Connect your preferred AI assistant to mittwald MCP and start
              managing infrastructure with natural language prompts.
            </Translate>
          </Text>
        </Intro>
      }
    >
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.getStarted.connect.title">
            Connect your assistant
          </Translate>
        </Heading>
        <Text elementType="p">
          <Translate id="mcp.getStarted.connect.body">
            Step-by-step setup guides for popular AI coding tools:
          </Translate>
        </Text>
        <Text elementType="div">
          <ul>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected/claude-code">
                Claude Code
              </FlowLink>
            </li>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected/github-copilot">
                GitHub Copilot
              </FlowLink>
            </li>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected/cursor">
                Cursor
              </FlowLink>
            </li>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/getting-connected/codex-cli">
                Codex CLI
              </FlowLink>
            </li>
          </ul>
        </Text>
      </FeatureCard>
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.getStarted.learn.title">
            Learn the pattern
          </Translate>
        </Heading>
        <Text elementType="p">
          <Translate id="mcp.getStarted.learn.body">
            Human intent in prompts, MCP tools for execution, explicit approvals
            for risky actions.
          </Translate>
        </Text>
        <Text elementType="div">
          <ul>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/tutorials">
                <Translate id="mcp.getStarted.learn.tutorials">
                  Tutorials
                </Translate>
              </FlowLink>{" "}
              —{" "}
              <Translate id="mcp.getStarted.learn.tutorials.desc">
                guided walkthroughs
              </Translate>
            </li>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/how-to">
                <Translate id="mcp.getStarted.learn.howto">
                  How-to playbooks
                </Translate>
              </FlowLink>{" "}
              —{" "}
              <Translate id="mcp.getStarted.learn.howto.desc">
                task recipes
              </Translate>
            </li>
            <li>
              <FlowLink href="/docs/v2/agentic-integration/mcp/runbooks">
                <Translate id="mcp.getStarted.learn.runbooks">
                  Runbooks
                </Translate>
              </FlowLink>{" "}
              —{" "}
              <Translate id="mcp.getStarted.learn.runbooks.desc">
                incident recovery
              </Translate>
            </li>
          </ul>
        </Text>
      </FeatureCard>
    </FeatureRow>
  );
}

function WorkflowFeature() {
  return (
    <FeatureRow
      variant
      intro={
        <Intro>
          <Icon>
            <IconListCheck />
          </Icon>
          <Heading level={2} size="l">
            <Translate id="mcp.workflow.title">How it works</Translate>
          </Heading>
          <Text>
            <Translate id="mcp.workflow.body">
              Agent-driven workflows follow a consistent pattern: you provide
              intent, the agent discovers and executes tools, you verify
              results.
            </Translate>
          </Text>
        </Intro>
      }
    >
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.workflow.steps.title">
            The agent workflow
          </Translate>
        </Heading>
        <Text elementType="div">
          <ol>
            <li>
              <Translate
                id="mcp.workflow.steps.intent"
                values={{ bold: <strong>Intent</strong> }}
              >
                {"{bold} — You prompt the outcome you want on mittwald"}
              </Translate>
            </li>
            <li>
              <Translate
                id="mcp.workflow.steps.discovery"
                values={{ bold: <strong>Discovery</strong> }}
              >
                {
                  "{bold} — Your agent discovers relevant MCP tools and required inputs"
                }
              </Translate>
            </li>
            <li>
              <Translate
                id="mcp.workflow.steps.auth"
                values={{ bold: <strong>Auth</strong> }}
              >
                {"{bold} — OAuth or token auth is used for each tool call"}
              </Translate>
            </li>
            <li>
              <Translate
                id="mcp.workflow.steps.execution"
                values={{ bold: <strong>Execution</strong> }}
              >
                {"{bold} — The agent performs tool calls and reports results"}
              </Translate>
            </li>
            <li>
              <Translate
                id="mcp.workflow.steps.verify"
                values={{ bold: <strong>Verify</strong> }}
              >
                {
                  "{bold} — You run read checks and decide whether to proceed, retry, or roll back"
                }
              </Translate>
            </li>
          </ol>
        </Text>
        <Text elementType="p">
          <Translate
            id="mcp.workflow.responsibility"
            values={{ bold: <strong>Human responsibility:</strong> }}
          >
            {
              "{bold} Destructive or cost-impacting changes should be approved explicitly. Treat the agent as an operator, not as an unattended process."
            }
          </Translate>
        </Text>
      </FeatureCard>
    </FeatureRow>
  );
}

function TutorialsFeature() {
  return (
    <FeatureRow
      intro={
        <Intro>
          <Icon>
            <IconUsers />
          </Icon>
          <Heading level={2} size="l">
            <Translate id="mcp.tutorials.title">Tutorials by team</Translate>
          </Heading>
          <Text>
            <Translate id="mcp.tutorials.body">
              Outcome-driven walkthroughs organized by team context and use
              case.
            </Translate>
          </Text>
          <Text>
            <FlowLink href="/docs/v2/agentic-integration/mcp/tutorials">
              <Translate id="mcp.tutorials.link">
                Browse all tutorials →
              </Translate>
            </FlowLink>
          </Text>
        </Intro>
      }
    >
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.tutorials.freelancers.title">
            Freelancers & agencies
          </Translate>
        </Heading>
        <Text elementType="div">
          <ul>
            <li>
              <Translate id="mcp.tutorials.freelancers.onboarding">
                Client onboarding automation
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.freelancers.visibility">
                Cross-project visibility
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.freelancers.access">
                Team access management
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.freelancers.backup">
                Backup monitoring
              </Translate>
            </li>
          </ul>
        </Text>
      </FeatureCard>
      <FeatureCard>
        <Heading level={3}>
          <Translate id="mcp.tutorials.devops.title">
            E-commerce & DevOps
          </Translate>
        </Heading>
        <Text elementType="div">
          <ul>
            <li>
              <Translate id="mcp.tutorials.devops.launch">
                Launch day preparation
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.devops.database">
                Database performance checks
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.devops.container">
                Container stack deployment
              </Translate>
            </li>
            <li>
              <Translate id="mcp.tutorials.devops.cicd">
                CI/CD pipeline integration
              </Translate>
            </li>
          </ul>
        </Text>
      </FeatureCard>
    </FeatureRow>
  );
}

export default function MCPPage() {
  return (
    <Layout
      title="mittwald MCP"
      description={translate({
        id: "mcp.description",
        message:
          "Prompt your agent with intent. Let mittwald MCP execute the infrastructure work with safe, auditable tool calls.",
      })}
    >
      <MCPPageHeader />
      <main className="index">
        <ServerURLSection />
        <OverviewFeature />
        <GettingStartedFeature />
        <WorkflowFeature />
        <TutorialsFeature />
      </main>
    </Layout>
  );
}
