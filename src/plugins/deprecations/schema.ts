import * as z from "zod";

// Any version, so that entries for upcoming API versions validate; operation
// references to versions without a spec fail when they are resolved
const apiVersion = z
  .string()
  .regex(/^v\d+(-preview)?$/, 'expected an API version like "v2"');

/**
 * What a deprecation affects: the product in general, the CLI, the API as a
 * whole ("api") or a specific API version ("api/v2")
 */
const scope = z
  .string()
  .regex(
    /^(product|cli|api|api\/v\d+)$/,
    'expected "product", "cli", "api" or "api/v<version>"',
  );

/**
 * An affected API operation, either as a plain operation ID (v2) or with an
 * explicit API version.
 */
const operationReference = z.union([
  z.string().transform((operationId) => ({ operationId, apiVersion: "v2" })),
  z.strictObject({
    operationId: z.string(),
    apiVersion: apiVersion.default("v2"),
  }),
]);

/** One deprecation, as written in `deprecations/<slug>.yaml` */
export const deprecationSchema = z
  .strictObject({
    title: z.string().min(1),
    /** One sentence, shown in the overview and used as feed item summary */
    summary: z.string().min(1),
    /**
     * One or more scopes; the API versions of the affected operations are
     * added automatically
     */
    scope: z
      .union([scope, z.array(scope)])
      .transform((s) => (Array.isArray(s) ? s : [s]))
      .default([]),
    /** Date of the announcement; also the date of the feed item */
    announced: z.iso.date(),
    /** Date from which the deprecated behaviour is gone; may be unknown yet */
    sunset: z.iso.date().optional(),
    /**
     * MDX, rendered like docs (admonitions, `<OperationLink>`, …), below an
     * h2; use h3 and lower for headings. Links to `operation:<operationId>`
     * become `<OperationLink>`s.
     */
    description: z.string().min(1),
    /** MDX, like `description`: what to use instead, migration hints */
    replacement: z.string().optional(),
    /** Affected API operations, if any */
    operations: z.array(operationReference).default([]),
    /** Drafts are only rendered by `npm start`, not in production builds */
    draft: z.boolean().default(false),
  })
  .refine((d) => !d.sunset || d.sunset >= d.announced, {
    message: "sunset must not be before announced",
    path: ["sunset"],
  })
  .refine((d) => d.scope.length > 0 || d.operations.length > 0, {
    message: "scope is required unless operations are given",
    path: ["scope"],
  });

export type DeprecationInput = z.infer<typeof deprecationSchema>;
export type OperationReference = z.infer<typeof operationReference>;
