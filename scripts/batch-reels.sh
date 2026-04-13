#!/bin/bash
# =============================================================================
# OVERNIGHT REEL BATCH PROCESSOR
# =============================================================================
#
# Processes all reel folders in public/reels/ autonomously.
# Each folder is handled in its own Claude Code session to keep context clean.
#
# USAGE:
#   ./scripts/batch-reels.sh              # Process all reel folders
#   ./scripts/batch-reels.sh reel1 reel3  # Process specific reels only
#
# SETUP:
#   1. Drop clips + images into public/reels/reel-XXX/ folders
#   2. Optionally add a brief.txt to each folder (if not, the planner creates one)
#   3. Run this script
#   4. Go to sleep
#   5. Wake up to rendered reels in out/ and build logs in each reel folder
#
# =============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# Support both reels/ and public/reels/ folder structures
if [ -d "reels" ] && find "reels" -maxdepth 2 -type f \( -iname "*.mov" -o -iname "*.mp4" \) 2>/dev/null | grep -q .; then
    REELS_DIR="reels"
else
    REELS_DIR="public/reels"
fi
OUT_DIR="out"
LOG_FILE="$OUT_DIR/batch-log-$(date +%Y%m%d-%H%M%S).md"

mkdir -p "$OUT_DIR"

# Header for the master log
cat > "$LOG_FILE" << EOF
# Batch Reel Processing Log
## Started: $(date)
## Project: $PROJECT_DIR

---

EOF

# Determine which reels to process
if [ $# -gt 0 ]; then
    # Specific reels passed as arguments
    REELS=("$@")
else
    # All folders in public/reels/ that contain at least one video or image file
    REELS=()
    for dir in "$REELS_DIR"/*/; do
        if [ -d "$dir" ]; then
            reel_name=$(basename "$dir")
            # Check if folder has any media files
            if find "$dir" -type f \( -iname "*.mov" -o -iname "*.mp4" -o -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | grep -q .; then
                REELS+=("$reel_name")
            fi
        fi
    done
fi

TOTAL=${#REELS[@]}

if [ "$TOTAL" -eq 0 ]; then
    echo "No reel folders found in $REELS_DIR/"
    echo "Create folders with clips and run again."
    exit 1
fi

echo "============================================="
echo "  OVERNIGHT REEL BATCH PROCESSOR"
echo "============================================="
echo ""
echo "Found $TOTAL reel(s) to process:"
for reel in "${REELS[@]}"; do
    has_brief=""
    if [ -f "$REELS_DIR/$reel/brief.txt" ]; then
        has_brief=" (has brief.txt)"
    else
        has_brief=" (no brief — planner will create one)"
    fi
    echo "  - $reel$has_brief"
done
echo ""
echo "Output: $OUT_DIR/"
echo "Logs:   $LOG_FILE"
echo "        + build-log.md in each reel folder"
echo ""
echo "Starting in 5 seconds... (Ctrl+C to cancel)"
sleep 5
echo ""

PASSED=0
FAILED=0
NEEDS_REVIEW=0

for i in "${!REELS[@]}"; do
    reel="${REELS[$i]}"
    num=$((i + 1))
    reel_dir="$REELS_DIR/$reel"

    echo "---------------------------------------------"
    echo "[$num/$TOTAL] Processing: $reel"
    echo "---------------------------------------------"

    # Log to master log
    echo "## Reel $num/$TOTAL: $reel" >> "$LOG_FILE"
    echo "Started: $(date)" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"

    # Build the prompt based on whether a brief exists
    if [ -f "$reel_dir/brief.txt" ]; then
        PROMPT="MODE: AUTO

Process the reel in public/reels/$reel/ autonomously.

A brief.txt exists in the folder. Use the reel-editor skill directly:
1. Read the reel-editor skill at .claude/skills/reel-editor/SKILL.md
2. Read the production memory and Remotion best practices
3. Run Phase 0 (asset discovery — match files to brief)
4. Run Phase 1 (ffprobe, audio extraction, Whisper transcription)
5. Run Phase 2 (generate spec.json)
6. Run Phase 3 (build composition)
7. Run Phase 4 (self-review loop — fix until all checks pass)
8. Render to out/$reel.mp4
9. Write build-log.md to the reel folder

No confirmations needed. Make your best judgment on all decisions. Log everything."
    else
        PROMPT="MODE: AUTO

Process the reel in public/reels/$reel/ autonomously. There is NO brief.txt.

Use the reel-planner skill first, then the reel-editor:
1. Read the reel-planner skill at .claude/skills/reel-planner/SKILL.md
2. Read the production memory and Remotion best practices
3. Scan and catalogue all assets in the folder
4. Transcribe all speech with Whisper
5. Recommend visual inserts (use what's available, log what's missing)
6. Plan the reel (hook, viral arc, cuts, text overlays)
7. Generate brief.txt in the reel folder
8. Hand off to reel-editor: build composition, self-review, render to out/$reel.mp4
9. Write build-log.md to the reel folder

No confirmations needed. Make your best judgment on all creative decisions. Log everything."
    fi

    # Run Claude Code in non-interactive mode
    if claude -p "$PROMPT" --permission-mode bypassPermissions 2>&1 | tee "$reel_dir/claude-output.txt"; then
        # Check if render succeeded
        if [ -f "$OUT_DIR/$reel.mp4" ]; then
            echo "  ✓ $reel — RENDERED SUCCESSFULLY"
            echo "Status: COMPLETE — rendered to out/$reel.mp4" >> "$LOG_FILE"
            PASSED=$((PASSED + 1))
        elif [ -f "$reel_dir/build-log.md" ]; then
            echo "  ~ $reel — BUILT (check build-log for details)"
            echo "Status: NEEDS_REVIEW — built but may need manual review" >> "$LOG_FILE"
            NEEDS_REVIEW=$((NEEDS_REVIEW + 1))
        else
            echo "  ✗ $reel — INCOMPLETE"
            echo "Status: INCOMPLETE — check claude-output.txt" >> "$LOG_FILE"
            FAILED=$((FAILED + 1))
        fi
    else
        echo "  ✗ $reel — FAILED"
        echo "Status: FAILED — Claude exited with error" >> "$LOG_FILE"
        FAILED=$((FAILED + 1))
    fi

    echo "" >> "$LOG_FILE"
    echo "---" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    echo ""
done

# Summary
SUMMARY="
=============================================
  BATCH COMPLETE
=============================================

  Total:        $TOTAL
  Rendered:     $PASSED
  Needs Review: $NEEDS_REVIEW
  Failed:       $FAILED

  Rendered files: $OUT_DIR/
  Master log:     $LOG_FILE
  Per-reel logs:  Each reel folder has build-log.md

=============================================
"

echo "$SUMMARY"

# Append summary to master log
cat >> "$LOG_FILE" << EOF

## Summary
- Total: $TOTAL
- Rendered: $PASSED
- Needs Review: $NEEDS_REVIEW
- Failed: $FAILED

## Completed: $(date)
EOF

echo "Done. Check $LOG_FILE for the full report."
