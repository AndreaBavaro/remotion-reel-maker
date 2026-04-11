#!/bin/bash
# Fallback caption generation using ffmpeg + OpenAI Whisper CLI
# Requires: ffmpeg, whisper (pip install openai-whisper)

set -e

# 1. Extract audio from all 4 facecam clips
ffmpeg -y -i public/clip1.MOV -vn -ar 16000 -ac 1 /tmp/fc1.wav
ffmpeg -y -i public/clip2.MOV -vn -ar 16000 -ac 1 /tmp/fc2.wav
ffmpeg -y -i public/clip3.MOV -vn -ar 16000 -ac 1 /tmp/fc3.wav
ffmpeg -y -i public/clip4.MOV -vn -ar 16000 -ac 1 /tmp/fc4.wav

# 2. Concatenate into one audio file
ffmpeg -y -f concat -safe 0 -i <(printf "file '/tmp/fc1.wav'\nfile '/tmp/fc2.wav'\nfile '/tmp/fc3.wav'\nfile '/tmp/fc4.wav'\n") \
       -ar 16000 -ac 1 /tmp/facecam-full.wav

# 3. Run Whisper with word-level timestamps
whisper /tmp/facecam-full.wav \
  --model medium \
  --output_format json \
  --word_timestamps True \
  --output_dir /tmp/whisper-out/

# 4. Copy output to public/captions.json
cp /tmp/whisper-out/facecam-full.json public/captions.json

echo "Captions generated at public/captions.json"
