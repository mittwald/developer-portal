import * as path from "path";
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenAPIV3 } from "openapi-types";
import * as url from "url";
import * as yaml from "yaml";

type APIVersion = `v${number}`

async function loadSpec(apiVersion: APIVersion): Promise<OpenAPIV3.Document> {
  const spec = await fetch(`https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`);
  return await spec.json();
}

async function dereferenceSpec(spec: OpenAPIV3.Document): Promise<OpenAPIV3.Document> {
  return await $RefParser.dereference(spec, {
    dereference: {
      circular: "ignore"
    }
  });
}

function determineServerURLAndBasePath(apiVersion: APIVersion, spec: OpenAPIV3.Document): [string, string] {
  let basePath = "";

  const serverURL = spec.servers?.[0].url ?? `https://api.mittwald.de/${apiVersion}`;
  if (serverURL) {
    const parsedServerURL = url.parse(serverURL);
    basePath = parsedServerURL.pathname;
  }

  return [serverURL, basePath];
}

function renderAPISpecToFile(operationFile: string, frontMatterYAML: string, urlPathWithBase: string, method: string, serializedSpec: string, serverURL: string, apiVersion: APIVersion) {
  const withSDKExamples = apiVersion !== "v1";

  // Yes, this is JavaScript that renders more JavaScript (or mdx, to be precise).
  // Yes, this is a bit weird and opens up a whole can of worms. Oh, well.

  // language=text
  fs.writeFileSync(operationFile, `---
${frontMatterYAML}
---

import {OperationRequest, OperationResponses} from "@site/src/components/openapi/OperationReference";
import {OperationMetadata} from "@site/src/components/openapi/OperationMetadata";
import {OperationUsage} from "@site/src/components/openapi/OperationUsage";

<OperationMetadata path="${urlPathWithBase}" method="${method}" spec={${serializedSpec}} />

## Request

<OperationRequest spec={${serializedSpec}} />

## Responses

<OperationResponses spec={${serializedSpec}} />

## Usage examples

<OperationUsage method="${method}" url="${urlPathWithBase}" spec={${serializedSpec}} baseURL="${serverURL}" withJavascript={${withSDKExamples}} withPHP={${withSDKExamples}} />

`);
}

function exportSpecToSource(spec: OpenAPIV3.Document, apiVersion: APIVersion) {
  fs.writeFileSync(`src/openapi/openapi-${apiVersion}.json`, JSON.stringify(spec, null, 2));
}

function slugFromTagName(tagName: string): string {
  return tagName.replace(/ /g, "").toLowerCase().replace(/[^a-z0-9]/, "");
}

function stripTrailingDot(str: string | undefined): string | undefined {
  return str?.replace(/\.$/, "");
}

async function renderTagIndexPage(name: string, description: string, outputPath: string, sidebarItems: any[]): Promise<void> {
  const indexFile = path.join(outputPath, "index.mdx");

  const frontMatter = {
    title: name,
    description,
    displayed_sidebar: "apiSidebar",
  };
  const frontMatterYAML: string = yaml.stringify(frontMatter);

  const cardList = sidebarItems.
    map(i => `<OperationDocCard 
      method={${JSON.stringify(i.customProps.method)}}
      path={${JSON.stringify(i.customProps.path)}}
      docId={${JSON.stringify(i.id)}}
      summary={${JSON.stringify(i.customProps.summary)}}
      deprecated={${JSON.stringify(i.customProps.deprecated)}} />`).
    join("\n");

  // language=text
  const content = `---
${frontMatterYAML}
---

import OperationDocCard from "@site/src/components/openapi/OperationDocCard";

# ${name}

${description}

${cardList}
`;

  fs.writeFileSync(indexFile, content, { encoding: "utf-8" });
}

async function renderAPIDocs(apiVersion: APIVersion, outputPath: string) {
  const sidebar = [];
  const originalSpec = await loadSpec(apiVersion);
  const spec = await dereferenceSpec(originalSpec);
  const [serverURL, basePath] = determineServerURLAndBasePath(apiVersion, spec);

  exportSpecToSource(originalSpec, apiVersion);

  for (const { name, description } of spec.tags) {
    const slug = slugFromTagName(name);
    const operationsDir = path.join(outputPath, slug);
    const sidebarItems = [];

    fs.mkdirSync(operationsDir, { recursive: true });

    for (const urlPath of Object.keys(spec.paths)) {
      const operations = spec.paths[urlPath];
      const urlPathWithBase = basePath + urlPath.replace(new RegExp(`${basePath}/`), "/");
      for (const method of Object.keys(operations)) {
        const operation = operations[method];
        if (operation.tags.includes(name)) {
          // Strip trailing dot from summary because they are annoying in the sidebar
          const summary: string = stripTrailingDot(operation.summary);
          const operationFile = path.join(operationsDir, operation.operationId + ".mdx");
          const serializedSpec = JSON.stringify(operation);

          const classNames = [`api-operation-${method}`];
          if (operation.deprecated) {
            classNames.push("api-operation-deprecated");
          }

          sidebarItems.push({
            "type": "doc",
            "id": `reference/${slug}/${operation.operationId}`,
            "className": classNames.join(" "),
            "customProps": {
              method,
              path: urlPath,
              deprecated: operation.deprecated,
              summary,
            }
          });

          const frontMatter = {
            title: summary ?? operation.operationId,
            description: operation.description ?? "",
            openapi: {
              method
            }
          };

          const frontMatterYAML = yaml.stringify(frontMatter);

          renderAPISpecToFile(operationFile, frontMatterYAML, urlPathWithBase, method, serializedSpec, serverURL, apiVersion);
        }
      }
    }

    await renderTagIndexPage(name, description, operationsDir, sidebarItems);

    sidebar.push({
      "type": "category",
      "label": name,
      "link": {
        "type": "generated-index",
        "title": name,
        "description": description,
        "slug": `/reference/${slug}`,
        "keywords": ["api-reference"]
      },
      "items": sidebarItems
    });
  }

  if (apiVersion === "v2") {
    fs.writeFileSync("sidebar.reference.json", JSON.stringify(sidebar, null, 2));
  }

  if (apiVersion === "v1") {
    const completeSidebar = {
      "apiSidebar": [
        {
          "type": "doc",
          "id": "intro"
        },
        {
          "type": "category",
          "label": "Reference (v1)",
          link: {
            type: "generated-index",
            title: "API Reference",
            slug: "/reference",
            keywords: ["api-reference"]
          },
          "items": sidebar
        }
      ]
    };
    fs.writeFileSync(path.join("versioned_sidebars", `version-${apiVersion}-sidebars.json`), JSON.stringify(completeSidebar, null, 2));
  }
}

(async () => {
  await renderAPIDocs("v1", path.join("versioned_docs", "version-v1", "reference"));
  await renderAPIDocs("v2", path.join("docs", "reference"));
})().catch(console.error);