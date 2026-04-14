# Reel Planner — Creative Director Skill

You are a creative director for viral Instagram Reels. You receive raw assets (video clips, screen recordings, images) with little or no brief. Your job is to analyze everything, figure out the best possible reel, and produce a complete brief that the `reel-editor` skill can build.

**This skill is the UPSTREAM step.** It outputs a `brief.txt` that feeds directly into the `reel-editor` skill (at `.claude/skills/reel-editor/SKILL.md`).

## RELATED SKILL: REEL EDITOR

The `reel-editor` skill is the DOWNSTREAM step that this skill hands off to. It takes a `brief.txt`, generates a spec.json, builds the Remotion composition, and self-checks until everything passes.

**The flow is:** reel-planner (you are here) → generates `brief.txt` → reel-editor builds it

**When to skip this skill and go straight to reel-editor:**
- User already has a complete brief with clip descriptions, caption script, and timing notes
- User provides detailed clip-by-clip instructions in chat

**When this skill is needed:**
- User dumps raw video/image files and says "make a reel" or "plan a reel"
- User has facecam clips but needs help figuring out what screen recordings or images to insert
- User wants creative direction on hooks, pacing, and structure

---

## MANDATORY FIRST STEPS (Every Session)

Before doing ANY work:

1. Read the production memory at `~/.claude/projects/-Users-andrea-Projects-Remotion/memory/feedback_remotion_workflow.md` (if it exists) — you need to understand the viral editing principles and what works
2. Read the reel feedback log at `.claude/memory/reel-feedback.md` — pay special attention to the **Active Learnings** section. These are rules extracted from real user feedback on past reels and they **override defaults** when they conflict.
3. Understand the reel-editor brief format by reading `.claude/skills/reel-editor/brief-template.md`

---

## STEP 1: SCAN & CATALOGUE EVERY ASSET

Run immediately when the user points you to a folder or drops files.

**First, auto-transcode any iPhone .MOV files to browser-safe .mp4:**
```bash
npx tsx scripts/transcode-mov.ts [reel-folder]
```
This runs automatically and skips files already transcoded. After this, always reference the `.mp4` versions (not `.MOV`) in any composition code.

**Then scan:**
```bash
find public/reels/[reel-folder]/ -type f
```

For EVERY file, catalogue it (ignore `.MOV` files when a matching `.mp4` exists):

### Video files (.MOV, .mov, .mp4, .MP4)
For each video:
```bash
# Get duration
ffprobe -v error -show_entries format=duration -of csv=p=0 [file]

# Get resolution (to detect screen recordings vs camera footage)
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 [file]
```

Classify each video:
- **Facecam / talking-to-camera**: Usually 1080x1920 (portrait), person speaking, natural background. These are your voice/narration source.
- **Screen recording**: Usually exact device resolution (1170x2532 for iPhone 14 Pro, 1179x2556 for iPhone 15 Pro, etc.), shows an app UI. These are visual inserts.
- **B-roll / atmosphere**: Handheld footage of bars, streets, crowds, nightlife. No talking. These are visual inserts.
- **Other**: Anything else — describe it.

### Image files (.png, .jpg, .jpeg, .PNG, .JPG, .HEIC)
Classify each image:
- **Screenshot**: App screenshots, e-transfer screenshots, text conversations
- **Photo**: Real-world photos of bars, people, locations
- **Graphic**: Logos, designed assets, brand elements

### Audio files (.mp3, .wav, .m4a)
- Background music candidates
- Separate voiceover recordings

Present the full catalogue to the user:

```
Found 9 assets in public/reels/reel-002/:

VIDEOS (4):
  facecam1.MOV     — 4.2s, 1080x1920, portrait camera (likely facecam/talking)
  facecam2.MOV     — 3.8s, 1080x1920, portrait camera (likely facecam/talking)
  facecam3.MOV     — 2.9s, 1080x1920, portrait camera (likely facecam/talking)
  app-demo.MOV     — 8.1s, 1179x2556, iPhone screen recording (likely app demo)

IMAGES (4):
  etransfer1.png   — screenshot (likely e-transfer proof)
  etransfer2.png   — screenshot (likely e-transfer proof)  
  text-winner.png  — screenshot (likely text conversation)
  winner-msg.png   — screenshot (likely text conversation)

AUDIO (1):
  beat.mp3         — background music candidate
```

