import { OpenAPIV3 } from "openapi-types";
import OpenAI from "openai";
import jsonpath from "jsonpath";
import { writeFile } from "fs/promises";
import * as yaml from "yaml";
import { APIVersion } from "@site/src/openapi/specs";
import { OverlayAction, OverlaySpec } from "@site/generator/util/overlay";
import {
  AI_OVERLAY_NAME,
  loadOverlay,
  overlayPath,
} from "@site/generator/util/spec";
import HttpMethods = OpenAPIV3.HttpMethods;

/**
 * Operation fields that are generated into the AI overlay. A field is only
 * generated when it is missing from the overlay, so existing (and manually
 * corrected) values are never overwritten.
 */
const GENERATED_FIELDS = ["summary", "description"] as const;

type GeneratedField = (typeof GENERATED_FIELDS)[number];
type GeneratedDocs = Record<GeneratedField, string>;

const BASE_URL =
  process.env.OPENAI_BASE_URL ?? "https://llm.aihosting.mittwald.de/v1";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const CONCURRENCY = parseInt(process.env.OPENAI_CONCURRENCY ?? "", 10) || 8;

/** Persist intermediate results after this many generated operations */
const SAVE_INTERVAL = 10;

const SYSTEM_PROMPT = `
You write the reference documentation for the public REST API of mittwald, a German web hosting provider.
You are given a single operation of an OpenAPI document as JSON, together with its HTTP method, URL path and tags.
Write a summary and a description for this operation.

Rules for the summary:
- It is used as the page title and as the sidebar label, so keep it short: at most 60 characters.
- Use a verb phrase in imperative mood and sentence case, like "List apps" or "Create a MySQL database".
- No trailing period, no Markdown, no backticks, no HTML.
- Do not mention the HTTP method or the URL path.
- If the input summary is longer than that, shorten it and move any additional information into the description.

Rules for the description:
- One to three sentences of Markdown prose, explaining what the operation does and, when it is not self-evident, when to use it.
- Do not repeat the summary verbatim, and do not start with filler like "This endpoint" or "This operation".
- Do not enumerate parameters, request body fields or response codes; those are documented separately.
- Do not use headings or lists, and only use links that appear in the input.
- If the operation is deprecated, say so in the first sentence and name the replacement if the input mentions one.
- Address the reader as "you".

Write in English. Base yourself strictly on the input: never invent behaviour, limits, field names or resources
that the input does not mention. Prefer being vague over being wrong.
`.trim();

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "Short title of the operation, at most 60 characters",
    },
    description: {
      type: "string",
      description: "One to three sentences of Markdown prose",
    },
  },
  required: [...GENERATED_FIELDS],
  additionalProperties: false,
};

interface OperationRef {
  /** JSONPath expression addressing this operation, used as overlay target */
  target: string;
  urlPath: string;
  method: HttpMethods;
  operation: OpenAPIV3.OperationObject;
}

/**
 * Whether description generation should run. Generating requires an OpenAI API
 * key; without one, the generator keeps working with the overlay as it is
 * checked into the repository.
 */
export function aiGenerationEnabled(): boolean {
  if (process.argv.includes("--no-ai")) {
    return false;
  }
  if (!process.env.OPENAI_API_KEY) {
    console.log(
      "OPENAI_API_KEY is not set; skipping generation of operation summaries and descriptions",
    );
    return false;
  }
  return true;
}

/**
 * Generates summaries and descriptions for all operations of the given spec
 * that do not have them in the AI overlay yet, and persists them back into the
 * overlay file.
 */
export async function generateOperationDocs(
  apiVersion: APIVersion,
  spec: OpenAPIV3.Document,
): Promise<void> {
  const overlay = (await loadOverlay(apiVersion, AI_OVERLAY_NAME)) ?? {
    overlay: "1.0.0",
    info: {
      title: "AI-generated operation summaries and descriptions",
      version: "1.0.0",
    },
    actions: [],
  };

  const operations = collectOperations(spec);
  const operationTargets = new Set(operations.map((o) => o.target));

  // Drop entries for operations that no longer exist in the spec
  const staleActions = overlay.actions.filter(
    (a) => !operationTargets.has(a.target),
  );
  if (staleActions.length > 0) {
    console.log(`removing ${staleActions.length} stale overlay entries`);
    overlay.actions = overlay.actions.filter((a) =>
      operationTargets.has(a.target),
    );
  }

  const actionsByTarget = new Map<string, OverlayAction>(
    overlay.actions.map((a) => [a.target, a]),
  );
  const manualOverrides = await collectManualOverrides(apiVersion, spec);

  const pending = operations
    .map((operation) => ({
      operation,
      missing: GENERATED_FIELDS.filter(
        (field) =>
          !actionsByTarget.get(operation.target)?.update?.[field] &&
          !manualOverrides.get(operation.target)?.has(field),
      ),
    }))
    .filter(({ missing }) => missing.length > 0);

  if (pending.length === 0) {
    console.log("all operation summaries and descriptions are up to date");
    if (staleActions.length > 0) {
      await writeOverlay(apiVersion, overlay);
    }
    return;
  }

  console.log(
    `generating summaries and descriptions for ${pending.length} of ${operations.length} operations using ${MODEL} at ${BASE_URL}`,
  );

  const openai = new OpenAI({ baseURL: BASE_URL });
  const tagDescriptions = new Map(
    (spec.tags ?? []).map((tag) => [tag.name, tag.description]),
  );

  let completed = 0;
  let failed = 0;
  let save: Promise<void> = Promise.resolve();

  await mapWithConcurrency(
    pending,
    CONCURRENCY,
    async ({ operation, missing }) => {
      let docs: GeneratedDocs;
      try {
        docs = await generateDocsForOperation(
          openai,
          operation,
          tagDescriptions,
        );
      } catch (err) {
        // A single failing operation should not abort the whole run; the missing
        // entries are simply picked up again by the next run.
        console.error(`failed to generate docs for ${operation.target}:`, err);
        failed++;
        return;
      }

      let action = actionsByTarget.get(operation.target);
      if (!action) {
        action = { target: operation.target, update: {} };
        actionsByTarget.set(operation.target, action);
        overlay.actions.push(action);
      }

      for (const field of missing) {
        action.update[field] = docs[field];
      }

      completed++;
      if (completed % SAVE_INTERVAL === 0) {
        console.log(`generated ${completed}/${pending.length} operations`);
        save = save.then(() => writeOverlay(apiVersion, overlay));
      }
    },
  );

  // A failed intermediate save must not keep us from writing the final result
  await save.catch((err) =>
    console.error("failed to persist intermediate results:", err),
  );
  await writeOverlay(apiVersion, overlay);

  console.log(
    `generated documentation for ${completed} operations` +
      (failed > 0 ? ` (${failed} failed)` : ""),
  );
}

