#!/usr/bin/env bash
#
# sync-recipe-yml.sh
#
# After `npx canvas push` lands changes (components, folders, the global
# CSS asset library) in Drupal, run this to copy the resulting recipe-
# owned configs into a local checkout of the `ui` recipe.
#
# Syncs:
#   - canvas.js_component.*.yml   (one per component)
#   - canvas.folder.*.yml         (editor sidebar groupings)
#   - canvas.asset_library.global.yml  (shadcn token contract + variation CSS)
#
# Usage:
#   ./scripts/sync-recipe-yml.sh --recipe-path ../ui
#
# Or via npm:
#   npm run canvas:sync-recipe -- --recipe-path ../ui
#
# Requires:
#   - DDEV running for the target Drupal site (the one you just pushed to)
#   - drush available in DDEV
#
set -euo pipefail

RECIPE_PATH=""
DRUPAL_DIR=""
DDEV_PROJECT=""

usage() {
  cat <<USAGE
Usage: $0 --recipe-path PATH [--drupal-dir PATH | --ddev-project NAME]

Required:
  --recipe-path PATH      Path to the local ui recipe checkout (must contain config/).

Optional (one of):
  --drupal-dir PATH       Directory containing the Drupal site (with .ddev/).
  --ddev-project NAME     Name of an already-running DDEV project to use.

If neither --drupal-dir nor --ddev-project is given, the script assumes the
DDEV project named "next-canvas-dev" is running as a sibling clone.
USAGE
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --recipe-path) RECIPE_PATH="$2"; shift 2 ;;
    --drupal-dir) DRUPAL_DIR="$2"; shift 2 ;;
    --ddev-project) DDEV_PROJECT="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

[[ -z "$RECIPE_PATH" ]] && { echo "Error: --recipe-path is required."; usage; }
[[ ! -d "$RECIPE_PATH/config" ]] && { echo "Error: $RECIPE_PATH/config not found. Wrong recipe path?"; exit 1; }

# Resolve DDEV context.
if [[ -n "$DRUPAL_DIR" ]]; then
  cd "$DRUPAL_DIR"
elif [[ -n "$DDEV_PROJECT" ]]; then
  DRUPAL_DIR="$(ddev describe "$DDEV_PROJECT" 2>/dev/null | awk '/Location:/{print $2}')"
  [[ -z "$DRUPAL_DIR" ]] && { echo "Error: DDEV project '$DDEV_PROJECT' not found."; exit 1; }
  cd "$DRUPAL_DIR"
else
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  if [[ -d "$SCRIPT_DIR/../../next-canvas-dev" ]]; then
    cd "$SCRIPT_DIR/../../next-canvas-dev"
  else
    echo "Error: No DDEV context. Pass --drupal-dir or --ddev-project."
    exit 1
  fi
fi

echo "==> Exporting Drupal config from $(pwd)..."
ddev drush config:export --destination=/tmp/canvas-export -y > /dev/null

echo "==> Syncing recipe-owned configs into $RECIPE_PATH/config/..."

# Names matched as glob patterns inside the DDEV container.
PATTERNS=(
  "canvas.js_component.*.yml"
  "canvas.folder.*.yml"
  "canvas.asset_library.global.yml"
)

count_copied=0
for pattern in "${PATTERNS[@]}"; do
  for fname in $(ddev exec "ls /tmp/canvas-export/${pattern} 2>/dev/null" || true); do
    base="$(basename "$fname")"
    ddev exec "cat /tmp/canvas-export/$base" > "$RECIPE_PATH/config/$base"
    # Strip recipe-portability artifacts: instance uuid and the _core
    # default_config_hash block (two lines).
    sed -i '' -e '/^uuid:/d' -e '/^_core:$/d' -e '/^  default_config_hash:/d' "$RECIPE_PATH/config/$base"
    count_copied=$((count_copied + 1))
  done
done

cd "$RECIPE_PATH"
modified=$(git status --short config/ 2>/dev/null | wc -l | tr -d ' ')
echo "==> $count_copied file(s) copied; $modified now show changes in $RECIPE_PATH/config/."
echo "    Review with: cd $RECIPE_PATH && git diff config/"
echo "    Commit when ready."