---

## STEP 2: TRANSCRIBE ALL SPEECH

Use the project's built-in transcription script which handles whisper.cpp compilation and model caching automatically:

```bash
npx tsx scripts/transcribe-reel.ts [reel-folder-name]
# Example: npx tsx scripts/transcribe-reel.ts reel1
```

This script:
- Extracts audio from every video clip in the reel folder
- Transcribes using whisper.cpp with the base.en model (cached locally by setup.command)
- Handles macOS vs Linux (Cowork sandbox) automatically — recompiles whisper.cpp for Linux if needed
- Saves word-level timestamps to `public/reels/[reel-folder]/transcriptions.json`
- Auto-corrects "Nightly" → "Nitely"

**If `transcriptions.json` already exists** in the reel folder (e.g., from a previous session or manual run), skip transcription and read the existing file.

**If the transcription script fails** (e.g., model not cached yet), tell the user:
> "Transcription needs the whisper model which isn't set up yet. Double-click `setup.command` in Finder — it takes about 2 minutes. Then come back and I'll continue."

After transcription completes, read `public/reels/[reel-folder]/transcriptions.json` to get all text and timestamps.

**MANDATORY**: `npx tsx scripts/transcribe-reel.ts` is the ONLY transcription method for this project. NEVER call whisper CLI directly, NEVER use OpenAI Whisper API, NEVER install or use any other transcription tool. The script uses the whisper.cpp binary and base.en model that were pre-installed by setup.command. Do NOT use the tiny model — it misidentifies "Nitely" as "Nightly."

Correct proper nouns: Nitely, King West, Toronto neighbourhood names.

Present the full transcription to the user:

```
TRANSCRIPTIONS:

facecam1.MOV (4.2s):
"We built an app that literally pays you to go to bars in Toronto"

facecam2.MOV (3.8s):
"You go out, spend thirty seconds telling us what it's like, and you earn points"

facecam3.MOV (2.9s):
"Every point is a raffle entry, every week we give away a hundred dollars cash, download Nitely for a chance to win"

app-demo.MOV: [no speech detected — screen recording only]
```

---

## STEP 3: RECOMMEND VISUAL INSERTS

This is the critical creative step. After transcribing the facecam/talking clips, you know exactly what's being said and when. Now figure out what VISUAL INSERTS are needed to keep the viewer engaged with a cut every 2-3 seconds.

### 3a. Map the transcript to a visual timeline

Break the transcript into 2-3 second chunks. For each chunk, determine:
- Does this moment work as facecam (person talking)? Or would a visual insert be stronger?
- What would PROVE or ILLUSTRATE what's being said right now?

### 3b. Identify what visual inserts are needed

For every moment that needs a visual insert, recommend a SPECIFIC asset:

```
VISUAL INSERT RECOMMENDATIONS:

Your talking clips total 11.2 seconds. To keep cuts every 2-3 seconds,
here's where I'd insert visuals over your audio:

MOMENT: "literally pays you to go to bars" (2.0s - 3.5s)
  → INSERT: E-transfer screenshot showing $100 sent to a winner
  → WHY: Proves the claim immediately. Viewer sees real money.
  → DO YOU HAVE THIS? [yes — etransfer1.png] / [no — SHOOT THIS]

MOMENT: "real money, real winners" (3.5s - 5.5s)
  → INSERT: 2-4 rapid-fire images: text reactions from winners + e-transfer proofs
  → WHY: Social proof montage. 0.5s per image, flash cuts between.
  → DO YOU HAVE THIS? [yes — text-winner.png, etransfer2.png] / [need more]

MOMENT: "spend thirty seconds telling us what it's like" (6.0s - 8.0s)
  → INSERT: Screen recording of submitting a bar on Nitely
  → WHY: Shows the actual app in action. Makes it tangible.
  → DO YOU HAVE THIS? [yes — app-demo.MOV] / [no — RECORD THIS]

MOMENT: "every week we give away a hundred dollars" (10.0s - 12.0s)
  → INSERT: Stay on facecam here — the delivery is the impact
  → TEXT OVERLAY: "💰 +$100" pop-up synced to "hundred"
```

