# Nitely Reel Editing Guide

How to use Claude + Remotion to edit Instagram Reels. No coding required.

---

## Part 1: One-Time Setup

You only do this once. After this, your daily workflow is just dragging files and chatting with Claude.

**Step 1: Install Claude Desktop**
Go to claude.ai/download and install the Claude desktop app for Mac. Sign in with your Anthropic account. Make sure Cowork mode is available.

**Step 2: Install GitHub Desktop**
Go to desktop.github.com and install GitHub Desktop. Sign in with your GitHub account. You will only ever need two buttons: Pull and Push.

**Step 3: Clone the Remotion Project**
In GitHub Desktop, click File > Clone Repository. Find `AndreaBavaro/remotion-reel-maker`. Clone it somewhere you'll remember, like `~/Documents/Remotion`.

**Step 4: Run the Setup Script**
In Finder, go to the Remotion project folder and double-click `setup.command`. This installs everything automatically: Node.js, ffmpeg, git-filter-repo, and all project dependencies. Just follow the prompts — it takes about 5 minutes.

If the script won't open, right-click it > Open > Open. macOS blocks double-click on new scripts the first time.

**Step 5: Test the Preview**
Double-click `preview.command` in the project folder. A browser window should open showing Remotion Studio. If you see the video editor interface, everything is working.

That's it for setup. You're ready to edit reels.

---

## Part 2: Your Daily Workflow

This is what you do every time you want to edit a reel. About 5 minutes of your time, then Claude does the rest.

1. **Pull** — Open GitHub Desktop, click "Pull" at the top. This syncs any changes Andrea made.
2. **Add clips** — In Finder, go to `public/reels/`, create a new folder (like `reel7`), drag your video clips and screenshots into it.
3. **Open Cowork** — Open Claude desktop app, start a Cowork session, select the Remotion project folder.
4. **Tell Claude what you want** — See example prompts below.
5. **Preview** — Double-click `preview.command`, select the reel from the sidebar, press play.
6. **Request changes** — Tell Claude what to fix in plain English.
7. **Rate the reel** — Claude will ask you to rate it 1-10 and give feedback (see Part 5).
8. **Push** — Open GitHub Desktop, type a short message (like "built reel7"), click Commit, then Push.

---

## Part 3: Creating a New Reel

### Option A: You just have raw clips (no brief)

Drop all your clips into a new folder like `public/reels/reel7/` and tell Claude:

> "Plan a reel from the clips in reel7"

Claude will scan every file, transcribe the audio, recommend visual inserts, tell you if anything is missing, create a reel plan, walk you through a review, and then build it.

### Option B: You already have a brief

If a `brief.txt` already exists in the reel folder (or Andrea wrote one), tell Claude:

> "Build reel7 using the reel-editor skill"

Claude reads the brief, matches files, analyzes durations, transcribes audio, generates the spec, walks you through a review, and builds the composition.

### Option C: Batch mode (multiple reels overnight)

If you have multiple reel folders ready and want to skip the review, run in Terminal:
```
./scripts/batch-reels.sh
```
All reels with a `brief.txt` get processed automatically. Check `out/batch-log-[date].md` the next morning.

---

## Part 4: The Collaboration Review

After Claude analyzes your clips, it walks you through 7 questions, one at a time. If everything looks good early, just say "all good" and it skips ahead.

### Q1: Hook Check
Claude shows the opening clip/line and asks if it's strong enough. **Important:** there must always be a visual cut (scene change) in the first 2 seconds — Claude enforces this automatically.

Example responses:
- "Yes that's good"
- "No, use clip 3 as the hook instead"
- "I want to re-record a punchier opening"

### Q2: Missing Media
Claude lists every file it's using and asks if you want to add anything — extra screenshots, screen recordings, B-roll.

Example responses:
- "Add the screen recording I just put in the folder"
- "I need to add proof screenshots, hold on"
- "That's everything"

### Q3: Caption Script
Claude shows the full transcription of your audio with timestamps. Captions are always generated from what you actually said.

Example responses:
- "Change Nightly to Nitely"
- "I actually said house not host"
- "Looks good"

### Q4: Text Overlays
Claude shows every bold text overlay planned for the screen (like "$100 EVERY WEEK" or "DOWNLOAD NITELY").

Example responses:
- "Make the $100 text bigger"
- "Add a WAIT TIME overlay when I say wait time"
- "Remove the last one"

### Q5: Clip Order & Pacing
Claude shows the clip sequence with durations.

Example responses:
- "Swap clips 2 and 3"
- "Clip 4 is too long, cut it to 2 seconds"
- "Order is fine"

### Q6: CTA (Call to Action)
Claude confirms the closing line.

Example responses:
- "Change it to download Nitely for a chance to win"
- "Good"

### Q7: Final Confirmation
Claude shows the updated plan with all your changes.

Example responses:
- "Build it"
- "Actually go back to Q2, I want to add one more clip"

---

## Part 5: Feedback & Rating

After every reel is finished and you're happy with the preview, Claude asks you to rate it. **This is how the system gets smarter over time** — your feedback directly changes how future reels are built.

