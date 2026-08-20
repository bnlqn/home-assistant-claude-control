#!/usr/bin/env bash
#
# Download Homey's Energy-page flow frame sequences (the glowing conduit
# animations). Each flow is a 113-frame, 960x720 sequence played on <canvas>.
#
# Source pattern (from HYSequence): <folder>/<prefix>.<frame>.<ext>
#   https://homey.app/sequence/pages/features-energy/<type>/<type>.<n>.webp
#
# Usage:  bash scripts/fetch-energy-flows.sh [OUT_DIR]
# Default OUT_DIR: ./flow-sequences  (relative to the panel dir)
#
# NOTE: these are Homey's proprietary assets — intended here only for a
# personal Home Assistant dashboard, not redistribution.
set -euo pipefail

BASE="https://homey.app/sequence/pages/features-energy"
TYPES=(solar-generating grid-exporting home-consuming ev-charging battery-charging)
TOTAL=113                        # frames 0 .. TOTAL-1
OUT="${1:-./flow-sequences}"

mkdir -p "$OUT"
echo "Downloading ${#TYPES[@]} flow sequences ($TOTAL frames each) into $OUT"

for type in "${TYPES[@]}"; do
  dir="$OUT/$type"
  mkdir -p "$dir"
  ok=0; miss=0
  for ((n=0; n<TOTAL; n++)); do
    url="$BASE/$type/$type.$n.webp"
    out="$dir/$type.$n.webp"
    if curl -fsSL "$url" -o "$out" 2>/dev/null; then
      ok=$((ok+1))
    else
      # fall back to PNG if webp is missing for this frame
      if curl -fsSL "$BASE/$type/$type.$n.png" -o "$dir/$type.$n.png" 2>/dev/null; then
        ok=$((ok+1))
      else
        miss=$((miss+1))
        rm -f "$out"
      fi
    fi
  done
  size=$(du -sh "$dir" 2>/dev/null | cut -f1)
  printf "  %-18s %3d frames  (%s)  missing:%d\n" "$type" "$ok" "${size:-?}" "$miss"
done

echo "Total: $(du -sh "$OUT" | cut -f1)"
