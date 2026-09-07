---
applyTo: "docs/guides/apps/*.md,docs/guides/apps/*.mdx,docs/platform/databases/*.md,docs/platform/databases/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/guides/apps/*.md,i18n/de/docusaurus-plugin-content-docs/**/guides/apps/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/platform/databases/*.md,i18n/de/docusaurus-plugin-content-docs/**/platform/databases/*.mdx"
---

The guidelines for app and database deployment guides in `docs/guides/apps` and
`docs/platform/databases` live in the agent skill
[`writing-app-guides`](../../.agents/skills/writing-app-guides/SKILL.md). Read that file and follow
it.

It is the single source of truth for front matter, document structure, the required order of
deployment methods (Terraform, mStudio UI, `mw container run`, `mw stack deploy`), UI walkthrough
formatting, environment variable blocks and container port constraints.

Also follow the general documentation guidelines in the
[`writing-documentation`](../../.agents/skills/writing-documentation/SKILL.md) skill.
