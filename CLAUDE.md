# Nitely Reel Maker

This is a Remotion project for creating Instagram Reels for the Nitely app. The user drops video clips (and optionally images) into folders under `public/reels/`, then asks Claude to plan and build the reel.

---

## STRICT RULES — READ BEFORE DOING ANYTHING

These rules are non-negotiable. Every single action you take MUST follow them. If a rule conflicts with your general knowledge, the rule wins. Do not improvise, do not find alternatives, do not "try a different approach." The project is fully set up — just follow the pipeline.

### Pipeline order (never skip or reorder steps)
1. Read the skill files (listed below)
2. Transcode with `npx tsx scripts/transcode-mov.ts [folder]`
3. Transcribe with `npx tsx scripts/transcribe-reel.ts [folder]`
4. Follow the reel-planner skill exactly
5. Follow the reel-editor skill exactly

### Tools — use ONLY what's in this project
- **Transcode**: `npx tsx scripts/transcode-mov.ts [folder]` — the ONLY way to convert video. Do NOT use ffmpeg directly for transcoding. Do NOT skip this step.
- **Transcribe**: `npx tsx scripts/transcribe-reel.ts [folder]` — the ONLY way to transcribe. Do NOT call whisper CLI directly. Do NOT use OpenAI Whisper API. Do NOT use any cloud service. Do NOT install or download any other transcription tool. The whisper.cpp binary and base.en model are pre-installed by setup.command.
- **Video references**: ALWAYS use `.mp4` files in Remotion compositions. NEVER reference `.MOV` files in code — browsers cannot play HEVC.
- **Whisper model**: NEVER use tiny model. The project uses base.en. The script handles this automatically.

### Things that WILL break if you ignore them
- Referencing `.MOV` in a `<Video>` or `<OffthreadVideo>` tag → MEDIA_ELEMENT_ERROR in browser
- Calling `whisper` directly → binary not found or wrong model
- Installing packages not in package.json → breaks reproducibility
- Skipping the transcode step → format errors in preview
- Making up captions instead of transcribing → wrong words, wrong timing
- Putting content in top 180px or bottom 270px → hidden by Instagram UI

### Do NOT
- Install new npm packages (everything needed is in package.json)
- Use `pip`, `brew`, or any package manager to install tools
- Write your own transcription/transcode logic
- Skip reading the skill files
- Make creative decisions that contradict the skill files
- Change the project structure or move files around

---

## How to respond when a user opens this project

The user may be non-technical — keep everything simple, no jargon. When they mention editing, planning, or building a reel, follow the workflow automatically.

## Detecting what the user wants

| User says | What to do |
|---|---|
| "edit reel1" / "plan a reel from reel1" / "make a reel" | Run the **single reel** workflow below |
| "edit all reels" / "build everything" / "process all" | Run the **batch** workflow below |
| "I added new clips to reel3" / "rebuild reel3" | Re-run the single reel workflow for that folder |
| "change the hook" / "make clip 2 shorter" / etc. | Make the edit to the existing composition |
| "render reel1" | Render with `npx remotion render` |

## Single reel workflow

1. **Read the skills first** (mandatory — do this EVERY time, even if you think you remember them):
   - Read `.claude/skills/reel-planner/SKILL.md`
   - Read `.claude/skills/reel-editor/SKILL.md`
   - Read `.claude/memory/reel-feedback.md` (Active Learnings section)
   - Read the relevant Remotion best-practices rules from `skills/remotion-best-practices/`

2. **Transcode**: Run `npx tsx scripts/transcode-mov.ts [folder]`

3. **Scan the reel folder**: List all files in `public/reels/[folder]/` with ffprobe durations (use the `.mp4` files, not `.MOV`)

4. **Transcribe**: Run `npx tsx scripts/transcribe-reel.ts [folder]`
   - If it fails because the whisper model isn't cached, tell the user: "Double-click setup.command in Finder first — it takes 2 minutes to download the speech model. Then come back."
   - If `transcriptions.json` already exists, skip and read it

5. **Follow the reel-planner skill** steps 1-7 (scan, transcribe, recommend inserts, plan, collaboration review, generate brief, hand off to editor)

6. **Follow the reel-editor skill** phases 0-6 (asset discovery, analysis, spec, build, self-review, feedback)

## Batch workflow (edit all reels)

For every folder in `public/reels/` that contains video files:
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
public/reels/       Video clips and images for each reel (reel1/, reel2/, etc.)
src/                Remotion source code (compositions Claude generates)
out/                Rendered .mp4 files
scripts/            Transcription and batch processing scripts
whisper.cpp/        Pre-compiled whisper.cpp + cached model (from setup.command)
.claude/skills/     Reel-planner and reel-editor skills
.claude/memory/     Feedback log — user ratings teach the system
```
