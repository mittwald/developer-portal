import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";
import { CodeBlock, Icon } from "@mittwald/flow-react-components";
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
import featureStyles from "@site/src/components/HomepageFeatures/styles.module.css";
import FeatureRow from "@site/src/components/FeatureRow";
import Intro, { IntroHeader } from "@site/src/components/Intro";

function MCPPageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">mittwald MCP</h1>
        <p className={styles.heroDescription}>
          <Translate id="mcp.description">
            Prompt your agent with intent. Let your AI agent interact with the
            mittwald mStudio with safe, auditable tool calls.
          </Translate>
          <img
            src={demo}
            alt={translate({
              id: "mcp.img.alt",
              message:
                "An example of using mittwald MCP with an AI assistant to manage infrastructure.",
            })}
          />
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/docs/v2/mcp/getting-connected"
          >
            <Icon>
              <IconRocket />
            </Icon>
            <Translate id="mcp.cta.firstWorkflow">Run First Workflow</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/v2/mcp"
          >
            <Icon>
              <IconBook />
            </Icon>
            <Translate id="mcp.cta.documentation">Documentation</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/mittwald/mcp"
          >
            <Icon>
              <IconBrandGithub />
            </Icon>
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function ServerURLSection() {
  return (
    <section
      style={{
        padding: "2rem 0",
        background: "var(--ifm-color-emphasis-100)",
      }}
    >
      <div className={clsx("container", mcpStyles.urlContainer)}>
        <p>
          <Translate id="mcp.url.intro">
            <strong>Just want to get started quickly?</strong> Use this MCP URL
            in the AI assistant of your choice:
          </Translate>
        </p>
        <CodeBlock
          copyable
          code="https://mcp.mittwald.de/mcp"
          language="text"
          className={mcpStyles.urlField}
        />
        <p>
          <Translate
            id="mcp.url.setupGuides"
            values={{
              link: (
                <Link to="/docs/v2/mcp/getting-connected">
                  <Translate id="mcp.url.setupGuides.link">
                    setup guides
                  </Translate>
                </Link>
              ),
            }}
          >
            {"See our {link} for more detailed instructions."}
          </Translate>
        </p>
      </div>
    </section>
  );
}

function OverviewFeature() {
  return (
    <FeatureRow variant>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <Intro>
              <IntroHeader>
                <Icon>
                  <IconRobot />
                </Icon>
                <h3>
                  <Translate id="mcp.overview.agentFirst.title">
                    Agent-First Infrastructure
                  </Translate>
                </h3>
              </IntroHeader>
              <p>
                <Translate id="mcp.overview.agentFirst.body">
                  mittwald MCP connects your AI coding assistant to mittwald's
                  infrastructure. Describe what you want in natural language,
                  and let your agent handle the API calls.
                </Translate>
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.overview.toolset.title">
                  Comprehensive Toolset
                </Translate>
              </h3>
              <p>
                <Translate id="mcp.overview.toolset.body">
                  Full coverage across projects, apps, databases, DNS, mail,
                  security, and automation. One MCP endpoint for all mittwald
                  operations.
                </Translate>
              </p>
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
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.overview.auth.title">
                  Flexible Authentication
                </Translate>
              </h3>
              <p>
                <Translate id="mcp.overview.auth.body">
                  Choose the auth method that fits your workflow:
                </Translate>
              </p>
              <ul>
                <li>
                  <Translate id="mcp.overview.auth.oauth">
                    <strong>OAuth 2.1</strong> for interactive agents with
                    automatic token refresh
                  </Translate>
                </li>
                <li>
                  <Translate id="mcp.overview.auth.token">
                    <strong>API tokens</strong> for CI/CD pipelines and headless
                    environments
                  </Translate>
                </li>
              </ul>
              <p>
                <Link to="/docs/v2/mcp/getting-connected">
                  <Translate id="mcp.overview.auth.link">
                    Setup guides →
                  </Translate>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}

function GettingStartedFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <Intro>
              <IntroHeader>
                <Icon>
                  <IconPlugConnected />
                </Icon>
                <h3>
                  <Translate id="mcp.getStarted.title">Get Started</Translate>
                </h3>
              </IntroHeader>
              <p>
                <Translate id="mcp.getStarted.body">
                  Connect your preferred AI assistant to mittwald MCP and start
                  managing infrastructure with natural language prompts.
                </Translate>
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.getStarted.connect.title">
                  Connect Your Assistant
                </Translate>
              </h3>
              <p>
                <Translate id="mcp.getStarted.connect.body">
                  Step-by-step setup guides for popular AI coding tools:
                </Translate>
              </p>
              <ul>
                <li>
                  <Link to="/docs/v2/mcp/getting-connected/claude-code">
                    Claude Code
                  </Link>
                </li>
                <li>
                  <Link to="/docs/v2/mcp/getting-connected/github-copilot">
                    GitHub Copilot
                  </Link>
                </li>
                <li>
                  <Link to="/docs/v2/mcp/getting-connected/cursor">Cursor</Link>
                </li>
                <li>
                  <Link to="/docs/v2/mcp/getting-connected/codex-cli">
                    Codex CLI
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.getStarted.learn.title">
                  Learn the Pattern
                </Translate>
              </h3>
              <p>
                <Translate id="mcp.getStarted.learn.body">
                  Human intent in prompts, MCP tools for execution, explicit
                  approvals for risky actions.
                </Translate>
              </p>
              <ul>
                <li>
                  <Link to="/docs/v2/mcp/tutorials">
                    <Translate id="mcp.getStarted.learn.tutorials">
                      Tutorials
                    </Translate>
                  </Link>{" "}
                  —{" "}
                  <Translate id="mcp.getStarted.learn.tutorials.desc">
                    guided walkthroughs
                  </Translate>
                </li>
                <li>
                  <Link to="/docs/v2/mcp/how-to">
                    <Translate id="mcp.getStarted.learn.howto">
                      How-To Playbooks
                    </Translate>
                  </Link>{" "}
                  —{" "}
                  <Translate id="mcp.getStarted.learn.howto.desc">
                    task recipes
                  </Translate>
                </li>
                <li>
                  <Link to="/docs/v2/mcp/runbooks">
                    <Translate id="mcp.getStarted.learn.runbooks">
                      Runbooks
                    </Translate>
                  </Link>{" "}
                  —{" "}
                  <Translate id="mcp.getStarted.learn.runbooks.desc">
                    incident recovery
                  </Translate>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}

