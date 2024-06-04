import * as path from "path";
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";

(async () => {

  const spec = await fetch("https://api.mittwald.de/v2/openapi.json?withRedirects=false");
  const specJson = await spec.json();

  const specJsonUnrefed = await $RefParser.dereference(specJson, {
    dereference: {
      circular: "ignore",
    },
  }) as any;

  for (const {name, description} of specJsonUnrefed.tags) {
    const slug = name.replace(/ /g, "").toLowerCase().replace(/[^a-z0-9]/, "");
    const operationsDir = path.join("docs", "reference", "operations", slug);

    console.log(operationsDir);
    fs.mkdirSync(operationsDir, {recursive: true});

    for (const urlPath of Object.keys(specJsonUnrefed.paths)) {
      const operations = specJsonUnrefed.paths[urlPath];
      for (const method of Object.keys(operations)) {
        const operation = operations[method];
        if (operation.tags.includes(name)) {
          const summary: string = operation.summary;
          const operationFile = path.join(operationsDir, operation.operationId + ".mdx");

          const referenceComponent = `<OperationReference path="${urlPath}" method="${method}" spec={${JSON.stringify(operation)}} />`;

          fs.writeFileSync(operationFile, `---
title: ${summary}
---

import OperationReference from "@site/src/components/openapi/OperationReference";

${referenceComponent}
`);
        }
      }
    }
  }
})().catch(console.error);