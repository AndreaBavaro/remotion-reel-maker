import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";
import { execSync } from "child_process";

const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MODEL = "medium.en" as const;

const CLIPS = [
  { src: path.join(PUBLIC_DIR, "clip1.MOV"), wav: "/tmp/fc1.wav" },
  { src: path.join(PUBLIC_DIR, "clip2.MOV"), wav: "/tmp/fc2.wav" },
  { src: path.join(PUBLIC_DIR, "clip3.MOV"), wav: "/tmp/fc3.wav" },
  { src: path.join(PUBLIC_DIR, "clip4.MOV"), wav: "/tmp/fc4.wav" },
];

async function main() {
  console.log("Installing Whisper.cpp...");
  await installWhisperCpp({
    to: WHISPER_PATH,
    version: "1.5.5",
  });

  console.log("Downloading model...");
  await downloadWhisperModel({
    model: MODEL,
    folder: WHISPER_PATH,
  });

  // Extract audio from each clip
  for (const clip of CLIPS) {
    console.log(`Extracting audio from ${clip.src}...`);
    execSync(
      `ffmpeg -y -i "${clip.src}" -vn -ar 16000 -ac 1 "${clip.wav}"`,
      { stdio: "inherit" }
    );
  }

  // Concatenate audio files
  console.log("Concatenating audio...");
  const listFile = "/tmp/ffmpeg-concat-list.txt";
  const listContent = CLIPS.map((c) => `file '${c.wav}'`).join("\n");
  fs.writeFileSync(listFile, listContent);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listFile}" -ar 16000 -ac 1 /tmp/facecam-full.wav`,
    { stdio: "inherit" }
  );

  // Transcribe with word-level timestamps
  console.log("Transcribing...");
  const whisperCppOutput = await transcribe({
    model: MODEL,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: "1.5.5",
    inputPath: "/tmp/facecam-full.wav",
    tokenLevelTimestamps: true,
  });

  // Convert to @remotion/captions format
  const { captions } = toCaptions({ whisperCppOutput });

  // Write captions to public/ folder
  const outputPath = path.join(PUBLIC_DIR, "captions.json");
  fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2));
  console.log(`Captions generated at ${outputPath}`);
}

main().catch(console.error);
