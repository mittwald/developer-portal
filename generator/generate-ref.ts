import * as path from "path";
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenAPIV3 } from "openapi-types";
import * as url from "url";

async function renderAPIDocs (apiVersion: "v1" | "v2", outputPath: string){
  const sidebar = [];

  const spec = await fetch(`https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`);
  const specJson = await spec.json();

  const specJsonUnrefed: OpenAPIV3.Document = await $RefParser.dereference(specJson, {
    dereference: {
      circular: "ignore",
    },
  }) as any;

  let basePath = "";

  const serverURL = specJsonUnrefed.servers?.[0].url ?? `https://api.mittwald.de/${apiVersion}`;
  if (serverURL) {
    const parsedServerURL = url.parse(serverURL);
    basePath = parsedServerURL.pathname;
  }

  for (const {name, description} of specJsonUnrefed.tags) {
    const slug = name.replace(/ /g, "").toLowerCase().replace(/[^a-z0-9]/, "");
    const operationsDir = path.join(outputPath, slug);
    const sidebarItems = [];

    console.log(operationsDir);
    fs.mkdirSync(operationsDir, {recursive: true});

    for (const urlPath of Object.keys(specJsonUnrefed.paths)) {
      const operations = specJsonUnrefed.paths[urlPath];
      const urlPathWithBase = basePath + urlPath.replace(new RegExp(`${basePath}/`), "/");
      for (const method of Object.keys(operations)) {
        const operation = operations[method];
        if (operation.tags.includes(name)) {
          const summary: string = operation.summary?.replace(/\.$/, "");
          const operationFile = path.join(operationsDir, operation.operationId + ".mdx");
          const serializedSpec = JSON.stringify(operation);

          sidebarItems.push({
            "type": "doc",
            "id": `reference/${slug}/${operation.operationId}`,
            "className": "api-operation-" + method
          })

          // language=text
          fs.writeFileSync(operationFile, `---
title: ${summary ?? operation.operationId}
---

import {OperationMetadata, OperationRequest, OperationResponses} from "@site/src/components/openapi/OperationReference";
import {OperationUsage} from "@site/src/components/openapi/OperationUsage";

<OperationMetadata path="${urlPathWithBase}" method="${method}" spec={${serializedSpec}} />

## Request

<OperationRequest spec={${serializedSpec}} />

## Responses

<OperationResponses spec={${serializedSpec}} />

## Usage examples

<OperationUsage method="${method}" url="${urlPathWithBase}" spec={${serializedSpec}} baseURL="${serverURL}" withJavascript={${apiVersion !== "v1"}} withPHP={${apiVersion !== "v1"}} />

`);
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