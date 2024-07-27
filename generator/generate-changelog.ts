import { APIVersion, getOperationById } from "@site/src/openapi/specs";
import { loadSpec } from "@site/generator/util/spec";
import { execFileSync } from "child_process";
import * as path from "path";
import * as ejs from "ejs";
import * as yaml from "yaml";
import * as fs from "fs/promises";
import { canonicalizeTitle } from "@site/generator/util/title";

type ChangelogEntry = {
  "id": string,
  "text": string,
  "level": 1|2|3,
  "operation": string,
  "operationId": string,
  "path": string,
  "source": string,
  "section": string
}

/**
 * changelog is a list of changes, with an operationId
 * group the changelog by operationId
 *
 * @param changelog
 */
function groupChangelogByOperation(changelog: ChangelogEntry[]) {
  const grouped = new Map<string, ChangelogEntry[]>();
  for (const change of changelog) {
    const operationId = change.operationId;
    if (!grouped.has(operationId)) {
      grouped.set(operationId, []);
    }
    grouped.get(operationId).push(change);
  }
  return grouped;
}

async function generateAPIChangelog(apiVersion: APIVersion) {
  const spec = await loadSpec(apiVersion);
  const base = path.join("generator", "specs", `openapi-${apiVersion}.json`);
  const head = `https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`;
  const changelog: ChangelogEntry[] = JSON.parse(execFileSync("oasdiff", ["changelog", "-fjson", base, head], { encoding: "utf-8" }));
  const groupedChangelog = groupChangelogByOperation(changelog);
  const hasBreakingChanges = changelog.some((change: ChangelogEntry) => change.level === 3);

  if (changelog.length > 0) {
    const today = new Date();
    const outputFile = path.join("changelog", `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-api-changes-${apiVersion}.mdx`);

    const rendered = await ejs.renderFile(path.join("generator", "templates", "changelog.mdx.ejs"), {
      yaml,
      today,
      apiVersion,
      changelog,
      groupedChangelog,
      hasBreakingChanges,
      spec,
      getOperationById,
      canonicalizeTitle,
    });

    await fs.writeFile(outputFile, rendered, { encoding: "utf-8" });
  }
}

(async () => {
  await generateAPIChangelog("v1");
  await generateAPIChangelog("v2");
})().catch(console.error);