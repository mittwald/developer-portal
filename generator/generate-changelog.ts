import { APIVersion, getOperationById } from "@site/src/openapi/specs";
import { loadSpec } from "@site/generator/util/spec";
import { execFileSync } from "child_process";
import * as path from "path";
import * as ejs from "ejs";
import * as yaml from "yaml";
import * as fs from "fs/promises";
import { canonicalizeTitle } from "@site/generator/util/title";
import OpenAI from "openai";

const openai = new OpenAI();

type ChangelogEntry = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
  operation: string;
  operationId: string;
  path: string;
  source: string;
  section: string;
};

type GithubRelease = {
  published_at: string;
  html_url: string;
  body: string;
  name: string;
};

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

async function generateAPIChangeSummary(
  changelog: ChangelogEntry[],
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You will be provided a JSON document with a list of changes to the mittwald API. " +
          "You will create a summary of the changes as a markdown formatted list. " +
          "When multiple changes affect a single API operation, summarize them into a single list item. " +
          "When an items `level` property is 3, also include a note that a breaking change has occurred. " +
          "Form complete sentences. Do not include a heading.",
      },
      { role: "user", content: JSON.stringify(changelog) },
    ],
    temperature: 0,
  });

  return completion.choices[0].message.content;
}

async function generateAPIChangelog(apiVersion: APIVersion) {
  const spec = await loadSpec(apiVersion);
  const base = path.join("generator", "specs", `openapi-${apiVersion}.json`);
  const baseDate = (await fs.stat(base)).mtime;
  const head = `https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`;
  const changelog: ChangelogEntry[] = JSON.parse(
    execFileSync("oasdiff", ["changelog", "-fjson", base, head], {
      encoding: "utf-8",
    }),
  );
  const groupedChangelog = groupChangelogByOperation(changelog);
  const hasBreakingChanges = changelog.some(
    (change: ChangelogEntry) => change.level === 3,
  );

  if (changelog.length > 0) {
    const today = new Date();
    const day = `${today.getDate()}`.padStart(2, "0");
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const outputFile = path.join(
      "changelog",
      `${today.getFullYear()}-${month}-${day}-api-changes-${apiVersion}.mdx`,
    );

    const summary = await generateAPIChangeSummary(changelog);

    const clientChangelogs = [
      ...(await generateClientChangelog(
        "mittwald PHP SDK",
        "api-client-php",
        baseDate,
      )),
      ...(await generateClientChangelog(
        "mittwald JavaScript SDK",
        "api-client-js",
        baseDate,
      )),
    ];

    const rendered = await ejs.renderFile(
      path.join("generator", "templates", "changelog.mdx.ejs"),
      {
        yaml,
        today,
        apiVersion,
        changelog,
        groupedChangelog,
        hasBreakingChanges,
        spec,
        getOperationById,
        canonicalizeTitle,
        summary,
        clientChangelogs,
      },
    );

    await fs.writeFile(outputFile, rendered, { encoding: "utf-8" });
  }

  // Write the current spec back into the repository, so that the next run can compare against it
  await fs.writeFile(base, JSON.stringify(spec));
}

async function generateClientChangelog(
  name: string,
  repo: string,
  since: Date,
): Promise<string[]> {
  const url = `https://api.github.com/repos/mittwald/${repo}/releases`;
  const releases: GithubRelease[] = await (await fetch(url)).json();
  const output = [];

  for (const release of releases) {
    const date = new Date(release.published_at);
    if (date < since) {
      continue;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You will be provided a JSON document describing a new release of the ${name}. Write a short markdown summary of this release. Make sure to include the link to the html_url in the summary. Begin with a h3 heading. Remain factual and concise, do not be overly emotional.`,
        },
        { role: "user", content: JSON.stringify(release) },
      ],
      temperature: 0.2,
    });

    output.push(completion.choices[0].message.content);
  }

  return output;
}

(async () => {
  await generateAPIChangelog("v1");
  await generateAPIChangelog("v2");
})().catch(console.error);