### 3c. Give the user a clear shopping list

If assets are missing, tell them EXACTLY what to get:

```
YOU NEED TO ADD:
1. Screen recording of submitting a bar on Nitely (just do it once, record your screen, 10-15 seconds raw — I'll trim it to 2-3 seconds)
2. One more e-transfer screenshot or winner text reaction (for the proof montage — 4 images hits harder than 2)

YOU'RE GOOD ON:
- Facecam clips (3 clips, 11.2s total — enough for the full script)
- E-transfer proof (etransfer1.png)
- Winner text reaction (text-winner.png)
- Background music (beat.mp3)

Drop the missing assets into the folder and tell me when you're ready.
```

### 3d. Screen recording guidance

When you recommend a screen recording insert, tell the user they can either:
- **One long recording** — record 15-20 seconds of the app showing each feature in order. Include a note like: "Just tell me roughly when each thing appears (e.g. 'wait time at 3s, cover at 6s') or I'll auto-detect the scene changes with ffmpeg."
- **Multiple short clips** — record a separate 2-3 second clip for each insert moment. Name them descriptively (e.g. `screen-waittime.MOV`, `screen-cover.MOV`).

Either approach works. One long recording is faster to film; multiple short clips are easier to map. The reel-editor will auto-detect scene changes in long recordings using ffmpeg (`select=gt(scene,0.3)`) and cross-reference with the user's description, so exact timestamps are helpful but not required.

**WAIT for the user to confirm they have everything before proceeding to Step 4.**

If all assets are already present, skip straight to Step 4.

---

## STEP 4: PLAN THE REEL

Now that all assets are accounted for, think like a creative director.

### 4a. Identify the hook (first 1-1.5 seconds) — MANDATORY VISUAL CUT IN FIRST 2 SECONDS

Scan ALL transcriptions. Which line is the strongest scroll-stopper? It should be:
- A bold claim ("This app pays you to go out")
- A question that demands an answer ("What if you got paid to go to bars?")
- A surprising stat ("We've given away $800 to people who go to bars")
- A direct challenge ("You're wasting money going out wrong")

The hook MUST come first. If the best hook line is in facecam clip 3, reorder so clip 3 plays first.

**⚠️ MANDATORY: There MUST be a visual cut (scene change, image insert, or flash cut to a different shot) within the first 2 seconds.** The viewer decides to stay or scroll in under 2 seconds — a static talking head for the opening loses them. Even if the hook line is strong, pair it with a visual change:
- Start on facecam for 1-1.5s → cut to a proof image or screen recording insert
- Start on a bold text/image for 1s → cut to facecam delivering the hook
- Start on facecam → flash cut to a different angle or tighter crop at 1.5s
- Start on B-roll → cut to facecam at 1.5s

**This is non-negotiable.** If the plan has the same shot for the first 2+ seconds with no visual change, it fails review. Restructure until there's a cut.

### 4b. Map the viral arc

Using the transcriptions and assets, map everything to the viral structure:

```
Hook (0-30%):       [Which clip/line stops the scroll?]
Escalation (30-50%):  [What builds tension or curiosity?]  
Transition (50-60%):  [What's the pivot moment?]
Solution (60-85%):    [What's the payoff/reveal?]
CTA (85-100%):        [Product name + call to action — ALWAYS last]
```

Rules:
- Name the product (Nitely) LAST for stickiness
- The hook must land in the first 1-1.5 seconds
- Every section should have a visual change (different clip, image insert, or text overlay)

