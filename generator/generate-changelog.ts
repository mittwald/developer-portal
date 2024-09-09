import { APIVersion, getOperationById } from "@site/src/openapi/specs";
import { loadSpec } from "@site/generator/util/spec";
import { execFileSync } from "child_process";
import * as path from "path";
import * as ejs from "ejs";
import * as yaml from "yaml";
import * as fs from "fs/promises";
import * as fs2 from "fs";
import { canonicalizeTitle } from "@site/generator/util/title";
import OpenAI from "openai";
import { GithubRelease } from "@site/generator/util/github";

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
  description?: string;
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

async function generateAPIChangeIntroduction(changelog: ChangelogEntry[]): Promise<string|undefined> {
  const now = new Date();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an API changelog generator. Your task is to generate an introduction to a changelog entry for the mittwald API, dated " + now.toLocaleDateString() +
          "You will be provided a JSON document with a list of changes to the mittwald API. " +
          "You will output an introductory sentence for a changelog entry, summarizing the API changes in a single sentence, formatted in markdown." +
          "Write a single sentence. Do not include a heading."
      },
      { role: "user", content: JSON.stringify(changelog) }
    ],
    max_tokens: 4096 * 2,
    temperature: 0
  });

  if (completion.choices[0].finish_reason === "length") {
    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `This document contains a machine-generated summary of the API changes for ${formattedDate}. The API changes are based on the diff between the OpenAPI schemas of the two versions.`;
  }

  return completion.choices[0].message.content;
}

async function generateAPIChangeSummary(
  changelog: ChangelogEntry[]
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You will be provided a JSON document with a list of changes to the mittwald API. " +
          "You will create a summary of the changes as a markdown formatted list. " +
          "When multiple changes affect a single API operation, summarize them into a single list item. " +
          "When an identical change affects multiple API operations, summarize them into a single list item. " +
          "When an items `level` property is 3, also include a note that a breaking change has occurred. " +
          "Form complete sentences. Do not include a heading."
      },
      { role: "user", content: JSON.stringify(changelog) }
    ],
    max_tokens: 4096 * 2,
    temperature: 0
  });

  if (completion.choices[0].finish_reason === "length") {
    return `::: warning\nThe API change contained too many changes to summarize. Please refer to the detailed list below for details.\n:::`;
  }

  return completion.choices[0].message.content;
}

async function generateAPIChangelog(apiVersion: APIVersion) {
  const spec = await loadSpec(apiVersion);
  const base = path.join("generator", "specs", `openapi-${apiVersion}.json`);
  const baseDateUnix = parseInt(execFileSync("git", ["log", "-1", "--format=%cd", "--date=unix", base], {encoding: "utf-8"}), 10);
  const baseDate = new Date(baseDateUnix * 1000);
  const head = `https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`;
  const changelog: ChangelogEntry[] = (JSON.parse(
    execFileSync("oasdiff", ["changelog", "-fjson", base, head], {
      encoding: "utf-8"
    })
  ) as ChangelogEntry[]).map((change) => {
    const operation = getOperationById(spec, change.operationId);
    return { ...change, description: operation.operation.summary };
  });
  const groupedChangelog = groupChangelogByOperation(changelog);
  const hasBreakingChanges = changelog.some(
    (change: ChangelogEntry) => change.level === 3
  );

  const today = new Date();
  const day = `${today.getDate()}`.padStart(2, "0");
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const outputFile = path.join(
    "changelog",
    `${today.getFullYear()}-${month}-${day}-api-changes-${apiVersion}.mdx`
  );

  if (fs2.existsSync(outputFile)) {
    console.log("API changelog for this date already exists; skipping");
    return;
  }

  if (changelog.length > 0) {
    const introduction = await generateAPIChangeIntroduction(changelog);
    const summary = await generateAPIChangeSummary(changelog);
    const clientChangelogs =
      apiVersion !== "v1"
        ? [
          ...(await generateClientChangelog(
            "mittwald PHP SDK",
            "api-client-php",
            baseDate
          )),
          ...(await generateClientChangelog(
            "mittwald JavaScript SDK",
            "api-client-js",
            baseDate
          ))
        ]
        : [];

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
        introduction,
      }
    );

    await fs.writeFile(outputFile, rendered, { encoding: "utf-8" });
  }

  // Write the current spec back into the repository, so that the next run can compare against it
  await fs.writeFile(base, JSON.stringify(spec));
}

async function generateClientChangelog(
  name: string,
  repo: string,
  since: Date
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
          content: `You will be provided a JSON document describing a new release of the ${name}. Write a short markdown summary of this release. Make sure to include the link to the html_url in the summary. Begin with a h3 heading. Remain factual and concise, do not be overly emotional.`
        },
        { role: "user", content: JSON.stringify(release) }
      ],
      temperature: 0.2
    });

    output.push(completion.choices[0].message.content);
  }

  return output;
}

(async () => {
  await generateAPIChangelog("v1");
  await generateAPIChangelog("v2");
})().catch(console.error);
