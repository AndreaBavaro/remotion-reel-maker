import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";

const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
const MODEL = "medium.en" as const;

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

  console.log("Transcribing...");
  const whisperCppOutput = await transcribe({
    model: MODEL,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: "1.5.5",
    inputPath: "/tmp/facecam-full.wav",
    tokenLevelTimestamps: true,
  });

  const { captions } = toCaptions({ whisperCppOutput });

  const outputPath = path.join(process.cwd(), "public", "captions.json");
  fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2));
  console.log(`\nCaptions written to ${outputPath}`);
  console.log(`Total captions: ${captions.length}`);
  
  // Print word-level timestamps for debugging
  for (const c of captions) {
    console.log(`[${c.startMs}ms - ${c.endMs}ms] "${c.text}"`);
  }
}

main().catch(console.error);