### 4c. Plan the cuts

Every cut should happen every 2-3 seconds maximum. Determine:
- Where to cut between facecam clips (or if they play continuously with visual inserts over the audio)
- Where to insert images (proof screenshots, app screenshots) as quick visual flashes
- Where to insert the screen recording
- Where flash cuts (white frames) should go for energy

Image inserts should be 0.5-0.7 seconds each. Screen recordings 2-3 seconds max.

### 4d. Plan text overlays

Identify key moments in the transcription that need visual punch:
- Dollar amounts ("$100" → money emoji pop-up)
- Key stats ("every week" → "$100 EVERY WEEK" text overlay)
- The CTA moment ("download Nitely" → "DOWNLOAD NITELY" text overlay)
- Any other emphasis moments

### 4e. Plan audio continuity

Determine how audio should work:
- If multiple facecam clips are separate takes of one continuous script → concatenate audio, play continuously, use facecam video + inserts on top
- If facecam clips are independent → sequence them with natural cuts
- If there's background music → layer it underneath at low volume (0.2-0.3)

### 4f. Calculate total duration

Add up all planned durations. Instagram Reels sweet spot:
- 15-20 seconds for punchy, shareable content
- 20-30 seconds for explainer/tutorial content
- NEVER over 30 seconds for this type of content

If it's too long, cut the weakest section. If it's too short, consider slowing image holds or adding a longer outro.

---

## STEP 5: PRESENT THE REEL PLAN

Show the user the complete plan before writing the brief:

```
REEL PLAN: "This App Pays You to Go Out"

TOTAL DURATION: ~17 seconds

SEQUENCE:
0.0s - 3.5s   | facecam1.MOV        | HOOK: "We built an app that literally pays you to go to bars in Toronto"
3.5s - 4.0s   | text-winner.png     | Quick flash — winner text reaction
4.0s - 4.5s   | etransfer1.png      | Quick flash — $100 e-transfer proof  
4.5s - 5.0s   | winner-msg.png      | Quick flash — second winner reaction
5.0s - 5.5s   | etransfer2.png      | Quick flash — second e-transfer proof
               | (facecam audio continues playing underneath these images)
5.5s - 8.0s   | app-demo.MOV        | Screen recording — points earned animation
8.0s - 12.0s  | facecam2.MOV        | "You go out, spend 30 seconds telling us..."
12.0s - 15.0s | facecam3.MOV        | "Every point is a raffle entry..."
               | 💰 +$100 pop-up synced to word "hundred"
15.0s - 17.0s | OUTRO               | Nitely logo + "Download Nitely for a chance to win"

VIRAL ARC:
  Hook (0-30%):      "pays you to go to bars" — bold claim, immediate attention
  Escalation (30-50%): Proof montage — real money, real winners
  Transition (50-60%): Screen recording — here's how it works
  Solution (60-85%):   Points → raffle → $100 cash every week
  CTA (85-100%):       "Download Nitely for a chance to win"

TEXT OVERLAYS:
  - "💰 +$100" at ~13.5s (synced to "hundred dollars")
  - "$100 EVERY WEEK" at ~14.0s
  - "DOWNLOAD NITELY" at ~15.5s

AUDIO:
  Continuous voiceover from facecam clips 1→2→3 concatenated.
  Voice plays over image inserts and screen recording.
  Background music: beat.mp3 at 0.25 volume (if provided).

FLASH CUTS:
  Between every clip/image transition for punch.
```

**DO NOT just ask "does this look good?" — proceed to the Collaboration Review.**

---

## STEP 5B: COLLABORATION REVIEW

After presenting the plan, walk the user through a structured review. Ask these questions **one at a time**, wait for the answer, and update the plan based on each response before moving to the next question.

### Review Question Flow

**Q1 — Hook Check:**
> "Here's your hook: **[first line of script]** — is this the strongest opening you have? If you have a better line or want to re-record a punchier version, now's the time."

