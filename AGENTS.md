# AGENTS.md - Development Guidelines for mittwald Developer Portal

This file contains guidelines for agentic coding assistants working on the mittwald Developer Portal codebase. Follow these conventions to maintain consistency with the existing codebase.

## Build, Lint, and Test Commands

### Development Setup

```bash
npm install                    # Install all dependencies
npm start                      # Start development server on localhost:3000
npm run build                  # Build production release
npm run serve                  # Serve production build locally
```

### Code Generation

```bash
npm run generate               # Build OpenAPI reference documentation
npm run generate:changelog     # Generate API changelog entries (requires OPENAI_API_KEY)
npm run generate:cli           # Generate CLI documentation
npm run generate:translations  # Generate translation files (requires OPENAI_API_KEY)
```

### Code Quality

```bash
npm run format                 # Format code with Prettier (docs, i18n, src directories)
```

### Testing

There are currently no automated tests configured in this project. For manual testing:

- Build the site with `npm run build` and check for errors
- Start development server with `npm start` and verify functionality
- Test multi-language support by building with `npm run build`

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: `noImplicitAny: true`, `noUnusedParameters: true`, `noUnusedLocals: true`
- **Target**: ES modules with modern TypeScript features
- **Path mapping**: Use `@site/*` for internal imports
- **Extends**: `@tsconfig/docusaurus/tsconfig.json`

### Import Organization

```typescript
// External libraries first
import React, { ReactNode } from "react";
import clsx from "clsx";

// Docusaurus components and utilities
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

// Internal components (use @site/* mapping)
import FeatureRow from "@site/src/components/FeatureRow";
import Intro from "@site/src/components/Intro";

// Relative imports for co-located files
import compareOperation from "../src/openapi/compareOperation";
```

### Component Patterns

#### Function Components

```typescript
interface ComponentNameProps {
  title: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
}

function ComponentName({ title, children, variant = 'primary' }: ComponentNameProps) {
  return (
    <div className={clsx('component-name', variant && `component-name--${variant}`)}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default ComponentName;
```

#### Class Components (for complex state)

```typescript
class APIDocRenderer {
  private specLoader: SpecLoader = loadSpec;
  private tagFilter: (tag: OpenAPIV3.TagObject) => boolean = () => true;

  constructor(outputPath: (apiVersion: APIVersion, path: string) => string) {
    this.outputPath = outputPath;
  }

  public withSpecLoader(specLoader: SpecLoader): APIDocRenderer {
    const renderer = new APIDocRenderer(this.outputPath);
    renderer.specLoader = specLoader;
    return renderer;
  }
}
```

### Naming Conventions

#### Files and Directories

