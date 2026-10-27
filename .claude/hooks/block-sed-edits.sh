#!/usr/bin/env bash
#
# PreToolUse hook: refuse Bash commands that use `sed` to modify files.
#
# In-place edits (`sed -i`) and write-out edits (`sed ... > file`, `sed ... |
# tee file`) bypass the Edit/Write tools, and therefore bypass the PostToolUse
# Prettier hook. Read-only uses of sed (filtering output in a pipeline) stay
# allowed.

set -uo pipefail

# Fail closed: without jq or awk the command cannot be inspected, and exiting 0
# would wave it through. Exit code 2 blocks the tool call and reports back.
for tool in jq awk; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "block-sed-edits hook: $tool is not installed, so this command cannot be checked for sed-based file edits. Install $tool, or use the Edit/Write tools." >&2
    exit 2
  fi
done

payload=$(cat)

cmd=$(jq -r '.tool_input.command // empty' <<<"$payload")
[ -n "$cmd" ] || exit 0

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

# Reduce the command to just its shell syntax before matching, so that text
# which merely mentions sed is not mistaken for a sed invocation:
#
#   - heredoc bodies are dropped (a commit message or PR description passed to
#     `git commit -F -` is data, not commands)
#   - quoted spans are blanked, so the `>` in `sed 's/^/> /'` is not a redirect
unquoted=$(awk '
  {
    if (skip) { if ($0 ~ term) skip = 0; next }
    raw = $0
    if (match(raw, /<<-?[[:space:]]*[\047"]?[A-Za-z_][A-Za-z0-9_]*[\047"]?/)) {
      marker = substr(raw, RSTART, RLENGTH)
      gsub(/^<<-?[[:space:]]*|[\047"]/, "", marker)
      term = "^[[:space:]]*" marker "[[:space:]]*$"
      skip = 1
      sub(/<<-?[[:space:]]*[\047"]?[A-Za-z_][A-Za-z0-9_]*[\047"]?/, " ", raw)
    }
    gsub(/\047[^\047]*\047/, " ", raw)
    gsub(/"[^"]*"/, " ", raw)
    print raw
  }
' <<<"$cmd")

# Does the command invoke sed at all (start of line, or after a separator)?
grep -Eq '(^|[[:space:];&|(])sed([[:space:]]|$)' <<<"$unquoted" || exit 0

use_edit_tool="Use the Edit or Write tool instead — those go through the repository's Prettier hook, which sed-based edits skip."

# 1. In-place editing: -i, -i.bak, -ni, -Ei, --in-place
if grep -Eq '\bsed\b[^;&|]*[[:space:]](-[A-Za-z]*i([[:space:]]|$|[.'"'"'"])|--in-place)' <<<"$unquoted"; then
  deny "Blocked: this command edits files in place with \`sed -i\`. $use_edit_tool"
fi

# 2. Write-out editing: a stdout redirect or `tee` into a file other than /dev/*.
#    Only stdout counts (`>`, `>>`, `1>`, `&>`) — redirecting stderr to a log,
#    as in `sed -n '1,5p' file 2>errors.log`, does not modify the file.
while IFS= read -r target; do
  [ -n "$target" ] || continue
  case "$target" in
  /dev/*) continue ;;
  esac
  deny "Blocked: this command writes \`sed\` output into $target. $use_edit_tool"
done < <(
  {
    grep -oE '(^|[^0-9<>&])&?>>?[[:space:]]*[^[:space:];&|<>]+' <<<"$unquoted"
    grep -oE '(^|[[:space:]])1>>?[[:space:]]*[^[:space:];&|<>]+' <<<"$unquoted"
    grep -oE '\|[[:space:]]*tee[[:space:]]+(-a[[:space:]]+)?[^[:space:];&|]+' <<<"$unquoted"
  } | grep -oE '[^[:space:]>]+$'
)

exit 0
