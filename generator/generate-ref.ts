import * as path from "path";
import * as fs from "fs";
import { OpenAPIV3 } from "openapi-types";
import * as url from "url";
import * as yaml from "yaml";
import compareOperation from "@site/src/openapi/compareOperation";
import * as ejs from "ejs";
import { dereferenceSpec, loadSpec } from "@site/generator/util/spec";

type APIVersion = `v${number}`


function determineServerURLAndBasePath(apiVersion: APIVersion, spec: OpenAPIV3.Document): [string, string] {
  let basePath = "";

  const serverURL = spec.servers?.[0].url ?? `https://api.mittwald.de/${apiVersion}`;
  if (serverURL) {
    const parsedServerURL = url.parse(serverURL);
    basePath = parsedServerURL.pathname;
  }

  return [serverURL, basePath];
}

function loadDescriptionOverride(apiVersion: APIVersion, operationId: string, part: "pre"|"post"): string | undefined {
  const filename = part === "pre" ? "description.md" : "description-post.md";
  const descriptionOverridePath = path.join("generator", "overlays", apiVersion, operationId, filename);
  if (fs.existsSync(descriptionOverridePath)) {
    return fs.readFileSync(descriptionOverridePath, { encoding: "utf-8" });
  }
  if (fs.existsSync(descriptionOverridePath + "x")) {
    return fs.readFileSync(descriptionOverridePath + "x", { encoding: "utf-8" });
  }
  return undefined;
}

function loadCodeExample(apiVersion: APIVersion, operationId: string, language: string): string | undefined {
  const codeExamplePath = path.join("generator", "overlays", apiVersion, operationId, `example-${language}.md`);
  if (fs.existsSync(codeExamplePath)) {
    return fs.readFileSync(codeExamplePath, { encoding: "utf-8" });
  }
  return undefined;
}

function substituteInTitle(title: string|undefined): string|undefined {
  if (!title) {
    return title;
  }

  const replacements: [RegExp, string][] = [
    [/['`]([^`]+)['`]/g, "$1"],
    [/AppInstallation(s)?/, "app installation$1"],
    [/AppVersion(s)?/, "app version$1"],
    [/App(s)?/, "app$1"],
    [/DatabaseUser(s)?/, "database user$1"],
    [/MySQL-?Database(s)?/i, "MySQL database$1"],
    [/MySQLUser(s)?/i, "MySQL user$1"],
    [/MySQLVersion(s)?/i, "MySQL version$1"],
    [/RedisDatabase(s)?/i, "Redis database$1"],
    [/RedisVersion(s)?/i, "Redis database$1"],
    [/SystemSoftwareVersion(s)?/, "system software version$1"],
    [/SystemSoftware(s)?/, "system software$1"],
    [/ProjectBackupSchedule(s)?/, "project backup schedule$1"],
    [/BackupSchedule(s)?/, "backup schedule$1"],
    [/ProjectBackupExport(s)?/, "project backup export$1"],
    [/ProjectBackup(s)?/, "project backup$1"],
    [/CronjobExecution(s)?/, "cronjob execution$1"],
    [/Cronjob(s)?/, "cronjob$1"],
    [/CustomerInvite(s)?/, "customer invite$1"],
    [/CustomerMembership(s)?/, "customer membership$1"],
    [/DNSZone(s)?/, "DNS Zone$1"],
    [/DeliveryBox(es)?/, "delivery box$1"],
    [/MailAddress(es)?/, "mail address$1"],
    [/Email-?Address(es)?/, "mail address$1"],
    [/ExtensionInstance(s)?/, "extension instance$1"],
    [/Contributor(s)?/, "contributor$1"],
    [/SSHUser(s)?/, "SSH user$1"],
    [/SFTPUser(s)?/, "SFTP user$1"],
  ]

  for (const [pattern, replacement] of replacements) {
    title = title.replace(pattern, replacement);
  }

  return title;
}

async function renderAPISpecToFile(
  operationFile: string,
  urlPathWithBase: string,
  method: string,
  spec: OpenAPIV3.OperationObject,
  serverURL: string,
  apiVersion: APIVersion,
) {
  const withSDKExamples = apiVersion !== "v1";
  const summary: string = substituteInTitle(stripTrailingDot(spec.summary));

  const descriptionOverridePre = loadDescriptionOverride(apiVersion, spec.operationId, "pre");
  const descriptionOverridePost = loadDescriptionOverride(apiVersion, spec.operationId, "post");

  const exampleOverrides = [
    ["curl", "cURL", loadCodeExample(apiVersion, spec.operationId, "curl")],
    ["javascript", "JavaScript SDK", loadCodeExample(apiVersion, spec.operationId, "javascript")],
    ["php", "PHP SDK", loadCodeExample(apiVersion, spec.operationId, "php")],
    ["cli", "mw CLI", loadCodeExample(apiVersion, spec.operationId, "cli")],
  ].filter(([,, i]) => i !== undefined).map(([key, label, content]) => `<TabItem key="${key}" value="${key}" label="${label}">\n\n${content}\n\n</TabItem>`);

  const rendered = await ejs.renderFile("generator/templates/operation.mdx.ejs", {
    yaml,
    summary,
    descriptionOverridePre,
    descriptionOverridePost,
    urlPathWithBase,
    method,
    spec,
    withSDKExamples,
    exampleOverrides,
    serverURL,
  });

  fs.writeFileSync(operationFile, rendered, { encoding: "utf-8" });
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

async function renderTagIndexPage(apiVersion: APIVersion, name: string, description: string, outputPath: string, sidebarItems: any[]): Promise<void> {
  const indexFile = path.join(outputPath, "index.mdx");

  const overrideFile = path.join("generator", "overlays", apiVersion, slugFromTagName(name) + ".mdx");
  if (fs.existsSync(overrideFile)) {
    fs.copyFileSync(overrideFile, indexFile);
    return;
  }

  const content = await ejs.renderFile("generator/templates/index.mdx.ejs", {
    yaml,
    name,
    description,
    apiVersion,
  });

  fs.writeFileSync(indexFile, content, { encoding: "utf-8" });
}

async function renderAPIDocs(apiVersion: APIVersion, outputPath: string) {
  const sidebar = [];
  const originalSpec = await loadSpec(apiVersion);
  const spec = await dereferenceSpec(originalSpec);
  const [serverURL, basePath] = determineServerURLAndBasePath(apiVersion, spec);

  exportSpecToSource(originalSpec, apiVersion);

  const tags = (spec.tags ?? []).sort((a, b) => a.name.localeCompare(b.name));

  for (const { name, description } of tags) {
    const slug = slugFromTagName(name);
    const operationsDir = path.join(outputPath, slug);

    let sidebarItems = [];

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

          await renderAPISpecToFile(operationFile, urlPathWithBase, method, operation, serverURL, apiVersion);
        }
      }
    }

    sidebarItems = sidebarItems.sort((a, b) => compareOperation(a.customProps, b.customProps));

    await renderTagIndexPage(apiVersion, name, description, operationsDir, sidebarItems);

    sidebar.push({
      type: "category",
      label: name,
      link: {
        type: "doc",
        id: `reference/${slug}/index`,
      },
      items: sidebarItems
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