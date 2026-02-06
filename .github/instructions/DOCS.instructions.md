---
applyTo: "docs/**/*.md,docs/**/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/*.md,i18n/de/docusaurus-plugin-content-docs/**/*.mdx"
---

Pay special attention to these guidelines when authoring and reviewing documentation changes:

## Language

- Documentation changes must include updates to both English and German versions
- Text must not have spelling or grammar mistakes and must be worded clearly, concisely and professionally, but not overly formal. Make suggestions for improvements during code review.
- In German, use the informal "du" form consistently.
- The brand name "mittwald" should ALWAYS be lowercase when referring to the company, even at the start of a sentence.

## Document structure and formatting

- Markdown sub-headings within a document must have explicit anchor IDs for stable linking (this does not apply to the markdown front matter); suggest changes during code review if missing
- Use the `<OperationLink />` component for linking to API operations, and `<OperationExample />` for including example requests. Do not link to API operations by hardcoding URLs or markdown links to the reference docs, as these are brittle and will break if the operation name or URL changes.

## Security

- Make sure that code/deployment examples do not contain insecure default credentials

## Understandability, clarity and completeness

- Commands intended to be executed by the reader in a terminal must clearly indicate if they should be run in a local terminal, or in any kind of remote environment.
- Instructions that involve starting or managing containers should document all available ways of doing so: The mStudio UI and the CLI tool using its imperative (`mw container run`) and declarative (`mw stack deploy`) commands.
- When referring to specific API operations, ALWAYS look up the relevant documentation in the OpenAPI specification in `/static/specs/openapi-v2.json`.

## Notes and callouts

Prefer Docuraurus callouts for important notes, warnings, tips, etc. over markdown constructs. For example, instead of:

```markdown
**Note:** This is an important note.
```

Use:

```markdown
:::note

This is an important note.

:::
```