### How it works

1. **Claude asks for a rating (1-10).** Just give a number. 1 = terrible, start over. 10 = perfect, post it now.

2. **Claude asks what worked and what didn't.** Be as specific as you can:
   - Good: "The proof montage right after the hook was fire"
   - Good: "Pacing felt right, captions were clean"
   - Bad: "The screen recording was way too long"
   - Bad: "Hook was weak, should've started with the e-transfer"
   - Bad: "Captions were too small to read on my phone"

3. **Claude saves your feedback.** It extracts a rule (like "keep screen recordings under 1.5 seconds") and saves it to a feedback file that both skills read before starting any new reel.

4. **Future reels follow your preferences.** After a few reels, the system builds up a personalized style guide from your ratings. If you said proof montages work best right after the hook, every future reel will do that by default.

### Tips for good feedback
- Be specific, not vague. "It was fine" doesn't help. "The hook was strong but the screen recording at 6 seconds felt slow" teaches the system something.
- If you just like it and have nothing to change, a quick "9/10, all good" is fine.
- You can always go back and tell Claude to adjust things before rating.

---

## Part 6: Previewing & Making Changes

### How to Preview
Double-click `preview.command` in the project folder. Remotion Studio opens in your browser. Select the reel from the left sidebar and press play.

### Making Changes
Go back to Cowork and describe what you want in plain English:

- **Timing:** "Make the hook shorter" or "Cut the first clip to 2 seconds"
- **Captions:** "The caption at 5 seconds should say Nitely not Nightly"
- **Text overlays:** "Make the DOWNLOAD NITELY text appear earlier"
- **Clip order:** "Move the screen recording before the proof images"
- **Visual inserts:** "I just added dj-clip.MOV to the folder, use it at the 6 second mark"
- **Flash cuts:** "Add a flash cut between every proof image"
- **Adding clips:** "I just added a new clip called screen-rec.MOV, rebuild with it"

### Rendering the Final Video
When happy, tell Claude: "Render reel7 to mp4." The finished video appears in the `out/` folder. AirDrop it to your phone and post.

---

## Part 7: Syncing with Your Partner

### The Simple Rule
Before you start: **Pull**. When you are done: **Commit and Push**.

### What syncs through GitHub
- `brief.txt` files (reel descriptions)
- Remotion source code (compositions Claude builds)
- Skills, settings, and feedback log (so you both have the same Claude workflow and learnings)

### What does NOT sync through GitHub
Video clips (.MOV, .mp4), audio files (.wav), and rendered output are too large for git. Share these via AirDrop, Google Drive, or a shared iCloud folder.

### Avoiding conflicts
Do not both edit the same reel at the same time. Work on different reels and you will never have issues.

### How to Pull
1. Open GitHub Desktop
2. Click "Pull origin" at the top
3. Done

### How to Push
1. Open GitHub Desktop
2. Type a short message in the Summary box (e.g. "built reel7")
3. Click "Commit to master"
4. Click "Push origin"
5. Done

---

## Part 7B: Writing a Brief

A brief is a plain text file that tells Claude exactly what reel to build. You don't need to write one if you're dropping raw clips and letting Claude plan it — but if you know what you want, a brief gets you there faster and skips the planning questions.

Save it as `brief.txt` inside the reel folder (e.g. `public/reels/reel7/brief.txt`).

### Brief format

```
=== REEL BRIEF ===

CONCEPT: [One sentence — what's this reel about?]

VIBE: [Funny / urgent / informative / aspirational / FOMO / debate-starter]

CLIPS (in order they should appear):
1. [filename or description] — [What this clip shows]
2. [filename or description] — [What this clip shows]
3. [filename or description] — [What this clip shows]

CAPTION SCRIPT: Generate from audio.

TEXT OVERLAYS:
- "[text]" appears during clip [X]

FACECAM: [yes / no]

BACKGROUND MUSIC: [filename or "none"]

CTA: [e.g. "Download Nitely for a chance to win"]

NOTES: [Anything extra — pacing, speed changes, audio continuity, energy]

=== END BRIEF ===
```

### What each field means

**CONCEPT** — One sentence describing what the reel is about. This anchors everything else.
> Example: `Show that Nitely pays real people real money every week`

**VIBE** — The emotional tone. Pick one or combine:
> `urgent` / `funny` / `informative` / `aspirational` / `FOMO` / `debate-starter`

**CLIPS** — List clips in the order you want them to appear. You don't need exact filenames — describe the clip and Claude will match the right file. If you know the filename, use it.
> Example:
> ```
> 1. facecam1.MOV — me saying "this app literally pays you to go out"
> 2. etransfer.png — $100 e-transfer proof screenshot
> 3. winner-text.png — DM from a winner saying "no way"
> 4. screen-rec.MOV — app demo, scrolling through bars
> 5. facecam2.MOV — me explaining how points work
> ```

**CAPTION SCRIPT** — Almost always leave this as `Generate from audio`. Claude transcribes your actual voice using Whisper and builds captions from that. Only write a custom script if there's no spoken audio (e.g. a music-only reel).

