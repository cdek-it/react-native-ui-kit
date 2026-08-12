#!/usr/bin/env bash

set -euo pipefail

resolver_dir="$(cd "$(dirname "$0")" && pwd)"
resolver="$resolver_dir/resolve-review-scope.sh"
fixture_root="$(mktemp -d "${TMPDIR:-/tmp}/ui-kit-review-scope.XXXXXX")"

cleanup() {
  if [ -n "$fixture_root" ] && [ -d "$fixture_root" ]; then
    rm -rf -- "$fixture_root"
  fi
}

trap cleanup EXIT

assert_line() {
  local output="$1"
  local expected="$2"

  if ! printf '%s\n' "$output" | rg --fixed-strings --line-regexp -- "$expected" >/dev/null; then
    printf 'missing expected line: %s\n' "$expected" >&2
    exit 1
  fi
}

git -C "$fixture_root" init --quiet
git -C "$fixture_root" config user.email 'scope-test@example.invalid'
git -C "$fixture_root" config user.name 'Scope Test'
git -C "$fixture_root" config core.hooksPath /dev/null
git -C "$fixture_root" config commit.gpgsign false

mkdir -p "$fixture_root/src"
printf 'export const changed = 1\n' >"$fixture_root/src/Changed.ts"
printf 'export const deleted = true\n' >"$fixture_root/src/Deleted.ts"
git -C "$fixture_root" add src/Changed.ts src/Deleted.ts
git -C "$fixture_root" commit --quiet -m 'test: initial fixture'

printf 'export const changed = 2\n' >"$fixture_root/src/Changed.ts"
git -C "$fixture_root" add src/Changed.ts
printf 'export const untracked = true\n' >"$fixture_root/src/Untracked.ts"
rm "$fixture_root/src/Deleted.ts"
mkdir -p "$fixture_root/.agents/skills/sample/vendor"
printf 'vendor fixture\n' >"$fixture_root/.agents/skills/sample/vendor/source.md"

scope_output="$(cd "$fixture_root" && "$resolver" --working-tree)"
assert_line "$scope_output" $'file=changed\tsrc/Changed.ts'
assert_line "$scope_output" $'file=deleted\tsrc/Deleted.ts'
assert_line "$scope_output" $'file=untracked\tsrc/Untracked.ts'
assert_line "$scope_output" $'skip=vendor\t.agents/skills/sample/vendor/source.md'

vendor_output="$(cd "$fixture_root" && "$resolver" --working-tree --include-vendor)"
assert_line "$vendor_output" $'file=untracked\t.agents/skills/sample/vendor/source.md'

if missing_base_output="$(cd "$fixture_root" && "$resolver" --base missing-base 2>&1)"; then
  printf 'missing base unexpectedly succeeded\n' >&2
  exit 1
fi
assert_line "$missing_base_output" 'error=missing-base-ref value=missing-base'

printf 'resolve-review-scope fixtures=ok\n'
