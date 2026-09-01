#!/usr/bin/env bash
# Build a Chrome Web Store upload zip from ext/.
set -euo pipefail
cd "$(dirname "$0")"
node build.mjs
VER=$(python3 -c "import json;print(json.load(open('ext/manifest.json'))['version'])")
OUT="earshot-${VER}.zip"
rm -f "$OUT"
# icon256 is for the store listing, not the package; exclude dev leftovers too
( cd ext && zip -qr "../$OUT" . \
    -x "icons/icon256.png" "*.orig" "*.map" ".DS_Store" "__MACOSX/*" )
echo "built $OUT  ($(du -h "$OUT" | cut -f1))"
unzip -l "$OUT" | tail -n +4 | head -20
