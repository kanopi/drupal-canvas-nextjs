#!/usr/bin/env bash
#
# sync-recipe-yml.sh
#
# After `npx canvas push` lands a component change in Drupal, run this to
# copy the resulting canvas.js_component.*.yml + canvas.folder.*.yml configs
# into a local checkout of the `ui` recipe so the recipe stays in sync.
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
DDEV project named "next-canvas-dev" is running.
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
  # Use ddev's project name resolution.
  DRUPAL_DIR="$(ddev describe "$DDEV_PROJECT" 2>/dev/null | awk '/Location:/{print $2}')"
  [[ -z "$DRUPAL_DIR" ]] && { echo "Error: DDEV project '$DDEV_PROJECT' not found."; exit 1; }
  cd "$DRUPAL_DIR"
else
  # Default: next-canvas-dev sibling.
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

echo "==> Copying canvas.js_component.*.yml and canvas.folder.*.yml into $RECIPE_PATH/config/..."
ddev exec "cp /tmp/canvas-export/canvas.js_component.*.yml /var/www/html/recipes/contrib/ui/config/ 2>/dev/null || true"

# Cross-mount copy (ddev exec writes inside the container; we need host-side copy).
# Use rsync/cp directly via mounted dirs if possible, otherwise pull via drush.
HOST_EXPORT_DIR="$(ddev exec pwd 2>/dev/null && echo)"
# Simpler approach: cat each file out of the container.
for prefix in canvas.js_component canvas.folder; do
  for fname in $(ddev exec "ls /tmp/canvas-export/${prefix}.*.yml 2>/dev/null" || true); do
    base="$(basename "$fname")"
    ddev exec "cat /tmp/canvas-export/$base" > "$RECIPE_PATH/config/$base"
    # Strip uuid line (recipes should not include instance UUIDs).
    sed -i '' '/^uuid:/d' "$RECIPE_PATH/config/$base"
  done
done

cd "$RECIPE_PATH"
COUNT=$(git status --short config/ | wc -l | tr -d ' ')
echo "==> $COUNT recipe config file(s) modified in $RECIPE_PATH/config/."
echo "    Review with: cd $RECIPE_PATH && git diff config/"
echo "    Commit when ready."
