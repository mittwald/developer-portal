import listFilesWithExtensions from "@site/generator/util/list_files";
import fs from "fs/promises";
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI();

async function findFilesWithoutTranslations() {
  const files = await listFilesWithExtensions("docs", [".md", ".mdx"]);
  const filesWithoutPrefix = files.map((file) => file.replace("docs/", ""));
  const filesWithoutReference = filesWithoutPrefix.filter(
    (file) =>
      !file.startsWith("reference/") && !file.startsWith("cli/reference/"),
  );
  const filesWithoutExamples = filesWithoutReference.filter(
    (f) => !f.includes("/examples/"),
  );

  const filesWithoutTranslation: string[] = [];
  for (const file of filesWithoutExamples) {
    const fileInTranslations =
      "i18n/de/docusaurus-plugin-content-docs/current/" + file;
    if (!(await fileExists(fileInTranslations))) {
      filesWithoutTranslation.push(file);
    }
  }

  return filesWithoutTranslation;
}

async function fileExists(filename: string): Promise<boolean> {
  try {
    await fs.access(filename);
    return true;
  } catch (error) {
    if (error instanceof Error && (error as any).code === "ENOENT") {
      return false; // File does not exist
    }
    throw error; // Some other error occurred
  }
}

async function translateFile(file: string): Promise<void> {
  const content = await fs.readFile(path.join("docs", file), {
    encoding: "utf-8",
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Your task is to translate a markdown or MDX file in the mittwald developer portal from English to German. " +
          "Respond with the translated file content, without any additional text or explanation.\n\n" +
          "Address the user informally and use the 'du' form. " +
          "Keep established terms and phrases in English, for example but not limited to 'deployment', 'API', 'Infrastructure as code'. " +
          "Do not modify code blocks at all.",
      },
      { role: "user", content },
    ],
    max_tokens: 4096 * 2,
    temperature: 0,
  });

  const translatedContent = completion.choices[0].message.content;
  const outputFile = path.join(
    "i18n/de/docusaurus-plugin-content-docs/current",
    file,
  );

  console.log("writing to ", outputFile);
  await fs.writeFile(outputFile, translatedContent);
}

async function main() {
  const files = await findFilesWithoutTranslations();

  for (const file of files) {
    await translateFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
