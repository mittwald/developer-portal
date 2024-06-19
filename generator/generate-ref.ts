import * as path from "path";
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenAPIV3 } from "openapi-types";
import * as url from "url";
import * as yaml from "yaml";

type APIVersion = `v${number}`

async function loadAndDereferenceSpec(apiVersion: APIVersion): Promise<OpenAPIV3.Document> {
  const spec = await fetch(`https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`);
  const specJson = await spec.json();

  return await $RefParser.dereference(specJson, {
    dereference: {
      circular: "ignore",
    },
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

function renderAPISpecToFile(operationFile: string, frontMatterYAML: any, urlPathWithBase: string, method: string, serializedSpec: string, serverURL: string, apiVersion: APIVersion) {
  const withSDKExamples = apiVersion !== "v1";

  // Yes, this is JavaScript that renders more JavaScript (or mdx, to be precise).
  // Yes, this is a bit weird and opens up a whole can of worms. Oh, well.

  // language=text
  fs.writeFileSync(operationFile, `---
${frontMatterYAML}
---

import {OperationMetadata, OperationRequest, OperationResponses} from "@site/src/components/openapi/OperationReference";
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

function slugFromTagName(tagName: string): string {
  return tagName.replace(/ /g, "").toLowerCase().replace(/[^a-z0-9]/, "");
}

function stripTrailingDot(str: string|undefined): string|undefined {
  return str?.replace(/\.$/, "");
}

async function renderAPIDocs (apiVersion: APIVersion, outputPath: string){
  const sidebar = [];
  const spec = await loadAndDereferenceSpec(apiVersion);
  const [serverURL, basePath] = determineServerURLAndBasePath(apiVersion, spec);

  for (const {name, description} of spec.tags) {
    const slug = slugFromTagName(name);
    const operationsDir = path.join(outputPath, slug);
    const sidebarItems = [];

    fs.mkdirSync(operationsDir, {recursive: true});

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

          sidebarItems.push({
            "type": "doc",
            "id": `reference/${slug}/${operation.operationId}`,
            "className": "api-operation-" + method
          })

          const frontMatter = {
            title: summary ?? operation.operationId,
            description: operation.description ?? "",
          }

          const frontMatterYAML = yaml.stringify(frontMatter);

          renderAPISpecToFile(operationFile, frontMatterYAML, urlPathWithBase, method, serializedSpec, serverURL, apiVersion);
        }
      }
    }

    sidebar.push({
      "type": "category",
      "label": name,
      "link": {
        "type": "generated-index",
        "title": name,
        "description": description,
        "slug": `/category/reference/${slug}`,
        "keywords": ["api-reference"],
      },
      "items": sidebarItems
    })
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
            slug: "/category/reference",
            keywords: ["api-reference"]
          },
          "items": sidebar
        }
      ]
    }
    fs.writeFileSync(path.join("versioned_sidebars", `version-${apiVersion}-sidebars.json`), JSON.stringify(completeSidebar, null, 2));
  }
}

(async () => {
  await renderAPIDocs("v1", path.join("versioned_docs", "version-v1", "reference"));
  await renderAPIDocs("v2", path.join("docs", "reference"));
})().catch(console.error);