import fs from "fs";
import path from "path";

type Clip = { file: string; durationFrames: number; offsetMs: number };

type Plan = {
  reel: string;
  hookText: string;
  ctaText: string;
  clips: Clip[];
};

const FPS = 30;

// Corrections applied on transcript text
const correct = (s: string) =>
  s
    .replace(/\bnightly\b/gi, "Nitely")
    .replace(/\bNight ly\b/g, "Nitely")
    .replace(/\bawful\b/g, "raffle");

const plans: Plan[] = [
  {
    reel: "reel2",
    hookText: "HE WON $100\nAT A BAR",
    ctaText: "Download Nitely\nLink in bio 👇",
    clips: [
      { file: "IMG_2671.MOV", durationFrames: 135, offsetMs: 0 },
      { file: "IMG_2672.MOV", durationFrames: 210, offsetMs: 4500 },
      { file: "IMG_2673.MOV", durationFrames: 144, offsetMs: 11500 },
      { file: "IMG_2677.MOV", durationFrames: 156, offsetMs: 16300 },
      { file: "IMG_2678.MOV", durationFrames: 170, offsetMs: 21500 },
    ],
  },
  {
    reel: "reel3",
    hookText: "KING WEST\nLAST FRIDAY",
    ctaText: "Download Nitely\nKnow before you go",
    clips: [
      { file: "IMG_2679.MOV", durationFrames: 120, offsetMs: 0 },
      { file: "IMG_2683.MOV", durationFrames: 255, offsetMs: 4000 },
      { file: "IMG_2684.MOV", durationFrames: 186, offsetMs: 12500 },
    ],
  },
  {
    reel: "reel4",
    hookText: "THE GROUP CHAT\nCAN'T DECIDE",
    ctaText: "Download Nitely\nLink in bio 👇",
    clips: [
      { file: "IMG_2685.MOV", durationFrames: 210, offsetMs: 0 },
      { file: "IMG_2687.MOV", durationFrames: 66, offsetMs: 7000 },
      { file: "IMG_2688.MOV", durationFrames: 75, offsetMs: 9200 },
    ],
  },
  {
    reel: "reel5",
    hookText: "$100 EVERY\nFRIDAY. CASH.",
    ctaText: "Download Nitely\nLink in bio 👇",
    clips: [
      { file: "IMG_2689.MOV", durationFrames: 171, offsetMs: 0 },
      { file: "IMG_2691.MOV", durationFrames: 291, offsetMs: 5700 },
      { file: "IMG_2695.MOV", durationFrames: 279, offsetMs: 15400 },
    ],
  },
];

// filler words removed from captions
const FILLERS = new Set([
  "um",
  "uh",
  "like",
  "so",
  "basically",
  "-",
]);

function buildCaptions(plan: Plan) {
  const transPath = path.join("reels", plan.reel, "transcriptions.json");
  const data = JSON.parse(fs.readFileSync(transPath, "utf8"));
  const out: Array<{ text: string; startMs: number; endMs: number; timestampMs: number; confidence: number }> = [];
  for (const clip of plan.clips) {
    const entry = data[clip.file];
    if (!entry) throw new Error(`missing ${clip.file}`);
    const maxMs = (clip.durationFrames / FPS) * 1000;
    for (const cap of entry.captions ?? []) {
      const trimmedText = cap.text.trim().replace(/[.,]+$/, "");
      if (!trimmedText) continue;
      if (FILLERS.has(trimmedText.toLowerCase())) continue;
      if (cap.startMs >= maxMs) continue;
      const text = correct(cap.text);
      const startMs = clip.offsetMs + cap.startMs;
      const endMs = clip.offsetMs + Math.min(cap.endMs, maxMs);
      out.push({ text, startMs, endMs, timestampMs: startMs, confidence: 1 });
    }
  }
  return out;
}

for (const plan of plans) {
  const captions = buildCaptions(plan);
  const totalFrames =
    plan.clips.reduce((s, c) => s + c.durationFrames, 0) + 60; // 60 = end card

  const timing = `// AUTO-GENERATED from scripts/build-reel-data.ts
export const END_CARD_FRAMES = 60;
export const CLIPS = ${JSON.stringify(
    plan.clips.map((c) => ({
      src: `reels/${plan.reel}/${c.file.replace(/\.MOV$/i, ".mp4")}`,
      durationInFrames: c.durationFrames,
    })),
    null,
    2
  )} as const;
export const TOTAL_FRAMES = ${totalFrames};
`;

  const capsFile = `// AUTO-GENERATED from scripts/build-reel-data.ts
import type { Caption } from "@remotion/captions";

export const CAPTIONS: Caption[] = ${JSON.stringify(captions, null, 2)};
`;

  const compFile = `import React from "react";
import { SimpleReel } from "../shared/SimpleReel";
import { CLIPS, END_CARD_FRAMES } from "./timing";
import { CAPTIONS } from "./captions";

const HOOK_TEXT = ${JSON.stringify(plan.hookText)};
const CTA_TEXT = ${JSON.stringify(plan.ctaText)};

export const ${plan.reel.charAt(0).toUpperCase() + plan.reel.slice(1)}: React.FC = () => {
  return (
    <SimpleReel
      clips={CLIPS as unknown as { src: string; durationInFrames: number }[]}
      captions={CAPTIONS}
      hookText={HOOK_TEXT}
      ctaText={CTA_TEXT}
      endCardFrames={END_CARD_FRAMES}
    />
  );
};
`;

  const dir = path.join("src", "reels", plan.reel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "timing.ts"), timing);
  fs.writeFileSync(path.join(dir, "captions.ts"), capsFile);
  const compName = plan.reel.charAt(0).toUpperCase() + plan.reel.slice(1);
  fs.writeFileSync(path.join(dir, `${compName}.tsx`), compFile);
  console.log(`✓ ${plan.reel}: ${captions.length} captions, ${totalFrames} frames (${(totalFrames / FPS).toFixed(1)}s)`);
}
