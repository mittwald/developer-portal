#!/usr/bin/env bash
#
# PreToolUse hook: refuse Bash commands that use `sed` to modify files.
#
# In-place edits (`sed -i`) and write-out edits (`sed ... > file`, `sed ... |
# tee file`) bypass the Edit/Write tools, and therefore bypass the PostToolUse
# Prettier hook. Read-only uses of sed (filtering output in a pipeline) stay
# allowed.

set -uo pipefail

payload=$(cat)

command=$(jq -r '.tool_input.command // empty' <<<"$payload")
[ -n "$command" ] || exit 0

deny() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# Blank out quoted spans first: a `>` or `-i` inside a sed script (e.g.
# `sed 's/^/> /'`) is data, not a redirect or a flag.
unquoted=$(awk '{ gsub(/\047[^\047]*\047/, " "); gsub(/"[^"]*"/, " "); print }' <<<"$command")

# Does the command invoke sed at all (start of line, or after a separator)?
grep -Eq '(^|[[:space:];&|(])sed([[:space:]]|$)' <<<"$unquoted" || exit 0

use_edit_tool="Use the Edit or Write tool instead — those go through the repository's Prettier hook, which sed-based edits skip."

# 1. In-place editing: -i, -i.bak, -ni, -Ei, --in-place
if grep -Eq '\bsed\b[^;&|]*[[:space:]](-[A-Za-z]*i([[:space:]]|$|[.'"'"'"])|--in-place)' <<<"$unquoted"; then
  deny "Blocked: this command edits files in place with \`sed -i\`. $use_edit_tool"
fi

# 2. Write-out editing: any redirect or `tee` target other than /dev/*
while IFS= read -r target; do
  [ -n "$target" ] || continue
  case "$target" in
  /dev/*) continue ;;
  esac
  deny "Blocked: this command pipes \`sed\` output into $target. $use_edit_tool"
done < <(
  {
    grep -oE '>>?[[:space:]]*[^[:space:];&|<>]+' <<<"$unquoted"
    grep -oE '\|[[:space:]]*tee[[:space:]]+(-a[[:space:]]+)?[^[:space:];&|]+' <<<"$unquoted"
  } | grep -oE '[^[:space:]>]+$'
)

exit 0
