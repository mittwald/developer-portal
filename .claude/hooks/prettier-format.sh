#!/usr/bin/env bash
#
# PostToolUse hook: run the project's Prettier over every .md/.mdx/.ts/.tsx
# file that Claude writes or edits, so the tree always matches `npm run format`.
#
# Reads the hook payload on stdin, writes JSON to stdout only when Prettier
# fails (so the failure surfaces in the UI instead of silently doing nothing).

set -uo pipefail

# Without jq the payload cannot be parsed, and exiting 0 here would silently
# skip formatting — exactly the failure this hook exists to prevent. Exit code 2
# is a blocking error whose stderr is reported back to the agent.
if ! command -v jq >/dev/null 2>&1; then
  echo "prettier-format hook: jq is not installed, so the edited file could not be formatted. Install jq, then format the file with ./node_modules/.bin/prettier --write <file>." >&2
  exit 2
fi

payload=$(cat)

file=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' <<<"$payload")
[ -n "$file" ] || exit 0

case "$file" in
*.md | *.mdx | *.ts | *.tsx) ;;
*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$PWD}"
prettier="$root/node_modules/.bin/prettier"

# Report back to the agent instead of failing silently: an unformatted file is
# never an acceptable outcome, and a missing install is not a reason to skip it.
block() {
  jq -n --arg reason "$1" '{decision: "block", reason: $reason}'
  exit 0
}

# Fresh clone without `npm install`. Deliberately no `npx` fallback — that would
# fetch an unpinned Prettier and format against the wrong version.
if [ ! -x "$prettier" ]; then
  block "$file was edited but NOT formatted: Prettier is not installed at $prettier. Run \`npm install\` in the project root, then format the file with \`./node_modules/.bin/prettier --write $file\` (or \`npm run format\` for a bulk run over docs, i18n and src). Do not use \`npx prettier\` — it fetches an unpinned version. Do not leave the file unformatted."
fi

cd "$root" || block "$file was edited but NOT formatted: could not enter the project root $root."

if ! output=$("$prettier" --write --ignore-unknown "$file" 2>&1); then
  block "Prettier failed on $file, so it is NOT formatted — this usually means the edit left the file syntactically invalid. Fix it and re-run \`./node_modules/.bin/prettier --write $file\`. Prettier said: $output"
fi

exit 0