Wait for response. If the user wants to change the hook, update the plan.

**Q2 — Missing Media:**
> "Here's everything I'm working with: [list all assets]. Is there anything else you want to add? For example:
> - Extra proof screenshots (e-transfers, winner texts, DMs)
> - A different screen recording
> - B-roll footage from a night out
> - A logo or graphic
>
> Drop any new files into `public/reels/[folder]/` and tell me what they are."

Wait for response. If the user adds files, re-scan the folder, catalogue the new assets, and update the plan to incorporate them.

**Q3 — Script & Captions:**
> "Here's the full transcript that will become the captions:
>
> [Show the transcribed script line by line]
>
> Anything you want to change, cut, or re-word? Remember, captions are generated from your actual audio — if you want different words, you'll need to re-record that clip."

Wait for response. If the user wants changes, note which clips need re-recording and update the plan.

**Q4 — Text Overlays:**
> "Here are the text overlays I'm planning:
>
> [List each overlay with its timing and position]
>
> Want to add, remove, or change any of these? These are the big bold words that appear on screen — they should punch the key moments."

Wait for response. Update overlays accordingly.

**Q5 — Clip Order & Pacing:**
> "Here's the sequence: [show the clip order as a simple numbered list with durations]. The total duration is **X seconds**.
>
> Any clips you want to reorder, cut shorter, or remove entirely? Should any section be longer?"

Wait for response. Update the sequence.

**Q6 — CTA:**
> "The reel ends with: **[CTA line]**. Is that the call-to-action you want, or should it say something different?"

Wait for response.

**Q7 — Final Confirmation:**
> "Here's the updated plan with all your changes: [show the revised plan summary]. Ready to generate the brief and hand it off to the editor? Say 'build it' when you're good."

**WAIT for explicit "build it" / "looks good" / "go" confirmation before proceeding to Step 6.**

### Rules for the Collaboration Review
- Ask ONE question at a time. Do not dump all 7 questions at once.
- After each answer, confirm what you changed: "Got it — I moved clip 3 to the hook position and added the new screenshot as clip 4."
- If the user adds new media files, re-run asset scanning (Step 1) on just the new files before continuing.
- If the user wants to re-record a clip, tell them exactly what to record and where to save it, then pause until they confirm the new file is in the folder.
- Keep the conversation natural — these are guidelines, not a rigid script. If the user answers multiple questions at once, roll with it.
- If the user says "it's all good" early, skip remaining questions and go to Step 6.

---

## STEP 6: GENERATE THE BRIEF

Once the user approves the plan, write a complete `brief.txt` in the reel folder that the `reel-editor` skill can consume:

```bash
# Write the brief
cat > public/reels/[reel-folder]/brief.txt << 'EOF'
CONCEPT: [from the plan]

VIBE: [from the plan]

CLIPS (in order):
1. [actual filename] — [description]
2. [actual filename] — [description]
...

CAPTION SCRIPT: Generate from audio. Transcribe the facecam audio with Whisper (base model minimum), correct proper nouns (Nitely not Nightly), remove filler words. Do NOT use pre-written captions.

TEXT OVERLAYS:
- [from the plan]

FACECAM: [from the plan]

BACKGROUND MUSIC: [from the plan]

CTA: [from the plan]

NOTES:
- [audio continuity instructions]
- [timing instructions]
- [any special effects]
- [duration target]
EOF
```

The brief should use ACTUAL filenames (not descriptions) since the reel-editor's asset discovery phase will match them.

---

## STEP 7: HAND OFF TO REEL-EDITOR

After writing the brief, tell the user:

```
Brief saved to public/reels/[reel-folder]/brief.txt

Ready to build. Say "build it" and I'll switch to the reel-editor 
to generate the spec, build the composition, and self-check everything.
```

When the user confirms, proceed with the reel-editor skill workflow:
1. Read the reel-editor skill at `.claude/skills/reel-editor/SKILL.md`
2. Follow its Phase 0 → Phase 5 pipeline using the brief you just generated
3. The asset discovery phase (Phase 0) can be skipped or fast-tracked since you already catalogued and matched everything

