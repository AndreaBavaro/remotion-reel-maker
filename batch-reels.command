#!/bin/bash
# ============================================================
# Nitely — Batch Reel Processor
# Double-click this to process all reels overnight.
#
# Before running:
#   1. Drop your clips into public/reels/reel7/, reel8/, etc.
#   2. Optionally add a brief.txt to each folder
#   3. Double-click this file and let it run
#   4. Check the out/ folder when it's done
# ============================================================

cd "$(dirname "$0")"

echo ""
echo "========================================="
echo "  Nitely Batch Reel Processor"
echo "========================================="
echo ""
echo "This will process all reel folders that have clips in them."
echo "Rendered videos will appear in the out/ folder."
echo ""
echo "Press Enter to start, or Cmd+Q to cancel."
read -r

bash scripts/batch-reels.sh

echo ""
echo "Press Enter to close this window."
read -r
