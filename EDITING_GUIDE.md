# Nitely Reel Editing Guide

Make Instagram Reels by chatting with Claude. No coding, no editing software.

---

## Setup (one time, ~10 minutes)

1. **Download Claude Desktop** — go to claude.ai/download, install it, sign in
2. **Download GitHub Desktop** — go to desktop.github.com, install it, sign in with GitHub
3. **Clone the project** — in GitHub Desktop: File > Clone Repository > search `AndreaBavaro/remotion-reel-maker` > clone it to your Desktop
4. **Run the setup script** — open the cloned folder, double-click `setup.command` (if macOS blocks it: right-click > Open > Open). Let it finish.

Done. You're ready.

---

## Making a Reel

1. Open the project folder on your Desktop
2. Go into `public/reels/` and create a new folder (like `reel7`)
3. Drag your video clips, screenshots, and any images into that folder
4. Open **Claude Desktop**, start a **Cowork** session, and select the project folder
5. Tell Claude something like:

> "I just added clips to public/reels/reel7 — plan and build a reel from them"

That's it. Claude takes over from there — it scans your clips, transcribes the audio, plans the reel, asks you a few review questions, and builds the whole thing.

---

## What Claude will ask you

Claude walks you through a quick review before building. Just answer in plain English:

- **Hook** — is the opening line strong enough?
- **Missing media** — want to add more clips or screenshots?
- **Captions** — does the transcription look right?
- **Text overlays** — any bold text you want on screen?
- **Clip order** — happy with the sequence?
- **CTA** — what's the closing call-to-action?
- **Final confirm** — say "build it" when you're good

If everything looks fine, just say "all good" and Claude skips ahead.

After the reel is built, Claude asks you to rate it 1-10 and give feedback. This teaches it your preferences for next time.

---

## Previewing

Double-click `preview.command` in the project folder. Remotion Studio opens in your browser — pick the reel from the sidebar and press play.

If you want changes, go back to Cowork and describe them:

> "Make the hook shorter"
> "Move the screen recording before the proof images"
> "The caption at 5 seconds should say Nitely not Nightly"

When you're happy, tell Claude: "Render reel7 to mp4." The video appears in the `out/` folder. AirDrop it to your phone and post.

---

## Syncing with Andrea

Before you start working: open GitHub Desktop and click **Pull**.
When you're done: type a short message, click **Commit to master**, then **Push**.

Video files don't sync through GitHub (too large). Share clips via AirDrop or Google Drive.

---

## Writing a brief (optional)

You don't need a brief — just drop clips and tell Claude to plan a reel. But if you already know what you want, save a `brief.txt` in the reel folder and Claude skips the planning step.

```
=== REEL BRIEF ===

CONCEPT: [One sentence — what's the reel about?]

VIBE: [Funny / urgent / informative / FOMO / debate-starter]

CLIPS (in order):
1. [filename or description] — [what it shows]
2. [filename or description] — [what it shows]
3. [filename or description] — [what it shows]

CAPTION SCRIPT: Generate from audio.

TEXT OVERLAYS:
- "[text]" appears during clip [X]

FACECAM: [yes / no]

BACKGROUND MUSIC: [filename or "none"]

CTA: [e.g. "Download Nitely — link in bio"]

NOTES: [Anything else — pacing, speed, energy]

=== END BRIEF ===
```

Example:

```
=== REEL BRIEF ===

CONCEPT: Prove that Nitely pays real people $100 every week

VIBE: urgent, FOMO

CLIPS:
1. facecam1.MOV — hook: "this app literally pays you to go to bars"
2. etransfer1.png — $100 e-transfer to a winner
3. winner-text.png — DM reaction from the winner
4. facecam2.MOV — explaining how points work
5. screen-rec.MOV — screen recording of the app
6. facecam3.MOV — "every point is a raffle entry, download now"

CAPTION SCRIPT: Generate from audio.

TEXT OVERLAYS:
- "+$100" appears during clip 3
- "DOWNLOAD NITELY" appears during clip 6

FACECAM: yes

BACKGROUND MUSIC: none

CTA: Download Nitely for a chance to win — link in bio

NOTES: Audio plays continuously through the image inserts. Under 18 seconds.

=== END BRIEF ===
```

You don't need exact filenames — "the e-transfer screenshot" is enough. Claude matches files automatically.

---

## Troubleshooting

**setup.command won't open** — right-click > Open > Open

**Preview won't open** — run setup.command again, or open Terminal and type: `cd ~/Desktop/remotion-reel-maker && npx remotion studio`

**Claude can't find clips** — make sure they're inside `public/reels/reel7/` not just `public/reels/`

**Something broke** — double-click setup.command again to reinstall dependencies
