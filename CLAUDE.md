# Nitely Reel Maker

This is a Remotion project for creating Instagram Reels for the Nitely app. The user drops video clips (and optionally images) into folders under `reels/`, then asks Claude to plan and build the reel.

## How to respond when a user opens this project

When a user starts a session and mentions editing, planning, or building a reel, follow this workflow automatically. The user may be non-technical — keep everything simple, no jargon.

## Detecting what the user wants

| User says | What to do |
|---|---|
| "edit reel1" / "plan a reel from reel1" / "make a reel" | Run the **single reel** workflow below |
| "edit all reels" / "build everything" / "process all" | Run the **batch** workflow below |
| "I added new clips to reel3" / "rebuild reel3" | Re-run the single reel workflow for that folder |
| "change the hook" / "make clip 2 shorter" / etc. | Make the edit to the existing composition |
| "render reel1" | Render with `npx remotion render` |

## Single reel workflow

1. **Read the skills first** (mandatory):
   - Read `.claude/skills/reel-planner/SKILL.md`
   - Read `.claude/skills/reel-editor/SKILL.md`
   - Read `.claude/memory/reel-feedback.md` (Active Learnings section)
   - Read the relevant Remotion best-practices rules from `skills/remotion-best-practices/`

2. **Scan the reel folder**: List all files in `reels/[folder]/` with ffprobe durations

3. **Transcribe**: Run `npx tsx scripts/transcribe-reel.ts [folder]`
   - If it fails because the whisper model isn't cached, tell the user: "Double-click setup.command in Finder first — it takes 2 minutes to download the speech model. Then come back."
   - If `transcriptions.json` already exists, skip and read it

4. **Follow the reel-planner skill** steps 1-7 (scan, transcribe, recommend inserts, plan, collaboration review, generate brief, hand off to editor)

5. **Follow the reel-editor skill** phases 0-6 (asset discovery, analysis, spec, build, self-review, feedback)

## Batch workflow (edit all reels)

For every folder in `reels/` that contains video files:
1. Run the single reel workflow for each folder
2. In batch mode, use `MODE: AUTO` — skip confirmation prompts, make best-judgment creative decisions
3. Log everything to `[reel-folder]/build-log.md`

## Key rules (always apply)

- Visual cut within the first 2 seconds of every reel (mandatory)
- Flash cuts between every clip transition
- Captions generated from actual audio (never made up)
- Product name "Nitely" always appears last
- Keep reels under 30 seconds (sweet spot: 15-20s)
- Text overlays use spring animations
- All content within Instagram safe zones (not in top 180px or bottom 270px)
- Apply all Active Learnings from `.claude/memory/reel-feedback.md`

## Project structure

```
reels/              Video clips and images for each reel (reel1/, reel2/, etc.)
src/                Remotion source code (compositions Claude generates)
public/             Static assets served by Remotion
out/                Rendered .mp4 files
scripts/            Transcription and batch processing scripts
whisper.cpp/        Pre-compiled whisper.cpp + cached model (from setup.command)
.claude/skills/     Reel-planner and reel-editor skills
.claude/memory/     Feedback log — user ratings teach the system
```

## Transcription

The project uses whisper.cpp for speech-to-text. The binary and model are cached locally in `whisper.cpp/` by `setup.command`. The script at `scripts/transcribe-reel.ts` handles everything automatically, including cross-platform compilation (macOS binary from setup vs Linux in Cowork sandbox).
