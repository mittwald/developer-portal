import listFilesWithExtensions from "@site/generator/util/list_files";
import fs from "fs/promises";
import OpenAI from "openai";
import path from "path";

/**
 * Translation Generator Script
 * 
 * This script finds documentation files that don't have translations in the specified target language
 * and uses OpenAI to translate them. The script supports bidirectional translation between languages.
 * 
 * - When translating from English (default source) to another language:
 *   Source files are read from 'docs/' directory and translations are saved to 'i18n/<target-lang>/'.
 * 
 * - When translating from another language to English or between non-English languages:
 *   Source files are read from 'i18n/<source-lang>/' and translations are saved to either 'docs/' 
 *   (if target is English) or 'i18n/<target-lang>/' (if target is not English).
 * 
 * Usage:
 *   ts-node generate-translations.ts [--lang|-l <target-language-code>] [--source|-s <source-language-code>]
 * 
 * Options:
 *   --lang, -l    Target language code (default: "de")
 *   --source, -s  Source language code (default: "en")
 * 
 * Examples:
 *   ts-node generate-translations.ts                 # Translates from English to German
 *   ts-node generate-translations.ts --lang fr       # Translates from English to French
 *   ts-node generate-translations.ts -l en -s de     # Translates from German to English
 *   ts-node generate-translations.ts -l fr -s de     # Translates from German to French
 */

const openai = new OpenAI();

async function findFilesWithoutTranslations(sourceLang: string, targetLang: string) {
  // Determine source directory based on source language
  let sourceDir: string;

  if (sourceLang === "en") {
    sourceDir = "docs";
  } else {
    sourceDir = `i18n/${sourceLang}/docusaurus-plugin-content-docs/current`;
  }

  const files = await listFilesWithExtensions(sourceDir, [".md", ".mdx"]);
  const filesWithoutPrefix = files.map((file) => file.replace(`${sourceDir}/`, ""));
  const filesWithoutReference = filesWithoutPrefix.filter(
    (file) =>
      !file.startsWith("reference/") && !file.startsWith("cli/reference/"),
  );
  const filesWithoutExamples = filesWithoutReference.filter(
    (f) => !f.includes("/examples/"),
  );

  const filesWithoutTranslation: string[] = [];
  for (const file of filesWithoutExamples) {
    // Determine target file path based on target language
    let targetFilePath: string;
    if (targetLang === "en") {
      targetFilePath = `docs/${file}`;
    } else {
      targetFilePath = `i18n/${targetLang}/docusaurus-plugin-content-docs/current/${file}`;
    }

    if (!(await fileExists(targetFilePath))) {
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

/**
 * Ensures that a directory exists, creating it and its parents if necessary
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
    if (error instanceof Error && (error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}

async function translateFile(file: string, sourceLang: string, targetLang: string): Promise<void> {
  // Determine source file path based on source language
  let sourceFilePath: string;
  if (sourceLang === "en") {
    sourceFilePath = path.join("docs", file);
  } else {
    sourceFilePath = path.join(`i18n/${sourceLang}/docusaurus-plugin-content-docs/current`, file);
  }

  const content = await fs.readFile(sourceFilePath, {
    encoding: "utf-8",
  });

  // Determine language-specific instructions
  let languageInstructions = "";
  if (targetLang === "de") {
    languageInstructions = "Address the user informally and use the 'du' form.";
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          `Your task is to translate a markdown or MDX file in the mittwald developer portal from ${sourceLang} to ${targetLang}. ` +
          "Respond with the translated file content, without any additional text or explanation.\n\n" +
          languageInstructions + " " +
          "Keep established terms and phrases in English, for example but not limited to 'deployment', 'API', 'Infrastructure as code', (container) 'image'. " +
          "Do not modify code blocks at all.",
      },
      { role: "user", content },
    ],
    max_tokens: 4096 * 2,
    temperature: 0,
  });

  const translatedContent = completion.choices[0].message.content;

  // Determine output file path based on target language
  let outputFile: string;
  if (targetLang === "en") {
    outputFile = path.join("docs", file);
  } else {
    outputFile = path.join(`i18n/${targetLang}/docusaurus-plugin-content-docs/current`, file);
  }

  // Ensure the directory exists
  const outputDir = path.dirname(outputFile);
  await ensureDirectoryExists(outputDir);

  console.log(`Writing ${targetLang} translation to ${outputFile}`);
  await fs.writeFile(outputFile, translatedContent);
}

async function main() {
  // Default to German if no target language is specified
  let targetLang = "de";
  // Default to English if no source language is specified
  let sourceLang = "en";

  // Parse command line arguments
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lang" || args[i] === "-l") {
      if (i + 1 < args.length) {
        targetLang = args[i + 1];
      }
    } else if (args[i] === "--source" || args[i] === "-s") {
      if (i + 1 < args.length) {
        sourceLang = args[i + 1];
      }
    }
  }

  console.log(`Translating from ${sourceLang} to ${targetLang}`);
  const files = await findFilesWithoutTranslations(sourceLang, targetLang);
  console.log(`Found ${files.length} files without ${targetLang} translations`);

  for (const file of files) {
    await translateFile(file, sourceLang, targetLang);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
