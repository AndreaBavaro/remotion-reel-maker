import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";
import { execSync } from "child_process";
import os from "os";

const MODEL = "base.en" as const;

interface TranscriptionResult {
  [filename: string]: {
    duration: number;
    text: string;
    captions: Array<{
      text: string;
      startMs: number;
      endMs: number;
    }>;
  };
}

async function ensureWhisperBinary(whisperPath: string): Promise<string> {
  const macBinary = path.join(whisperPath, "main");
  const isLinux = process.platform === "linux";

  // If macOS binary exists and we're on Linux, recompile for Linux
  if (fs.existsSync(macBinary) && isLinux) {
    console.log(
      "macOS binary detected but running on Linux. Recompiling for Linux..."
    );
    const linuxBuildDir = "/tmp/whisper-linux";

    // Clean and create build directory
    if (fs.existsSync(linuxBuildDir)) {
      fs.rmSync(linuxBuildDir, { recursive: true });
    }
    fs.mkdirSync(linuxBuildDir, { recursive: true });

    // Copy source to build directory
    execSync(`cp -r "${whisperPath}"/* "${linuxBuildDir}"/`, {
      stdio: "inherit",
    });

    // Compile
    console.log("Compiling whisper.cpp for Linux...");
    execSync(`cd "${linuxBuildDir}" && make clean && make -j4`, { stdio: "inherit" });

    return path.join(linuxBuildDir, "main");
  }

  // If on macOS and binary exists, use it directly
  if (fs.existsSync(macBinary) && !isLinux) {
    console.log("Using existing macOS whisper.cpp binary");
    return macBinary;
  }

  // Otherwise, install whisper.cpp
  console.log("Installing Whisper.cpp...");
  await installWhisperCpp({
    to: whisperPath,
    version: "1.5.5",
  });

  return path.join(whisperPath, "main");
}

function correctNightly(text: string): string {
  return text.replace(/\bNightly\b/g, "Nitely");
}

async function main() {
  const reelFolder = process.argv[2];

  if (!reelFolder) {
    console.error("Please provide a reel folder name as argument");
    console.error("Usage: ts-node transcribe-reel.ts <folder-name>");
    process.exit(1);
  }

  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  process.chdir(os.tmpdir());
  const whisperPath = path.join(projectRoot, "whisper.cpp");
  const reelPath = path.join(projectRoot, "reels", reelFolder);
  const outputPath = path.join(reelPath, "transcriptions.json");

  // Verify reel folder exists
  if (!fs.existsSync(reelPath)) {
    console.error(`Reel folder not found: ${reelPath}`);
    process.exit(1);
  }

  // Find all video files (MOV and mp4)
  const videoFiles = fs
    .readdirSync(reelPath)
    .filter((file) => /\.(MOV|mp4)$/i.test(file))
    .map((file) => path.join(reelPath, file));

  if (videoFiles.length === 0) {
    console.error(`No video files found in ${reelPath}`);
    process.exit(1);
  }

  console.log(`Found ${videoFiles.length} video file(s) to transcribe`);

  // Ensure whisper binary exists (compiled for current platform if needed)
  const whisperBinary = await ensureWhisperBinary(whisperPath);

  // Download model if not already present
  const modelPath = path.join(whisperPath, "models", "ggml-base.en.bin");
  if (!fs.existsSync(modelPath)) {
    console.log("Downloading model...");
    await downloadWhisperModel({
      model: MODEL,
      folder: whisperPath,
    });
  } else {
    console.log("Model already cached");
  }

  const results: TranscriptionResult = {};

  // Process each video file
  for (const videoFile of videoFiles) {
    const filename = path.basename(videoFile);
    console.log(`\nProcessing ${filename}...`);

    // Extract audio from video
    const wavFile = path.join(
      os.tmpdir(),
      `${path.basename(videoFile, path.extname(videoFile))}.wav`
    );
    console.log(`Extracting audio to ${wavFile}...`);
    execSync(`ffmpeg -y -i "${videoFile}" -vn -ar 16000 -ac 1 "${wavFile}"`, {
      stdio: "inherit",
    });

    // Get video duration
    let duration = 0;
    try {
      const durationOutput = execSync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:novalue=1 "${videoFile}"`,
        { encoding: "utf8" }
      );
      duration = parseFloat(durationOutput.trim());
    } catch (e) {
      console.warn(`Could not determine duration for ${filename}`);
      duration = 0;
    }

    // Transcribe
    console.log(`Transcribing ${filename}...`);
    const whisperCppOutput = await transcribe({
      model: MODEL,
      whisperPath,
      whisperCppVersion: "1.5.5",
      inputPath: wavFile,
      tokenLevelTimestamps: true,
    });

    // Convert to captions format
    const { captions } = toCaptions({ whisperCppOutput });

    // Extract full text and correct "Nightly" to "Nitely"
    const fullText = captions.map((c) => c.text).join(" ");
    const correctedText = correctNightly(fullText);

    // Store result
    results[filename] = {
      duration,
      text: correctedText,
      captions: captions.map((c) => ({
        text: correctNightly(c.text),
        startMs: c.startMs,
        endMs: c.endMs,
      })),
    };

    // Clean up temporary wav file
    try {
      fs.unlinkSync(wavFile);
    } catch (e) {
      console.warn(`Could not delete temporary file ${wavFile}`);
    }

    console.log(`✓ Transcribed ${filename}`);
  }

  // Write results to file
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✓ Transcriptions saved to ${outputPath}`);
}

main().catch(console.error);
