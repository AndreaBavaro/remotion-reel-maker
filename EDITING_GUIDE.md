# How to Edit Reels

---

## First Time Setup

**1. Download these two apps:**
- Claude Desktop — claude.ai/download
- GitHub Desktop — desktop.github.com

Sign into both. For GitHub Desktop you need a GitHub account (github.com — free to sign up).

**2. Get the project onto your computer:**
- Open GitHub Desktop
- Click File > Clone Repository
- Search for `AndreaBavaro/remotion-reel-maker`
- For "Local Path" pick your Desktop
- Click Clone

You now have a folder called `remotion-reel-maker` on your Desktop.

**3. Install the tools:**
- Open that folder
- Double-click `setup.command`
- If Mac says it can't be opened: right-click it > Open > Open
- Wait for it to finish (about 5 minutes)

You're done with setup. You never have to do this again.

---

## Making a Reel

**1.** Open the `remotion-reel-maker` folder on your Desktop

**2.** Go into `public` > `reels` and make a new folder (name it whatever you want, like `reel7`)

**3.** Drag your video clips and screenshots into that folder

**4.** Open Claude Desktop

**5.** Start a Cowork session and when it asks you to pick a folder, pick the `remotion-reel-maker` folder on your Desktop

**6.** Type something like:

> I just added videos to public/reels/reel7 — make a reel out of them

**7.** Claude handles everything from there. It'll ask you a few questions (is the opening strong enough, want to add anything, etc). Just answer in plain English.

**8.** When it's done, double-click `preview.command` in the project folder to watch it. If you want changes, go back to Claude and tell it what to fix.

**9.** When you're happy, tell Claude "render it" and it saves the final video to the `out` folder. AirDrop it to your phone and post.

---

## Syncing with Andrea

Before you start: open GitHub Desktop and click **Pull** (top of the screen).

When you're done: type a short message at the bottom left (like "built reel7"), click **Commit to master**, then click **Push origin** at the top.

Video files are too big for GitHub. Share them with Andrea over AirDrop or Google Drive.

---

## If Something Goes Wrong

**setup.command won't open** — right-click it > Open > Open

**Preview won't open** — double-click setup.command again

**Claude can't find your clips** — make sure they're inside a folder in `public/reels/`, not just loose in the project
