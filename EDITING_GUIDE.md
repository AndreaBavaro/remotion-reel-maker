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
In GitHub Desktop, click File > Clone Repository. Find the Nitely Remotion repo (Andrea will share the link). Clone it somewhere you will remember, like `~/Documents/Remotion`.

**Step 4: Install Node.js**
Go to nodejs.org and download the LTS version for Mac. Install it.

**Step 5: Install Project Dependencies (one time only)**
Open Terminal (search "Terminal" in Spotlight). Type this and press Enter:
```
cd ~/Documents/Remotion && npm install
```
Replace the path with wherever you cloned the project. Wait for it to finish. You can close Terminal after this.

**Step 6: Test the Preview**
In Finder, go to the Remotion project folder and double-click `preview.command`. A browser window should open showing Remotion Studio. If you see the video editor interface, everything is working.

---

## Part 2: Your Daily Workflow

This is what you do every time you want to edit a reel. About 5 minutes of your time, then Claude does the rest.

1. **Pull** — Open GitHub Desktop, click "Pull" at the top. This syncs any changes Andrea made.
2. **Add clips** — In Finder, go to `public/reels/`, create a new folder (like `reel7`), drag your video clips and screenshots into it.
3. **Open Cowork** — Open Claude desktop app, start a Cowork session, select the Remotion project folder.
4. **Tell Claude what you want** — See example prompts below.
5. **Preview** — Double-click `preview.command`, select the reel from the sidebar, press play.
6. **Request changes** — Tell Claude what to fix in plain English.
7. **Push** — Open GitHub Desktop, type a short message (like "built reel7"), click Commit, then Push.

---

## Part 3: Creating a New Reel

### Option A: You just have raw clips (no brief)

Drop all your clips into a new folder like `public/reels/reel7/` and tell Claude:

> "Plan a reel from the clips in reel7"

Claude will scan every file, transcribe the audio, recommend visual inserts, tell you if anything is missing, create a reel plan, walk you through a review, and then build it.

### Option B: You already have a brief

If a `brief.txt` already exists in the reel folder, tell Claude:

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
Claude shows the opening clip/line and asks if it is strong enough.

Example responses:
- "Yes that is good"
- "No, use clip 3 as the hook instead"
- "I want to re-record a punchier opening"

### Q2: Missing Media
Claude lists every file it is using and asks if you want to add anything — extra screenshots, screen recordings, B-roll.

Example responses:
- "Add the screen recording I just put in the folder"
- "I need to add proof screenshots, hold on"
- "That is everything"

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

## Part 5: Previewing & Making Changes

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

## Part 6: Syncing with Your Partner

### The Simple Rule
Before you start: **Pull**. When you are done: **Commit and Push**.

### What syncs through GitHub
- `brief.txt` files (reel descriptions)
- Remotion source code (compositions Claude builds)
- Skills and settings (so you both have the same Claude workflow)

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
3. Click "Commit to main"
4. Click "Push origin"
5. Done

---

## Part 7: Quick Reference

### Folder Structure
```
public/reels/reel1/     Raw clips, brief.txt, and generated files for each reel
src/reels/reel1/         Remotion source code Claude generates
out/                     Rendered .mp4 files ready to post
.claude/skills/          The reel-planner and reel-editor skills (do not modify)
preview.command          Double-click to open Remotion Studio
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

### Troubleshooting

**Preview does not open:** Make sure you ran `npm install` (Part 1, Step 5). If it still fails, open Terminal and run: `cd ~/Documents/Remotion && npx remotion studio`

**Claude cannot find clips:** Make sure files are in the right folder (`public/reels/reel7/` not just `public/reels/`). Check that you selected the Remotion folder when starting Cowork.

**GitHub shows a merge conflict:** You and your partner probably edited the same file. Ask Claude in Cowork to help resolve it.

**Reel looks wrong in preview:** Tell Claude exactly what is wrong ("captions are overlapping", "clip 3 plays at the wrong time"). It will fix and re-check.

**Starting over:** Tell Claude "Delete everything for reel7 and start fresh" or just create a new folder (reel8).
