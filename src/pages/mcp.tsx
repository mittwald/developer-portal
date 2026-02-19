import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import { Icon } from "@mittwald/flow-react-components";
import {
  IconRocket,
  IconBook,
  IconBrandGithub,
  IconPlugConnected,
  IconRobot,
  IconListCheck,
  IconUsers,
} from "@tabler/icons-react";

import styles from "./cli.module.css";
import featureStyles from "@site/src/components/HomepageFeatures/styles.module.css";
import FeatureRow from "@site/src/components/FeatureRow";
import Intro, { IntroHeader } from "@site/src/components/Intro";

function MCPPageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">mittwald MCP</h1>
        <p className={styles.heroDescription}>
          Prompt your agent with intent. Let mittwald MCP execute the
          infrastructure work with safe, auditable tool calls.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/docs/mcp/getting-connected"
          >
            <Icon>
              <IconRocket />
            </Icon>
            Run First Workflow
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/mcp">
            <Icon>
              <IconBook />
            </Icon>
            Documentation
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
                <h3>Agent-First Infrastructure</h3>
              </IntroHeader>
              <p>
                mittwald MCP connects your AI coding assistant to mittwald's
                infrastructure. Describe what you want in natural language, and
                let your agent handle the API calls.
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>Comprehensive Toolset</h3>
              <p>
                Full coverage across projects, apps, databases, DNS, mail,
                security, and automation. One MCP endpoint for all mittwald
                operations.
              </p>
              <ul>
                <li>Project and app management</li>
                <li>Database provisioning</li>
                <li>Domain and SSL configuration</li>
                <li>Backup and restore</li>
              </ul>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>Flexible Authentication</h3>
              <p>Choose the auth method that fits your workflow:</p>
              <ul>
                <li>
                  <strong>OAuth 2.1</strong> for interactive agents with
                  automatic token refresh
                </li>
                <li>
                  <strong>API tokens</strong> for CI/CD pipelines and headless
                  environments
                </li>
              </ul>
              <p>
                <Link to="/docs/mcp/getting-connected">Setup guides →</Link>
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
                <h3>Get Started</h3>
              </IntroHeader>
              <p>
                Connect your preferred AI assistant to mittwald MCP and start
                managing infrastructure with natural language prompts.
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>Connect Your Assistant</h3>
              <p>
                Step-by-step setup guides for popular AI coding tools:
              </p>
              <ul>
                <li>
                  <Link to="/docs/mcp/getting-connected/claude-code">
                    Claude Code
                  </Link>
                </li>
                <li>
                  <Link to="/docs/mcp/getting-connected/github-copilot">
                    GitHub Copilot
                  </Link>
                </li>
                <li>
                  <Link to="/docs/mcp/getting-connected/cursor">Cursor</Link>
                </li>
                <li>
                  <Link to="/docs/mcp/getting-connected/codex-cli">
                    Codex CLI
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>Learn the Pattern</h3>
              <p>
                Human intent in prompts, MCP tools for execution, explicit
                approvals for risky actions.
              </p>
              <ul>
                <li>
                  <Link to="/docs/mcp/tutorials">Tutorials</Link> — guided
                  walkthroughs
                </li>
                <li>
                  <Link to="/docs/mcp/how-to">How-To Playbooks</Link> — task
                  recipes
                </li>
                <li>
                  <Link to="/docs/mcp/runbooks">Runbooks</Link> — incident
                  recovery
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
                <h3>How It Works</h3>
              </IntroHeader>
              <p>
                Agent-driven workflows follow a consistent pattern: you provide
                intent, the agent discovers and executes tools, you verify
                results.
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--8")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>The Agent Workflow</h3>
              <ol>
                <li>
                  <strong>Intent</strong> — You prompt the outcome you want on
                  mittwald
                </li>
                <li>
                  <strong>Discovery</strong> — Your agent discovers relevant MCP
                  tools and required inputs
                </li>
                <li>
                  <strong>Auth</strong> — OAuth or token auth is used for each
                  tool call
                </li>
                <li>
                  <strong>Execution</strong> — The agent performs tool calls and
                  reports results
                </li>
                <li>
                  <strong>Verify</strong> — You run read checks and decide
                  whether to proceed, retry, or roll back
                </li>
              </ol>
              <p>
                <strong>Human responsibility:</strong> Destructive or
                cost-impacting changes should be approved explicitly. Treat the
                agent as an operator, not as an unattended process.
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
                <h3>Tutorials by Team</h3>
              </IntroHeader>
              <p>
                Outcome-driven walkthroughs organized by team context and use
                case.
              </p>
              <p>
                <Link to="/docs/mcp/tutorials">Browse all tutorials →</Link>
              </p>
            </Intro>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>Freelancers & Agencies</h3>
              <ul>
                <li>Client onboarding automation</li>
                <li>Cross-project visibility</li>
                <li>Team access management</li>
                <li>Backup monitoring</li>
              </ul>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", featureStyles.feature)}>
              <h3>E-Commerce & DevOps</h3>
              <ul>
                <li>Launch day preparation</li>
                <li>Database performance checks</li>
                <li>Container stack deployment</li>
                <li>CI/CD pipeline integration</li>
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
      description="Prompt your agent with intent. Let mittwald MCP execute the infrastructure work with safe, auditable tool calls."
    >
      <div>
        <MCPPageHeader />
        <main className="index">
          <OverviewFeature />
          <GettingStartedFeature />
          <WorkflowFeature />
          <TutorialsFeature />
        </main>
      </div>
    </Layout>
  );
}