function WorkflowFeature() {
  return (
    <FeatureRow variant>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <Intro>
              <IntroHeader>
                <Icon>
                  <IconListCheck />
                </Icon>
                <h3>
                  <Translate id="mcp.workflow.title">How It Works</Translate>
                </h3>
              </IntroHeader>
              <p>
                <Translate id="mcp.workflow.body">
                  Agent-driven workflows follow a consistent pattern: you
                  provide intent, the agent discovers and executes tools, you
                  verify results.
                </Translate>
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--8")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.workflow.steps.title">
                  The Agent Workflow
                </Translate>
              </h3>
              <ol>
                <li>
                  <Translate id="mcp.workflow.steps.intent">
                    <strong>Intent</strong> — You prompt the outcome you want on
                    mittwald
                  </Translate>
                </li>
                <li>
                  <Translate id="mcp.workflow.steps.discovery">
                    <strong>Discovery</strong> — Your agent discovers relevant
                    MCP tools and required inputs
                  </Translate>
                </li>
                <li>
                  <Translate id="mcp.workflow.steps.auth">
                    <strong>Auth</strong> — OAuth or token auth is used for each
                    tool call
                  </Translate>
                </li>
                <li>
                  <Translate id="mcp.workflow.steps.execution">
                    <strong>Execution</strong> — The agent performs tool calls
                    and reports results
                  </Translate>
                </li>
                <li>
                  <Translate id="mcp.workflow.steps.verify">
                    <strong>Verify</strong> — You run read checks and decide
                    whether to proceed, retry, or roll back
                  </Translate>
                </li>
              </ol>
              <p>
                <Translate id="mcp.workflow.responsibility">
                  <strong>Human responsibility:</strong> Destructive or
                  cost-impacting changes should be approved explicitly. Treat
                  the agent as an operator, not as an unattended process.
                </Translate>
              </p>
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}

function TutorialsFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <Intro>
              <IntroHeader>
                <Icon>
                  <IconUsers />
                </Icon>
                <h3>
                  <Translate id="mcp.tutorials.title">
                    Tutorials by Team
                  </Translate>
                </h3>
              </IntroHeader>
              <p>
                <Translate id="mcp.tutorials.body">
                  Outcome-driven walkthroughs organized by team context and use
                  case.
                </Translate>
              </p>
              <p>
                <Link to="/docs/v2/mcp/tutorials">
                  <Translate id="mcp.tutorials.link">
                    Browse all tutorials →
                  </Translate>
                </Link>
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.tutorials.freelancers.title">
                  Freelancers & Agencies
                </Translate>
              </h3>
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
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>
                <Translate id="mcp.tutorials.devops.title">
                  E-Commerce & DevOps
                </Translate>
              </h3>
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
            </div>
          </div>
        </div>
      </div>
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
      <div>
        <MCPPageHeader />
        <main className="index">
          <ServerURLSection />
          <OverviewFeature />
          <GettingStartedFeature />
          <WorkflowFeature />
          <TutorialsFeature />
        </main>
      </div>
    </Layout>
  );
}
