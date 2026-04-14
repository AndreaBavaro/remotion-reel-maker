/**
 * Auto-transcode all .MOV files in a reel folder to browser-safe H.264 .mp4.
 *
 * Usage:
 *   npx tsx scripts/transcode-mov.ts <reel-folder>
 *   npx tsx scripts/transcode-mov.ts reel1
 *
 * - Skips files that already have a matching .mp4
 * - Original .MOV files are kept (gitignored anyway)
 * - The reel-editor skill should always reference the .mp4 versions
 */

import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export function transcodeMovFiles(reelPath: string): void {
  const files = fs.readdirSync(reelPath);
  const movFiles = files.filter((f) => /\.MOV$/i.test(f));

  if (movFiles.length === 0) {
    console.log("No .MOV files to transcode.");
    return;
  }

  for (const mov of movFiles) {
    const base = path.basename(mov, path.extname(mov));
    const mp4Name = `${base}.mp4`;
    const movPath = path.join(reelPath, mov);
    const mp4Path = path.join(reelPath, mp4Name);

    // Skip if .mp4 already exists and is newer than the .MOV
    if (fs.existsSync(mp4Path)) {
      const movMtime = fs.statSync(movPath).mtimeMs;
      const mp4Mtime = fs.statSync(mp4Path).mtimeMs;
      if (mp4Mtime >= movMtime) {
        console.log(`  ✓ ${mp4Name} already exists, skipping`);
        continue;
      }
    }

    console.log(`  → Transcoding ${mov} → ${mp4Name}...`);
    try {
      execSync(
        `ffmpeg -y -i "${movPath}" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -movflags +faststart "${mp4Path}"`,
        { stdio: "pipe" }
      );
      console.log(`  ✓ ${mp4Name}`);
    } catch (err: any) {
      console.error(`  ✗ Failed to transcode ${mov}: ${err.message}`);
    }
  }
}

// CLI entry point
if (require.main === module) {
  const reelFolder = process.argv[2];

  if (!reelFolder) {
    console.error("Usage: npx tsx scripts/transcode-mov.ts <reel-folder>");
    process.exit(1);
  }

  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const reelPath = path.join(projectRoot, "public", "reels", reelFolder);

  if (!fs.existsSync(reelPath)) {
    console.error(`Reel folder not found: ${reelPath}`);
    process.exit(1);
  }

  console.log(`Transcoding .MOV files in ${reelPath}...`);
  transcodeMovFiles(reelPath);
  console.log("Done.");
}