- **Components**: `PascalCase.tsx` (e.g., `APIFeature.tsx`, `OperationLink.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `compareOperation.ts`, `slugFromTagName.ts`)
- **Directories**: `kebab-case` for components (e.g., `HomepageFeatures/`), `camelCase` for utilities

#### Variables and Functions

- **Constants**: `UPPER_SNAKE_CASE` for exported constants
- **Functions**: `camelCase` for regular functions, `PascalCase` for constructor functions
- **Methods**: `camelCase`, `camelCase` for private methods
- **Props**: Descriptive names, avoid abbreviations unless widely understood

#### Types and Interfaces

```typescript
interface ReferenceLinkProps {
  version: string;
  title: string;
  spec: {
    type: "openapi" | "swagger";
    typeLabel: string;
    url: string;
  };
}

type APIVersion = "v1" | "v2";
type HttpMethods = OpenAPIV3.HttpMethods;
```

### Formatting and Style

#### Prettier Configuration

- **Markdown/MDX**: `printWidth: 80`, `proseWrap: "preserve"`
- **Default**: Standard Prettier defaults
- **Run**: `npm run format` to format docs, i18n, and src directories

#### Code Structure

```typescript
// Destructuring in function parameters when using multiple props
function ReferenceLink({ version, title, spec }: ReferenceLinkProps) {
  // Early returns for guard clauses
  if (!version) return null;

  // Logical grouping of related operations
  const links = [
    <Link key="ref" to={`/docs/${version}/reference`}>Reference</Link>,
    <Link key="spec" href={spec.url}>{spec.typeLabel}</Link>,
  ];

  return <LinkGroup title={title} links={links} />;
}
```

### Error Handling

#### Asynchronous Operations

```typescript
async function renderAPISpecToFile(
  operationFile: string,
  urlPathWithBase: string,
  method: string,
  spec: OpenAPIV3.OperationObject,
  serverURL: string,
  apiVersion: APIVersion,
) {
  try {
    const rendered = await ejs.renderFile(
      "generator/templates/operation.mdx.ejs",
      {
        // template variables
      },
    );
    fs.writeFileSync(operationFile, rendered, { encoding: "utf-8" });
  } catch (error) {
    console.error(`Failed to render ${operationFile}:`, error);
    throw error;
  }
}
```

#### CLI Scripts

```typescript
(async () => {
  try {
    await mainFunction();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
```

### Documentation and Comments

#### Component Documentation

```typescript
interface NewBadgeProps {
  /** Display text for the badge */
  children?: ReactNode;
  /** Visual style variant */
  variant?: 'new' | 'beta' | 'experimental';
}

/** Displays a "New" or similar badge next to features */
export function NewBadge({ children = 'New', variant = 'new' }: NewBadgeProps) {
  return (
    <span className={clsx('badge', `badge--${variant}`)}>
      {children}
    </span>
  );
}
```

#### Complex Logic Comments

```typescript
// Strip trailing dot from summary because they are annoying in the sidebar
const summary: string = canonicalizeTitle(operation.summary);

// Determine server URL and base path for API operations
const [serverURL, basePath] = determineServerURLAndBasePath(apiVersion, spec);
```

### File Organization

#### Component Structure

```
src/components/
  ComponentName/
    index.tsx          # Main component export
    styles.module.css  # Component-specific styles
    types.ts           # Component type definitions (if complex)
```

#### Generator Structure

```
generator/
  generate-*.ts       # Main generator scripts
  templates/          # EJS templates
  util/               # Shared utilities
  overlays/           # API specification overrides
```

### Internationalization

#### Anchors

Do not translate anchors indirectly via markdown headlines.
Better use explicit, technical anchor IDs to keep them from being
translated and stable against content changes, e.g. headline
renaming. Visit contribution guide for a more detailed example.

#### Translation Usage

```typescript
import Translate, { translate } from "@docusaurus/Translate";

// In JSX
<Translate id="component.title">Default English Text</Translate>

// In JavaScript
const title = translate({ id: "component.title" });
```

#### Translation Keys

- Use dot notation: `component.section.element`
- Keep keys descriptive and hierarchical
- Update both English and German translations

### Performance Considerations

#### React Optimization

- Use `React.memo` for expensive components
- Prefer functional components with hooks
- Avoid unnecessary re-renders with proper dependency arrays

#### Build Optimization

- Use dynamic imports for large components
- Optimize images and assets
- Leverage Docusaurus's built-in optimizations

### Git and Version Control

#### Commit Messages

- Use conventional commits when possible
- Be descriptive about what changed and why
- Reference issue numbers when applicable

#### Branching

- Feature branches for new functionality
- Bug fix branches for issues
- Keep branches focused on single concerns

## Development Workflow

1. **Setup**: `npm install && npm run generate`
2. **Development**: `npm start` for live development
3. **Code Quality**: `npm run format` before committing
4. **Testing**: Manual testing + `npm run build` to catch issues
5. **Documentation**: Update both English and German versions
6. **OpenAPI Changes**: Run `npm run generate` after spec updates

## Key Project Characteristics

- **Framework**: Docusaurus v3 with React 19
- **Language**: TypeScript with strict settings
- **Content**: Multi-language documentation (English + German)
- **APIs**: OpenAPI v1 and v2 specification documentation
- **Build**: Static site generation with client-side routing
- **Deployment**: GitHub Pages with internationalization support</content>
  <parameter name="filePath">/Users/dfischer/workdir/developer-portal/AGENTS.md
