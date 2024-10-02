import { GithubContentObject, GithubRelease } from "./util/github";
import * as fs from "fs/promises";
import * as path from "path";

async function getLatestCLIRelease(): Promise<GithubRelease> {
  const url = "https://api.github.com/repos/mittwald/cli/releases/latest";
  return await (await fetch(url)).json();
}

async function downloadDocsFromRelease(release: GithubRelease) {
  const url = `https://api.github.com/repos/mittwald/cli/contents/docs?ref=${release.tag_name}`;
  const tree: GithubContentObject = await (
    await fetch(url, {
      headers: { Accept: "application/vnd.github.object+json" },
    })
  ).json();

  if (tree.type !== "dir") {
    throw new Error("expected a directory");
  }

  for (const entry of tree.entries) {
    if (entry.type !== "file" || !entry.name.endsWith(".md")) {
      continue;
    }

    const content = await (await fetch(entry.url)).json();
    const buffer = Buffer.from(content.content, "base64");

    const targetPath = path.join("docs", "cli", "reference", entry.name);
    console.log(`writing ${targetPath}`);

    const sanitizedMarkdown = preprocessCommandReference(buffer);

    await fs.writeFile(targetPath, sanitizedMarkdown);
  }
}

function preprocessCommandReference(content: Buffer): string {
  let markdown = content.toString("utf-8");

  // Remove the TOC, because Docusaurus will render its own, anyway
  markdown = markdown.replace(/^\* \[`mw.*$/gm, "");
  return markdown;
}

(async () => {
  const latestRelease = await getLatestCLIRelease();
  console.log(`downloading docs from ${latestRelease.tag_name}`);

  await downloadDocsFromRelease(latestRelease);
})().catch(console.error);
