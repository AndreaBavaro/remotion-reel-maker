# Reel Brief Template

## Single reel
Copy, fill in, and paste into Claude Code.

## Batch mode
Save as `brief.txt` inside each reel folder (e.g. `public/reels/reel-001/brief.txt`), then tell Claude "process all reels in the queue."

## File naming
You do NOT need to use exact filenames. Describe what each clip is and Claude will scan the reel folder, match files to your descriptions, and confirm before building. Use whatever names make sense to you.

```
=== REEL BRIEF ===

CONCEPT: [One sentence — what's this reel about?]

VIBE: [Funny / urgent / informative / aspirational / FOMO / debate-starter]

CLIPS (in order they should appear):
1. [filename or description] — [What this shows. Be specific.]
2. [filename or description] — [What this shows]
3. [filename or description] — [What this shows]
(add more as needed — use exact filenames if you know them, or just describe the clip)

CAPTION SCRIPT: Generate from audio. Transcribe the facecam/voiceover audio with Whisper.

TEXT OVERLAYS (big punch text that pops up, optional):
- "[text]" appears during clip [X]

FACECAM: [yes/no — if yes, which clips are full-screen talking-to-camera vs PiP overlay?]

BACKGROUND MUSIC: [filename or "none"]

CTA: [e.g. "Download Nitely for a chance to win"]

NOTES: [Any extra details — audio continuity, speed changes, timing, energy, etc.]

=== END BRIEF ===
```
