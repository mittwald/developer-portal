import * as path from "path";
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenAPIV3 } from "openapi-types";

(async () => {
  const sidebar = [];
  const apiVersion = "v2" as const;

  const spec = await fetch(`https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`);
  const specJson = await spec.json();

  const specJsonUnrefed: OpenAPIV3.Document = await $RefParser.dereference(specJson, {
    dereference: {
      circular: "ignore",
    },
  }) as any;

  for (const {name, description} of specJsonUnrefed.tags) {
    const slug = name.replace(/ /g, "").toLowerCase().replace(/[^a-z0-9]/, "");
    const operationsDir = path.join("docs", "reference", slug);
    const sidebarItems = [];

    console.log(operationsDir);
    fs.mkdirSync(operationsDir, {recursive: true});

    for (const urlPath of Object.keys(specJsonUnrefed.paths)) {
      const operations = specJsonUnrefed.paths[urlPath];
      for (const method of Object.keys(operations)) {
        const operation = operations[method];
        if (operation.tags.includes(name)) {
          const summary: string = operation.summary.replace(/\.$/, "");
          const operationFile = path.join(operationsDir, operation.operationId + ".mdx");
          const serializedSpec = JSON.stringify(operation);

          sidebarItems.push({
            "type": "doc",
            "id": `reference/${slug}/${operation.operationId}`,
            "className": "api-operation-" + method
          })

          // language=text
          fs.writeFileSync(operationFile, `---
title: ${summary}
---

import {OperationMetadata, OperationRequest, OperationResponses} from "@site/src/components/openapi/OperationReference";
import {OperationUsage} from "@site/src/components/openapi/OperationUsage";

<OperationMetadata path="${urlPath}" method="${method}" spec={${serializedSpec}} />

## Request

<OperationRequest spec={${serializedSpec}} />

## Responses

<OperationResponses spec={${serializedSpec}} />

## Usage examples

<OperationUsage method="${method}" url="${urlPath}" spec={${serializedSpec}} baseURL="https://api.mittwald.de/v2/" />

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

  fs.writeFileSync("sidebar.reference.json", JSON.stringify(sidebar, null, 2));
})().catch(console.error);