**TEXT OVERLAYS** — Big bold text that pops up on screen for emphasis. Optional but powerful for key moments.
> Example:
> ```
> - "$100 EVERY WEEK" appears during clip 1
> - "💰 FREE ENTRY" appears during clip 4
> - "DOWNLOAD NITELY" appears at the end
> ```

**FACECAM** — Whether any clips are talking-to-camera. Just yes or no. If yes, Claude treats those clips as full-screen with captions; other clips become visual inserts over the audio.

**BACKGROUND MUSIC** — Filename of a music track in the reel folder, or `none`. Keep it low volume — voiceover takes priority.

**CTA** — The closing call-to-action line. Always appears last.
> Example: `Download Nitely — link in bio`

**NOTES** — Anything that doesn't fit elsewhere. Common things to put here:
> - "Clips 1, 2, 3 are one continuous script — keep audio playing through the inserts"
> - "Speed up clip 4 to feel snappier"
> - "Reel should be under 20 seconds total"
> - "Use flash cuts between every clip"

### A complete example

```
=== REEL BRIEF ===

CONCEPT: Prove that Nitely pays real people $100 every week

VIBE: urgent, FOMO

CLIPS:
1. facecam1.MOV — hook: "this app literally pays you to go to bars"
2. etransfer1.png — $100 e-transfer to a winner
3. winner-text.png — DM reaction from the winner
4. facecam2.MOV — explaining how points work
5. screen-rec.MOV — screen recording of the app, submitting a bar
6. facecam3.MOV — "every point is a raffle entry, download now"

CAPTION SCRIPT: Generate from audio.

TEXT OVERLAYS:
- "💰 +$100" appears during clip 3
- "DOWNLOAD NITELY" appears during clip 6

FACECAM: yes — clips 1, 2, 4, 6 are facecam

BACKGROUND MUSIC: none

CTA: Download Nitely for a chance to win — link in bio

NOTES: Clips 1, 4, and 6 are one continuous script — audio plays through the image inserts. Keep reel under 18 seconds.

=== END BRIEF ===
```

### Tips
- You don't need perfect filenames. "the e-transfer screenshot" is enough — Claude will find the right file and confirm before building.
- The CLIPS order is the order they appear on screen. Put your strongest moment first (the hook).
- If you're not sure what to write, just drop clips in the folder and say "plan a reel from reel7" — Claude figures it all out without a brief.

---

## Part 8: Quick Reference

### Folder Structure
```
public/reels/reel1/         Raw clips, brief.txt, and generated files for each reel
src/reels/reel1/            Remotion source code Claude generates
out/                        Rendered .mp4 files ready to post
.claude/skills/             The reel-planner and reel-editor skills (do not modify)
.claude/memory/             Feedback log — your ratings teach the system (do not delete)
setup.command               Double-click to install all dependencies (one time)
preview.command             Double-click to open Remotion Studio
EDITING_GUIDE.md            This file
```

### Common Cowork Prompts
| What you want | What to say |
|---|---|
| Start from scratch | "Plan a reel from the clips in reel7" |
| Build from a brief | "Build reel7 using the reel-editor skill" |
| Review a built reel | "Review reel3 with me using the reel-editor skill" |
| Make a change | "In reel3, make the hook clip 2 seconds shorter" |
| Add new assets | "I added screen-rec.MOV to reel2, rebuild with it" |
| Render | "Render reel7 to mp4" |
| Batch all | "Build all reels that have a brief.txt" |

### Screen Recordings
When Claude asks for a screen recording, you can either:
- **One long recording** (15-20s) showing different features in order. Tell Claude roughly when each thing appears ("wait time at 3s, cover at 7s") or let it auto-detect.
- **Multiple short clips** (2-3s each) for each moment. Name them descriptively (screen-waittime.MOV, screen-cover.MOV).

### Key Rules Claude Follows Automatically
- There's always a visual cut in the first 2 seconds (no static openings)
- Flash cuts between every clip transition
- Captions are generated from your actual audio (never made up)
- Product name (Nitely) always appears last
- Text overlays use spring animations
- All content stays within Instagram safe zones
- Your past feedback ratings influence every new reel

### Troubleshooting

**setup.command won't open:** Right-click > Open > Open. macOS blocks new scripts the first time.

**Preview does not open:** Make sure you ran setup.command first. If it still fails, open Terminal and run: `cd ~/Projects/Remotion && npx remotion studio`

**Claude can't find clips:** Make sure files are in the right folder (`public/reels/reel7/` not just `public/reels/`). Check that you selected the Remotion folder when starting Cowork.

**GitHub shows a merge conflict:** You and your partner probably edited the same file. Ask Claude in Cowork to help resolve it.

**Reel looks wrong in preview:** Tell Claude exactly what's wrong ("captions are overlapping", "clip 3 plays at the wrong time"). It will fix and re-check.

**Starting over:** Tell Claude "Delete everything for reel7 and start fresh" or just create a new folder (reel8).

**Something broke after pulling:** Run `npm install` in Terminal (or double-click setup.command again). Dependencies may have been updated.
