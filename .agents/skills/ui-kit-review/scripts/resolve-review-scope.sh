#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: $0 [--base <git-ref> | --working-tree] [--include-vendor]" >&2
  exit 2
}

base_ref=""
working_tree_only=0
include_vendor=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --base)
      [ "$#" -ge 2 ] || usage
      [ -z "$base_ref" ] || usage
      [ "$working_tree_only" -eq 0 ] || usage
      base_ref="$2"
      shift 2
      ;;
    --working-tree)
      [ -z "$base_ref" ] || usage
      [ "$working_tree_only" -eq 0 ] || usage
      working_tree_only=1
      shift
      ;;
    --include-vendor)
      [ "$include_vendor" -eq 0 ] || usage
      include_vendor=1
      shift
      ;;
    *)
      usage
      ;;
  esac
done

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

working_tree_files() {
  {
    git -c core.quotepath=false diff --find-renames --name-only HEAD
    git -c core.quotepath=false ls-files --others --exclude-standard
  } | LC_ALL=C sort -u
}

combine_files() {
  {
    printf '%s\n' "$1"
    printf '%s\n' "$2"
  } | awk 'NF' | LC_ALL=C sort -u
}

local_files="$(working_tree_files)"

if [ -n "$base_ref" ]; then
  git rev-parse --verify "$base_ref" >/dev/null 2>&1 || {
    echo "error=missing-base-ref value=$base_ref" >&2
    exit 1
  }
  git merge-base "$base_ref" HEAD >/dev/null 2>&1 || {
    echo "error=unrelated-base-ref value=$base_ref" >&2
    exit 1
  }
  branch_files="$(git -c core.quotepath=false diff --find-renames --name-only "$base_ref"...HEAD)"
  files="$(combine_files "$branch_files" "$local_files")"
  scope="base:$base_ref+working-tree"
elif [ "$working_tree_only" -eq 1 ]; then
  files="$local_files"
  scope="working-tree"
elif git rev-parse --verify origin/develop >/dev/null 2>&1 &&
  git merge-base origin/develop HEAD >/dev/null 2>&1; then
  branch_files="$(git -c core.quotepath=false diff --find-renames --name-only origin/develop...HEAD)"
  files="$(combine_files "$branch_files" "$local_files")"
  scope="base:origin/develop+working-tree"
else
  files="$local_files"
  scope="working-tree"
fi

if [ -z "$files" ]; then
  echo "scope=none"
  exit 0
fi

if [ "$include_vendor" -eq 1 ]; then
  scope="$scope+vendor"
fi

echo "scope=$scope"

emit_file() {
  local candidate_path="$1"

  if [ ! -e "$candidate_path" ] && [ ! -L "$candidate_path" ]; then
    printf 'file=deleted\t%s\n' "$candidate_path"
  elif git ls-files --error-unmatch -- "$candidate_path" >/dev/null 2>&1; then
    printf 'file=changed\t%s\n' "$candidate_path"
  else
    printf 'file=untracked\t%s\n' "$candidate_path"
  fi
}

printf '%s\n' "$files" | while IFS= read -r path; do
  [ -n "$path" ] || continue

  case "$path" in
    .secrets|.secrets/*|*.env|*.env.*|*.p8|*.jks|*.keystore|*.enc|\
    ios/*.plist|android/app/*.json)
      printf 'skip=forbidden\t%s\n' "$path"
      ;;
    coverage|coverage/*|*/coverage/*|dist|dist/*|*/dist/*|build|build/*|\
    */build/*|.expo|.expo/*|*.snap|*/__snapshots__/*|\
    .storybook/storybook.requires.ts)
      printf 'skip=generated\t%s\n' "$path"
      ;;
    vendor|vendor/*|*/vendor|*/vendor/*)
      if [ "$include_vendor" -eq 1 ]; then
        emit_file "$path"
      else
        printf 'skip=vendor\t%s\n' "$path"
      fi
      ;;
    src/*.ts|src/*.tsx|src/**/*.ts|src/**/*.tsx)
      emit_file "$path"
      ;;
    *)
      printf 'skip=unsupported\t%s\n' "$path"
      ;;
  esac
done
