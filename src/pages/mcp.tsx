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
  IconDatabase,
  IconMail,
  IconShield,
  IconTerminal2,
} from "@tabler/icons-react";

import styles from "./mcp.module.css";

function MCPPageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">mittwald MCP</h1>
        <p className={styles.heroTagline}>
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
          <Link
            className="button button--secondary button--lg"
            to="/docs/mcp"
          >
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

function KPISection() {
  return (
    <section className={styles.kpiSection}>
      <div className="container">
        <div className={styles.kpiGrid}>
          <div className={styles.kpi}>
            <span className={styles.kpiMetric}>Comprehensive Toolset</span>
            <span className={styles.kpiLabel}>
              Across projects, apps, databases, DNS, mail, security, and
              automation
            </span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiMetric}>OAuth + API Token</span>
            <span className={styles.kpiLabel}>
              Use OAuth for interactive agents and API tokens for headless
              pipelines
            </span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiMetric}>Agent-First Workflows</span>
            <span className={styles.kpiLabel}>
              Human intent in prompts, MCP tools for execution, approvals for
              risky actions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
}

function Card({ title, description, link, linkText, icon }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <Icon>{icon}</Icon>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={link}>{linkText}</Link>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>Start from what you want done</h2>
        <div className={styles.cardGrid}>
          <Card
            title="Connect Your Assistant"
            description="Set up Claude Code, GitHub Copilot, Cursor, or Codex with the mittwald MCP endpoint."
            link="/docs/mcp/getting-connected"
            linkText="Open setup guides →"
            icon={<IconPlugConnected />}
          />
          <Card
            title="Run Human-Intent Prompts"
            description="Learn the pattern: you describe the outcome, the agent discovers tools and executes the plan."
            link="/docs/mcp/tutorials"
            linkText="See practical workflows →"
            icon={<IconRobot />}
          />
          <Card
            title="Use Task Playbooks"
            description="Use outcome-focused how-to guides mapped to real functional use cases."
            link="/docs/mcp/how-to"
            linkText="Browse how-to playbooks →"
            icon={<IconBook />}
          />
          <Card
            title="Runbook for Incidents"
            description="Use incident recovery procedures with verification and rollback prompts."
            link="/docs/mcp/runbooks"
            linkText="Browse runbooks →"
            icon={<IconShield />}
          />
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  const steps = [
    { id: "1. Intent", description: "You prompt the outcome you want on mittwald." },
    { id: "2. Discovery", description: "Your agent discovers relevant MCP tools and required inputs." },
    { id: "3. Auth", description: "OAuth or token auth is used for each tool call." },
    { id: "4. Execution", description: "The agent performs tool calls and reports results and IDs." },
    { id: "5. Verify", description: "You run read checks and decide whether to proceed, retry, or roll back." },
  ];

  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2>How an agent-driven mittwald task works</h2>
        <div className={styles.workflowGrid}>
          {steps.map((step) => (
            <div key={step.id} className={styles.workflowStep}>
              <div className={styles.stepId}>{step.id}</div>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <p className={styles.workflowNote}>
          <strong>Human responsibility:</strong> destructive or cost-impacting
          changes should be approved explicitly. Treat the agent as an operator,
          not as an unattended process.
        </p>
      </div>
    </section>
  );
}

function TutorialsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>Tutorials by Team</h2>
        <div className={styles.cardGrid}>
          <Card
            title="Freelance Workflows"
            description="Client onboarding, backup monitoring, and repetitive operations without dashboard hopping."
            link="/docs/mcp/tutorials"
            linkText="View playbooks →"
            icon={<IconTerminal2 />}
          />
          <Card
            title="Agency Workflows"
            description="Cross-project visibility, team onboarding, access audits, and support handoffs."
            link="/docs/mcp/tutorials"
            linkText="View playbooks →"
            icon={<IconDatabase />}
          />
          <Card
            title="E-Commerce Workflows"
            description="Launch readiness, backup confidence, and database checks under deadline pressure."
            link="/docs/mcp/tutorials"
            linkText="View playbooks →"
            icon={<IconRocket />}
          />
          <Card
            title="Modern Stack / DevOps"
            description="Container stacks, cron automation, and deployment pipelines with MCP."
            link="/docs/mcp/tutorials"
            linkText="View playbooks →"
            icon={<IconMail />}
          />
        </div>
      </div>
    </section>
  );
}

export default function MCPPage() {
  return (
    <Layout
      title="mittwald MCP"
      description="Prompt your agent with intent. Let mittwald MCP execute the infrastructure work with safe, auditable tool calls."
    >
      <div className={styles.wrapper}>
        <MCPPageHeader />
        <main>
          <KPISection />
          <GettingStartedSection />
          <WorkflowSection />
          <TutorialsSection />
        </main>
      </div>
    </Layout>
  );
}