async function generateDocsForOperation(
  openai: OpenAI,
  operation: OperationRef,
  tagDescriptions: Map<string, string | undefined>,
): Promise<GeneratedDocs> {
  const input = {
    method: operation.method.toUpperCase(),
    path: operation.urlPath,
    tags: (operation.operation.tags ?? []).map((name) => ({
      name,
      description: tagDescriptions.get(name),
    })),
    operation: operation.operation,
  };

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(input) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "operation_documentation",
        strict: true,
        schema: RESPONSE_SCHEMA,
      },
    },
    temperature: 0.2,
  });

  const message = completion.choices[0].message;
  if (message.refusal) {
    throw new Error(`model refused to generate docs: ${message.refusal}`);
  }
  if (!message.content) {
    throw new Error(
      `model returned no content (finish reason: ${completion.choices[0].finish_reason})`,
    );
  }

  const docs = JSON.parse(message.content) as GeneratedDocs;
  return {
    summary: canonicalizeSummary(docs.summary, operation),
    // Descriptions are stored as literal block scalars in the overlay file, so
    // that they stay readable and editable; the `yaml` package picks that style
    // for strings with a trailing newline.
    description: docs.description.trim() + "\n",
  };
}

function canonicalizeSummary(summary: string, operation: OperationRef): string {
  const canonicalized = summary.trim().replace(/\.$/, "");
  if (canonicalized.length > 80) {
    console.warn(
      `summary for ${operation.target} is unusually long: ${canonicalized}`,
    );
  }
  return canonicalized;
}

function collectOperations(spec: OpenAPIV3.Document): OperationRef[] {
  const operations: OperationRef[] = [];

  for (const urlPath of Object.keys(spec.paths ?? {})) {
    const pathItem = spec.paths[urlPath];
    if (!pathItem) {
      continue;
    }

    // Single quotes would break the JSONPath expressions used as overlay targets
    if (urlPath.includes("'")) {
      console.warn(`skipping path ${urlPath}, because it contains a quote`);
      continue;
    }

    for (const method of Object.values(HttpMethods)) {
      const operation = pathItem[method];
      if (!operation?.operationId) {
        continue;
      }

      operations.push({
        target: `$.paths['${urlPath}'].${method}`,
        urlPath,
        method,
        operation,
      });
    }
  }

  return operations;
}

/**
 * Determines which operation fields are already overridden by hand in the
 * manually maintained overlay. Those take precedence over the AI overlay
 * anyway, so there is no point in generating them.
 */
async function collectManualOverrides(
  apiVersion: APIVersion,
  spec: OpenAPIV3.Document,
): Promise<Map<string, Set<GeneratedField>>> {
  const overrides = new Map<string, Set<GeneratedField>>();
  const overlay = await loadOverlay(apiVersion, "overlay");

  for (const action of overlay?.actions ?? []) {
    const fields = GENERATED_FIELDS.filter(
      (field) => action.update?.[field] !== undefined,
    );
    if (action.remove || fields.length === 0) {
      continue;
    }

    // Targets may use filter expressions, so resolve them against the spec
    // instead of comparing the expressions themselves.
    for (const resolved of jsonpath.paths(spec, action.target)) {
      // ["$", "paths", "/v2/apps", "get"]
      if (resolved.length !== 4 || resolved[1] !== "paths") {
        continue;
      }

      const target = `$.paths['${resolved[2]}'].${resolved[3]}`;
      const existing = overrides.get(target) ?? new Set<GeneratedField>();
      fields.forEach((field) => existing.add(field));
      overrides.set(target, existing);
    }
  }

  return overrides;
}

async function writeOverlay(
  apiVersion: APIVersion,
  overlay: OverlaySpec,
): Promise<void> {
  const actions = [...overlay.actions].sort((a, b) =>
    a.target.localeCompare(b.target),
  );
  const content = yaml.stringify({ ...overlay, actions }, { lineWidth: 0 });

  await writeFile(overlayPath(apiVersion, AI_OVERLAY_NAME), content, {
    encoding: "utf-8",
  });
}

async function mapWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length)) },
    async () => {
      while (next < items.length) {
        await worker(items[next++]);
      }
    },
  );

  await Promise.all(workers);
}
