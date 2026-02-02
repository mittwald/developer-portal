---
applyTo: "docs/**/*.md,docs/**/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/*.md,i18n/de/docusaurus-plugin-content-docs/**/*.mdx"
---

Pay special attention to these guidelines when reviewing documentation changes:

- Documentation changes must include updates to both English and German versions
- Headings must have explicit anchor IDs for stable linking; suggest changes during code review if missing
- Text must not have spelling or grammar mistakes and must be worded clearly, concisely and professionally, but not overly formal. Make suggestions for improvements during code review.
- In German, use the informal "du" form consistently.
- Make sure that code/deployment examples do not contain insecure default credentials
- Instructions that involve starting or managing containers should document all available ways of doing so: The mStudio UI and the CLI tool using its imperative (`mw container run`) and declarative (`mw stack deploy`) commands.
- Commands intended to be executed by the reader in a terminal must clearly indicate if they should be run in a local terminal, or in any kind of remote environment.