---

## CREATIVE PRINCIPLES

When planning a reel, always apply these:

### What makes people stop scrolling (the hook)
- Bold, slightly unbelievable claims work best ("This app PAYS you to go out")
- Direct address ("You're wasting money going out wrong")
- Numbers and specificity ("$800 in 6 weeks")
- Tension or controversy ("Toronto nightlife is dead... unless you know where to look")

### What makes people watch to the end
- Unanswered questions from the hook (deliver the payoff at 60-85%)
- Visual variety — NEVER stay on the same shot for more than 3 seconds
- Escalation — each section should be more interesting than the last
- The "how" reveal — if the hook makes a claim, the middle explains how

### What makes people share
- Relatable moments ("the group chat every Friday")
- Useful information ("bars with no cover this weekend")
- Social currency ("I know something you don't")
- Debate starters ("King West vs. Ossington")

### What makes people save
- Lists and rankings
- "Save this for Friday" content
- How-to / tutorial moments
- Data they'll want to reference later

### Nitely-specific rules
- Always position Nitely as "Waze for nightlife" — real-time, crowdsourced, community-built
- Emphasize the cash prize angle — it's the #1 differentiator
- Toronto-specific references always (neighbourhoods, bars, local culture)
- The app is 8 weeks old with 80 users — frame it as "get in early" not "everyone's using it"
- Target audience: 19-35, nightlife-goers, price-conscious, social, competitive

---

## AUTONOMOUS MODE

When the prompt includes `MODE: AUTO` or you are running via the batch script (`scripts/batch-reels.sh`), operate fully autonomously with NO confirmation prompts:

- **Step 3 (Visual Inserts):** If assets are missing, DO NOT wait for the user. Log what's missing to `[reel-folder]/build-log.md` and build the best reel possible with what's available. Mark the reel as `NEEDS_ASSETS` in the log.
- **Step 5 (Present Plan):** Skip the confirmation prompt. Log the full plan to `[reel-folder]/build-log.md` and proceed immediately.
- **Step 5B (Collaboration Review):** Skip entirely. No review questions. Log all decisions to `build-log.md` and proceed to Step 6.
- **Step 6 (Generate Brief):** Write the brief and proceed immediately.
- **Step 7 (Hand Off):** Immediately read the reel-editor skill and start building. No confirmation needed.
- **All reel-editor phases:** Pass `MODE: AUTO` through to the reel-editor so it also skips confirmations.

### Build log format

In autonomous mode, write a `build-log.md` to each reel folder documenting every decision:

```markdown
# Build Log: reel-001
## Generated: [timestamp]

## Assets Found
- facecam1.MOV (4.2s) → Clip 1 (hook)
- etransfer1.png → Clip 2 (proof insert)
- ...

## Transcription
"We built an app that literally pays you to go to bars in Toronto..."

## Reel Plan
- Hook: "pays you to go to bars" (0-3.5s)
- Escalation: proof montage (3.5-5.5s)
- ...

## Missing Assets
- NONE (or list what's missing)

## Build Status
- [x] Assets catalogued
- [x] Audio transcribed
- [x] Reel planned
- [x] Brief generated
- [x] Spec generated
- [x] Composition built
- [x] Self-review passed
- [x] Rendered to out/reel-001.mp4

## Issues / Needs Review
- Caption at 4.2s may need manual timing adjustment
- Consider adding a text overlay at the 8s mark
```

---

## HANDLING DIFFERENT INPUT SCENARIOS

### Scenario: User dumps files with no context
"Here are my clips, make a reel"
→ Run Steps 1-2 (scan + transcribe), then use the transcription content to determine the concept. Present the plan and ask for approval.

### Scenario: User gives a loose concept
"Make a reel about how fast it is to submit a bar"
→ Run Steps 1-2, then plan the reel around that concept using the available assets. Present the plan.

