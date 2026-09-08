---
name: writing-documentation
description: Baseline style, structure and language rules for the mittwald Developer Portal documentation. Use whenever authoring, translating or reviewing content under docs/ or i18n/de/docusaurus-plugin-content-docs/ (.md/.mdx) — covers English/German parity, explicit anchor IDs, Docusaurus callouts, dash usage, shell command prefixes and linking to API operations.
---

# Writing documentation for the mittwald Developer Portal

## When to use this skill

Apply these rules to every documentation change, in both languages:

- `docs/**/*.md`, `docs/**/*.mdx`
- `i18n/de/docusaurus-plugin-content-docs/**/*.md`, `i18n/de/docusaurus-plugin-content-docs/**/*.mdx`

More specific skills build on top of this one:

- API guides under `docs/api/howtos` — see the `writing-api-guides` skill
- App and database deployment guides — see the `writing-app-guides` skill

## Language

- Documentation changes must include updates to both the English and the German version.
- Text must not have spelling or grammar mistakes and must be worded clearly, concisely and
  professionally, but not overly formal. Make suggestions for improvements during code review.
- In German, use the informal "du" form consistently.
- The brand name "mittwald" is ALWAYS lowercase when referring to the company, even at the start of
  a sentence.

## Document structure and formatting

- Markdown sub-headings within a document must have explicit anchor IDs for stable linking (this
  does not apply to the markdown front matter). Suggest changes during code review if they are
  missing. Explicit, technical anchor IDs keep links stable across headline renames and keep them
  from being translated — see the contribution guide for a detailed example.
- Use the `<OperationLink />` component for linking to API operations, and `<OperationExample />`
  for including example requests. Do not link to API operations by hardcoding URLs or markdown
  links into the reference docs — those are brittle and break when an operation name or URL
  changes.
- **Dash usage:**
  - hyphens (`-`) for compound words and ranges, e.g. "open-source", "2024-2025"
  - em dashes (`—`) for parenthetical asides and sentence breaks, e.g. "Deploy your app — with
    integrated tools — in minutes"
  - en dashes (`–`) sparingly, only for numeric ranges where an em dash or hyphen is inappropriate

## Security

- Make sure that code and deployment examples do not contain insecure default credentials.

## Understandability, clarity and completeness

- Commands intended to be executed by the reader in a terminal must clearly indicate whether they
  run in a local terminal or in some kind of remote environment. Use the `shellsession` code type
  for shell commands, and prefix commands with `user@local $ ` for commands run on the local
  machine, or an appropriate other prefix for remote environments.
- Instructions that involve starting or managing containers should document all available ways of
  doing so: the mStudio UI, and the CLI tool using both its imperative (`mw container run`) and
  declarative (`mw stack deploy`) commands.
- When referring to specific API operations, ALWAYS look up the relevant documentation in the
  OpenAPI specification at `static/specs/openapi-v2.json`.

## Notes and callouts

Prefer Docusaurus callouts for important notes, warnings, tips, etc. over markdown constructs. For
example, instead of:

```markdown
**Note:** This is an important note.
```

use:

```markdown
:::note

This is an important note.

:::
```
