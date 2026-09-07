---
name: audit-cms-ai-integrations
description: Audit the AI Hosting CMS integration guides (Drupal, WordPress, Directus) against their upstream provider repositories and fix the drift. Use when asked to check whether the CMS AI docs are still up to date, after a provider module or plugin release, or when the AI Hosting model lineup changes.
---

# Audit CMS AI integration guides

The guides under `docs/platform/aihosting/60-cms/` describe third-party
integrations that live in repositories we do not control. They go stale
silently: nothing in this repo breaks when an upstream module renames an admin
route or gains an operation. This skill is the procedure for comparing them
against upstream and correcting them.

## Scope

| Guide | Upstream source of truth |
| --- | --- |
| `20-drupal.mdx` | `https://git.drupalcode.org/project/ai_provider_mittwald.git` |
| `30-wordpress.mdx` | `https://github.com/mittwald/wordpress-ai-provider` |
| `40-directus.mdx` | Directus core (no mittwald plugin — it uses the built-in OpenAI-compatible provider) |

Every guide has a German mirror at
`i18n/de/docusaurus-plugin-content-docs/current/platform/aihosting/60-cms/`.
**Both versions must be changed in the same commit.** A fix applied only to the
English file is a bug.

## Step 1: Fetch upstream

Clone each upstream into a scratch directory:

```bash
git clone --depth 50 https://git.drupalcode.org/project/ai_provider_mittwald.git
git clone --depth 50 https://github.com/mittwald/wordpress-ai-provider.git
```

Read the default branch. The Drupal module is hosted on drupal.org, not GitHub.

## Step 2: Read code, not just the README

Upstream READMEs are themselves a drift source. Check them against the files
that actually define behaviour:

**Drupal module**

| File | Tells you |
| --- | --- |
| `composer.json` | AI and Key module version constraints |
| `ai_provider_mittwald.info.yml` | Drupal core requirement |
| `ai_provider_mittwald.routing.yml` | the real admin path (`/admin/config/ai/providers/mittwald`) |
| `ai_provider_mittwald.links.menu.yml` | where the settings link appears in the menu tree |
| `definitions/api_defaults.yml` | every configurable option, its range and default |
| `src/Plugin/AiProvider/MittwaldProvider.php` | `default_models` per operation, and the regexes deciding which models get which capability |

**WordPress plugin**

| File | Tells you |
| --- | --- |
| `readme.txt` | `Requires at least`, the wordpress.org-facing description |
| `README.md` | supported and unsupported operations |
| `includes/MittwaldModelMetadataDirectory.php` | the hardcoded model → capability switch |

## Step 3: What to check

- **Operation coverage.** Diff the operations the guide documents against
  `default_models` in the Drupal provider class, and against the supported and
  unsupported lists in the WordPress README. A module can gain a whole
  operation without any doc-visible signal.
- **Admin paths.** Route and menu files change without a README update.
- **Model lineup, in both directions.** An integration can hardcode models the
  platform has removed *and* lag models the platform has added. Cross-check
  every model name against `docs/platform/aihosting/30-models/`.
- **Capabilities are per-model, not per-family.** `Qwen3.5-0.8B` is text-only
  while `Qwen3.5-122B-A10B-FP8` accepts images, so "the Qwen models support
  vision" is wrong. Take image input and reasoning support from the capability
  regexes or the metadata switch, model by model.
- **Connector scope.** Where an integration implements only some operations,
  features of a companion plugin that need the others cannot work through
  mittwald and must be marked as such.
- **Upstream naming vs. the published product.** An upstream readme can name an
  admin screen or a companion plugin differently from what is actually shipped.
  Verify user-facing names against wordpress.org / drupal.org before copying
  them.
- **Claims about our own platform.** Grep this repo before repeating any
  "in development" or "coming soon" statement — the feature may already be
  documented elsewhere.

## Step 4: Write to house style

- **Task-oriented.** These are setup guides: prerequisites, installation,
  configuration steps, and enough of a capability overview to judge fit. Push
  option tables, model defaults, voice lists and error caveats to the upstream
  project page and link it.
- **No background.** Fork lineage and similar context does not help someone
  doing the setup. Leave it out.
- **Treat upstream warnings as claims to verify.** An "experimental, not for
  production" banner may be stale in the upstream README itself. Confirm before
  repeating it; ask if unsure.
- **Explicit anchors.** Headings carry `{#kebab-id}` so anchors survive
  translation and renaming. Keep the same anchor ids in the German file.
- Relative links resolve against the doc URL: `../../models/`,
  `../../access-and-usage/access`, `../../access-and-usage/terms-of-use`,
  `../../dedicated/getting-started`, `../../examples/glm-ocr/`. Absolute form
  for other sections: `/docs/v2/platform/workloads/containers/`.

## Step 5: Verify

```bash
npx prettier --write "docs/platform/aihosting/60-cms/*.mdx" \
  "i18n/de/docusaurus-plugin-content-docs/current/platform/aihosting/60-cms/*.mdx"
```

Then confirm that every internal link target exists — a renamed section is the
likeliest way this edit breaks the build.

Prettier reformats but does **not** validate MDX: it accepts unclosed JSX tags
and broken `{...}` expressions without complaint. That gap is narrow here,
since these guides contain no JSX, but if an audit adds a component or an
expression, Prettier passing means nothing. `npm run build` is the only real
check; it is slow and needs `npm run generate` first, so reserve it for
structural changes.

If you reach for an ad-hoc MDX compile check, run it against an *unmodified*
file first. Docusaurus parses `{#anchor}` with its own remark plugin, so a
plain `@mdx-js/mdx` compile fails on every file in this repo. A checker that
flags the baseline is broken, not the doc.

## Step 6: Report

Separate what is genuinely wrong from what is merely thin, and list upstream
problems you did not fix — an integration hardcoding a removed model, a readme
that contradicts the published product — so someone can take them to the
owning repository.