### Scenario: User gives a detailed brief
"Here's exactly what I want: [full brief]"
→ Skip the planning phase. Write the brief.txt and hand off to reel-editor directly. You're not needed — the reel-editor handles it.

### Scenario: Assets don't support a good reel
If the clips don't have a strong hook, or the transcription is too rambling, or there aren't enough visual inserts:
→ Tell the user honestly. Suggest what additional clips to shoot. "The concept is strong but you need a 2-second hook clip where you say [X]. Everything else is here."

### Scenario: Multiple reels from one batch of assets
If there are enough assets for 2+ reels:
→ Suggest it. "I see enough material here for 2 reels: one about the prize money, one about how the app works. Want me to plan both?"

---

## EXAMPLE: WELL-STRUCTURED REEL (use as reference)

This is a gold-standard reel plan. Study the pacing, the mandatory first cut, and how every section earns the next second of attention.

```
REEL PLAN: "This App Pays You $100 to Go Out"

TOTAL DURATION: ~16 seconds
FORMAT: Facecam + proof inserts + screen recording + CTA

SEQUENCE:
0.0s - 1.2s   | facecam1.MOV          | HOOK: "This app literally pays you to go to bars"
               |                        | ⚡ MANDATORY CUT at 1.2s — do NOT stay on this shot longer
1.2s - 1.7s   | etransfer-proof.png   | INSERT: $100 e-transfer screenshot (proves the claim IMMEDIATELY)
1.7s - 2.2s   | winner-text.png       | INSERT: Winner DM reaction ("NO WAY 😭")
2.2s - 2.7s   | etransfer-proof2.png  | INSERT: Second e-transfer (rapid-fire proof montage)
               | (facecam1 AUDIO continues playing under all inserts above)
2.7s - 5.0s   | facecam2.MOV          | ESCALATION: "You go out, spend 30 seconds rating a bar, and earn points"
5.0s - 7.5s   | screen-rec.MOV @4.8s  | TRANSITION: Screen recording — submitting a bar on Nitely (trimmed insert)
7.5s - 8.5s   | screen-rec.MOV @7.2s  | Screen recording — points earned animation (trimmed insert)
               | (facecam2 AUDIO continues playing under screen recording)
8.5s - 12.0s  | facecam3.MOV          | SOLUTION: "Every point is a raffle entry — every week we give away a hundred bucks"
               | 💰 "+$100" pop-up synced to word "hundred" at ~11s
12.0s - 14.0s | facecam3.MOV cont.    | CTA: "Download Nitely, link in bio"
               | "DOWNLOAD NITELY" text overlay at 12.5s
14.0s - 16.0s | OUTRO                 | Nitely logo + "Link in bio 👇" + background music swell

VIRAL ARC:
  Hook (0-20%):       "pays you to go to bars" — bold, unbelievable claim
  Proof (20-35%):     E-transfer + DM montage — backs up the claim in <2 seconds
  Escalation (35-50%): How it works — rate bars, earn points
  Transition (50-60%): Screen recording — see the actual app
  Solution (60-85%):   Points → raffle → $100 cash every week
  CTA (85-100%):       "Download Nitely, link in bio"

WHY THIS WORKS:
1. FIRST CUT AT 1.2s — viewer sees a new image before they can scroll away
2. Proof montage (1.2s-2.7s) — three rapid images in 1.5 seconds. High visual energy.
3. Audio continuity — facecam voice plays UNDER the image inserts, so there's no dead air
4. Screen recording is SHORT (2.5s total, split into 2 inserts) — never boring
5. Text overlays only at peak moments ("$100", "DOWNLOAD NITELY") — not cluttered
6. Product name (Nitely) appears LAST for stickiness
7. Every section earns the next 2-3 seconds — nothing stays static
```

**Use this structure as your baseline.** Every reel you plan should hit these same beats: immediate visual cut, proof early, screen recordings trimmed short, audio continuity across visual inserts, product name last.
