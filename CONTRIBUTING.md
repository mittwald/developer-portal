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

### Updating translation files

Translation of components is done using [Docuraurus' built-in translation file handling][docu-i18n]. To update the translation files, you can use the following steps:

```
$ npm run docusaurus write-translations
$ npm run docusaurus write-translations -- -l de
```

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
[docs-en]: https://github.com/mittwald/developer-portal/tree/master/docs
[docs-de]: https://github.com/mittwald/developer-portal/tree/master/i18n/de/docusaurus-plugin-content-docs/current