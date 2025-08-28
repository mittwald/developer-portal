# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Core Commands

- `npm install` - Install dependencies (requires Node.js >=20)
- `npm start` - Start development server
- `npm run build` - Build production release
- `npm run serve` - Serve production release locally
- `npm run format` - Format code with Prettier (targets docs, i18n, src directories)

### Generation Commands

- `npm run generate` - Generate OpenAPI reference documentation from specs
- `npm run generate:changelog` - Generate changelog entries
- `npm run generate:cli` - Generate CLI documentation
- `npm run generate:translations` - Generate translation files

## Project Architecture

This is the **mittwald Developer Portal** - a Docusaurus-based documentation site that serves API documentation, CLI guides, platform documentation, and developer resources.

### Key Architecture Components

**Documentation Generation System**: The project uses automated generation for API reference docs from OpenAPI specifications located in `src/openapi/`. The generation system supports multiple API versions (v1, v2) with overlay customizations.

**Multi-language Support**: Full internationalization with English (default) and German translations. English docs in `docs/`, German translations in `i18n/de/docusaurus-plugin-content-docs/current/`.

**Docusaurus Framework**: Built on Docusaurus v3 with custom plugins for client redirects, multi-blog support (changelog), and Mermaid diagrams.

### Directory Structure

- `docs/` - Main documentation content (English)
- `i18n/` - Internationalization files, primarily German translations
- `src/` - Custom React components, OpenAPI utilities, and theme customizations
- `generator/` - TypeScript scripts for automated doc generation from OpenAPI specs
- `changelog/` - Changelog entries (auto-generated and manual)
- `static/` - Static assets (images, fonts, OpenAPI spec files)

### Generation System Details

The `generator/` directory contains sophisticated tooling:

- `generate-ref.ts` - Main API reference generator from OpenAPI specs
- `overlays/` - Custom content overlays for specific API operations
- `templates/` - EJS templates for generating documentation
- `util/` - Utilities for spec processing, sidebar generation, title canonicalization

### Custom Components

The project extends Docusaurus with specialized components in `src/components/`:

- OpenAPI-specific components for operation documentation
- Feature showcase components for homepage
- Custom styling and interaction elements

## Development Notes

- Uses TypeScript throughout with strict compilation settings
- OpenAPI specs are version-managed (v1 legacy, v2 current)
- Content must be updated in both English and German when applicable
- Production builds may be necessary for multi-lingual content development
- The site supports versioned documentation with v2 as current and v1 as unmaintained

## Authoring guidelines

### Writing deployment guides

When writing deployment guides for applications, databases, or other services that should run in containers, follow the following structure:

1. Deploying the workload
   1. Deployment via Terraform (recommended)
      - relevant documentation:
        - https://registry.terraform.io/providers/mittwald/mittwald/latest/docs/resources/container_stack
        - https://registry.terraform.io/providers/mittwald/mittwald/latest/docs/data-sources/container_image
   2. Deployment via mStudio UI
   3. Imperative deployment on the CLI via `mw container run` command
      - relevant documentation:
        - https://docs.mittwald.de/cli/container/run/
        - search the Docher Hub for documentation on the relevant images
   4. Declarative deployment on the CLI via `mw stack deploy` command
2. Operations; in this section, include any operational tasks that are required to run the workload, such as backups, monitoring, or logging.
3. Integrations; in this section, describe integrations in common CMS platforms such as WordPress, Drupal, TYPO3 or Joomla.
