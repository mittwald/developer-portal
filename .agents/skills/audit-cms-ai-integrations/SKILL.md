---
name: audit-cms-ai-integrations
description: Audit the AI Hosting CMS integration guides (Drupal, WordPress, Directus) against their upstream provider repositories and fix the drift. Use when asked to check whether the CMS AI docs are still up to date, after a provider module or plugin release, or when the AI Hosting model lineup changes.
---

# Audit CMS AI integration guides

The guides under `docs/platform/aihosting/60-cms/` describe third-party
integrations that live in repositories we do not control. They go stale
silently: nothing in this repo breaks when an upstream module renames an admin
route or adds an operation. This skill is the procedure for comparing them
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

## Step 1: Get real upstream state

Clone fresh into a scratch directory. Do not trust local clones under
`~/Git/Github/` — during the last audit `drupal-ai-provider` there was a
GitHub remnant containing only a "this project moved" README, and
`wordpress-ai-provider` was four months behind.

```bash
git clone --depth 50 https://git.drupalcode.org/project/ai_provider_mittwald.git
```

For the WordPress plugin, fetch and read `origin/main` rather than the working
tree of any existing clone.

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
| `README.md` | supported/unsupported operations |
| `includes/MittwaldModelMetadataDirectory.php` | the hardcoded model → capability switch |

## Step 3: Known drift patterns

Things that have actually been wrong. Check each one explicitly.

- **Whole operations missing.** The Drupal guide documented chat and embeddings
  while the module had also gained reranking, speech-to-text and text-to-speech.
  Diff the operation list in the guide against `default_models` in the provider
  class.
- **Admin paths.** Route files change without a README update.
- **Model lineup drifts in both directions.** A plugin can still hardcode models
  the platform removed (`Mistral-Medium-3.5-128B` in the WordPress metadata
  directory) *and* lag models the platform added (`Qwen3.8-27B-NVFP4`).
  Cross-check every model name against `docs/platform/aihosting/30-models/`.
- **Capability claims are per-model, not per-family.** `Qwen3.5-0.8B` is
  text-only while `Qwen3.5-122B-A10B-FP8` takes images. Never write "the Qwen
  models support vision".
- **Connector scope.** The WordPress connector implements chat completions only.
  Features of the companion AI plugin that need other operations — image
  generation above all — cannot work through mittwald and must be marked.
- **Upstream naming vs. the live product.** The mittwald WordPress readme says
  settings live under "Settings > AI Experiments"; the published WordPress.org
  plugin is called "AI" with settings at Settings → AI. Verify user-facing names
  against wordpress.org / drupal.org before copying an upstream readme.
- **Stale claims about our own platform.** The Drupal guide claimed vector
  database support was "in development" long after the platform documented
  pgvector, Qdrant and ChromaDB on container hosting. Grep this repo before
  repeating any "coming soon" statement.

## Step 4: Write to house style

- **Task-oriented.** These are setup guides. Prerequisites, installation,
  configuration steps, and enough of a capability overview to judge fit. Push
  option tables, model defaults, voice lists and error caveats to the upstream
  project page and link it.
- **No background.** Fork lineage ("adapted from `ai_provider_openai`") and
  similar context does not help someone doing the setup. Leave it out.
- **Be careful with upstream warnings.** An "experimental, not for production"
  banner may be stale in the upstream README itself. Confirm before repeating
  it; ask if unsure.
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

Then confirm by hand that every internal link target exists — a renamed section
is the likeliest way this edit breaks the build.

Be aware that Prettier reformats but does **not** validate MDX: it accepts
unclosed JSX tags and broken `{...}` expressions without complaint. That gap
does not matter much here, because these three guides contain no JSX — but if
an audit ever adds a component or an expression, Prettier passing means
nothing. `npm run build` is the only real check; it is slow and needs
`npm run generate` first, so reserve it for structural changes.

If you do reach for an ad-hoc MDX compile check, run it against an *unmodified*
file first. Docusaurus parses `{#anchor}` with its own remark plugin, so a plain
`@mdx-js/mdx` compile fails on every file in this repo. A checker that flags
the baseline is broken, not the doc.

## Step 6: Report

Separate what is genuinely wrong from what is merely thin, and list upstream
problems you did not fix (a plugin hardcoding a removed model, a stale upstream
readme) so someone can take them to the owning repository.
