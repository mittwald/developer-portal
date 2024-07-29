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

type GithubRelease = {
  published_at: string;
  html_url: string;
  body: string;
  name: string;
}

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

  // Write the current spec back into the repository, so that the next run can compare against it
  await fs.writeFile(base, JSON.stringify(spec));
}

async function generateClientChangelog(name: string, repo: string) {
  const url = `https://api.github.com/repos/mittwald/${repo}/releases`;
  const releases: GithubRelease[] = await (await fetch(url)).json();

  for (const release of releases) {
    const date = new Date(release.published_at);
    const outputFile = path.join("changelog", `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${repo}-${release.name}.mdx`);
    const rendered = await ejs.renderFile(path.join("generator", "templates", "client-changelog.mdx.ejs"), {
      release,
      name,
      repo,
      yaml,
    });

    await fs.writeFile(outputFile, rendered, { encoding: "utf-8" });
  }
}

(async () => {
  await generateAPIChangelog("v1");
  await generateAPIChangelog("v2");

  // disabled for now
  //await generateClientChangelog("mittwald PHP SDK", "api-client-php");
  //await generateClientChangelog("mittwald JavaScript SDK", "api-client-js");
})().catch(console.error);