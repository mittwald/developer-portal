# mittwald Developer Portal -- Contribution guide

## Contributing docs

The main documentation files are written in [Markdown][md] or [MDX][mdx] (also have a look at the [Docusaurus-specific Markdown features][docu-md]). You can find the documentation files in the following folders:

- [`docs/`][docs-en] for the English documentation.
- [`i18n/de/docusaurus-plugin-content-docs/current/`][docs-de] for the German documentation.

When making documentation changes, please remember to update both the English and German versions (when applicable) in the same pull request. If you are not comfortable authoring in one of these languages, feel free to still open a partial pull request and ask for help with translation.

Also, have a look at the official [Docusaurus documentation on internationalization][docu-i18n] for more information.

## Building locally

To build this project locally, you will need to have [Node.js](https://nodejs.org/) installed. Compatible versions are declared in the `engines` section in the `package.json` file.

You can use the following commands to build this project locally:

- `npm install` to install dependencies.
- `npm run generate` to build the OpenAPI reference.
- `npm start` to start a development server.
- `npm run build` to build a production release (this may be necessary to work with multi-lingual content).
- `npm run serve` to serve a production release locally.

## How-Tos

### Working with the changelog

#### Adding a new changelog entry

The changelog is built using [Docusaurus' blog feature][docu-blog]. You can add a new changelog entry by creating a new markdown file in the `changelog/` directory. The file name should follow the pattern `YYYY-MM-DD-<name>.mdx`. The file should contain a frontmatter section with the following fields:

```yaml
title: Example changelog entry
authors: your-name # see changelog/authors.yml
tags: [apiv2] # see changelog/tags.yml
```

#### Automatic API changelog entries

There is also a Gitlab CI job that will automatically create a changelog entry each day when the OpenAPI specification changed (both v1 and v2 are checked for changes). This job will create a new changelog entry in the `changelog/` directory with the name `YYYY-MM-DD-api-changes-vX.mdx`. To track the API changes, the _last_ OpenAPI specification is saved in the `generator/specs` directory, which will then be compared to the _current_ OpenAPI specification. The comparison is done using the [`oasdiff` tool](https://www.oasdiff.com).

To run the automatic changelog generation locally, you can run the `npm run generate:changelog` command. Note that the changelog generator relies on some AI features for text generation, to you will need a valid OpenAI API key in the `OPENAI_API_KEY` environment variable.

#### Customizing generated changelog entries

Automatically generated changelog entries will **NOT** be changed after they are created (they are identified uniquely by the date and the affected API version). This means that you (as a developer) are free to edit the automatically generated changelog entries to your liking (pay special attention to the AI-generated summary, which may or may not be correct).

### Updating translation files

Translation of components is done using [Docusaurus' built-in translation file handling][docu-i18n]. To update the translation files, you can use the following steps:

```
$ npm run docusaurus write-translations
$ npm run docusaurus write-translations -- -l de
```

### Overriding OpenAPI definitions

To override specific parts of an OpenAPI definition, you can provide an override document which follows the [OpenAPI Overlay Specification][overlay]. The generator will look for overlay files in `./generator/overlays/<api-version>/overlay.yaml`.

> [!NOTE]
> Always prefer modifying the source OpenAPI specification directly, instead of using an overlay. Only use overlays if you need it **immediately** (regardless of the release cycle of the backend services providing the actual specs), or for changes that explicitly should not affect the spec, but **only** the documentation generated from it (use your own judgement).

### Provide a custom description for an OpenAPI operation

By default, the OpenAPI description pages use the OpenAPI `.description` field of the respective resource. You can override the description with a custom markdown document by placing it in `generator/overlays/<apiVersion>/<operation-id>/description.md`. Please note that you will need to run `npm run generate` for changes to take effect.

### Override an OpenAPI tag index page.

By default, the tag index pages will be generated from the tag description and an auto-generated list of all operations. You can override this index page by providing a custom markdown document at `generator/overlays/<apiVersion>/<tag-name>.mdx`. Please note that you will need to run `npm run generate` for changes to take effect.

### Provide custom usage examples for OpenAPI operations

The usage examples for OpenAPI operations are generated from the OpenAPI specification. You can override the usage examples by providing a custom markdown document at `generator/overlays/<apiVersion>/<operation-id>/example-<language>.md`. Please note that you will need to run `npm run generate` for changes to take effect. Supported languages are `curl`, `javascript`, `php` and `cli`.

[md]: https://www.markdownguide.org
[mdx]: https://mdxjs.com
[docu-md]: https://docusaurus.io/docs/markdown-features
[docu-i18n]: https://docusaurus.io/docs/i18n/introduction
[docu-blog]: https://docusaurus.io/docs/blog
[docs-en]: https://github.com/mittwald/developer-portal/tree/master/docs
[docs-de]: https://github.com/mittwald/developer-portal/tree/master/i18n/de/docusaurus-plugin-content-docs/current
[overlay]: https://spec.openapis.org/overlay/latest.html
