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

[md]: https://www.markdownguide.org
[mdx]: https://mdxjs.com
[docu-md]: https://docusaurus.io/docs/markdown-features
[docu-i18n]: https://docusaurus.io/docs/i18n/introduction
[docs-en]: https://github.com/mittwald/developer-portal/tree/master/docs
[docs-de]: https://github.com/mittwald/developer-portal/tree/master/i18n/de/docusaurus-plugin-content-docs/current