import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  continueRender,
  delayRender,
  interpolate,
  spring,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

const HIGHLIGHT_COLOR = "#FACC15";
const UPCOMING_COLOR = "rgba(255,255,255,0.2)";
const SPOKEN_COLOR = "white";
const SWITCH_CAPTIONS_EVERY_MS = 1500;
const MAX_CAPTION_FRAME = 855;

// Captions with timestamps based on Whisper word-level transcription
// Clip 1: 0–3933ms | Clip 2: 3933–8533ms | Clip 3: 8533–11167ms
// Clip 4: 11167–16700ms | Clip 5: 16700–20300ms | Clip 7: 20300–26135ms | Clip 8: 26135–28968ms
const FALLBACK_CAPTIONS: Caption[] = [
  // Clip 1: "Does anyone else have the same Friday night on repeat?"
  { text: "Does", startMs: 0, endMs: 560, timestampMs: 0, confidence: 1 },
  { text: " anyone", startMs: 560, endMs: 780, timestampMs: 560, confidence: 1 },
  { text: " else", startMs: 780, endMs: 1120, timestampMs: 780, confidence: 1 },
  { text: " have", startMs: 1120, endMs: 1420, timestampMs: 1120, confidence: 1 },
  { text: " the", startMs: 1420, endMs: 1560, timestampMs: 1420, confidence: 1 },
  { text: " same", startMs: 1560, endMs: 1980, timestampMs: 1560, confidence: 1 },
  { text: " Friday", startMs: 1980, endMs: 2400, timestampMs: 1980, confidence: 1 },
  { text: " night", startMs: 2400, endMs: 2860, timestampMs: 2400, confidence: 1 },
  { text: " on", startMs: 2860, endMs: 3000, timestampMs: 2860, confidence: 1 },
  { text: " repeat?", startMs: 3000, endMs: 3280, timestampMs: 3000, confidence: 1 },
  // Clip 2: "14 different people giving 14 different opinions."
  { text: " 14", startMs: 3933, endMs: 4953, timestampMs: 3933, confidence: 1 },
  { text: " different", startMs: 4953, endMs: 5313, timestampMs: 4953, confidence: 1 },
  { text: " people", startMs: 5313, endMs: 5953, timestampMs: 5313, confidence: 1 },
  { text: " giving", startMs: 5953, endMs: 6253, timestampMs: 5953, confidence: 1 },
  { text: " 14", startMs: 6253, endMs: 6893, timestampMs: 6253, confidence: 1 },
  { text: " different", startMs: 6893, endMs: 7453, timestampMs: 6893, confidence: 1 },
  { text: " opinions.", startMs: 7453, endMs: 7913, timestampMs: 7453, confidence: 1 },
  // Clip 3: "Nobody decides anything."
  { text: " Nobody", startMs: 8533, endMs: 9073, timestampMs: 8533, confidence: 1 },
  { text: " decides", startMs: 9073, endMs: 9653, timestampMs: 9073, confidence: 1 },
  { text: " anything.", startMs: 9653, endMs: 10333, timestampMs: 9653, confidence: 1 },
  // Clip 4: "Then you just end up going to the same three bars you always go to"
  { text: " Then", startMs: 11167, endMs: 11827, timestampMs: 11167, confidence: 1 },
  { text: " you", startMs: 11827, endMs: 12167, timestampMs: 11827, confidence: 1 },
  { text: " just", startMs: 12167, endMs: 12367, timestampMs: 12167, confidence: 1 },
  { text: " end", startMs: 12367, endMs: 12587, timestampMs: 12367, confidence: 1 },
  { text: " up", startMs: 12587, endMs: 12747, timestampMs: 12587, confidence: 1 },
  { text: " going", startMs: 12747, endMs: 12987, timestampMs: 12747, confidence: 1 },
  { text: " to", startMs: 12987, endMs: 13247, timestampMs: 12987, confidence: 1 },
  { text: " the", startMs: 13247, endMs: 13367, timestampMs: 13247, confidence: 1 },
  { text: " same", startMs: 13367, endMs: 13827, timestampMs: 13367, confidence: 1 },
  { text: " three", startMs: 13827, endMs: 14367, timestampMs: 13827, confidence: 1 },
  { text: " bars", startMs: 14367, endMs: 14807, timestampMs: 14367, confidence: 1 },
  { text: " you", startMs: 14807, endMs: 15227, timestampMs: 14807, confidence: 1 },
  { text: " always", startMs: 15227, endMs: 15467, timestampMs: 15227, confidence: 1 },
  { text: " go", startMs: 15467, endMs: 15787, timestampMs: 15467, confidence: 1 },
  { text: " to", startMs: 15787, endMs: 16007, timestampMs: 15787, confidence: 1 },
  // Clip 5: "We built an app that picks the spot for you"
  { text: " We", startMs: 17500, endMs: 17720, timestampMs: 17500, confidence: 1 },
  { text: " built", startMs: 17720, endMs: 17920, timestampMs: 17720, confidence: 1 },
  { text: " an", startMs: 17920, endMs: 18140, timestampMs: 17920, confidence: 1 },
  { text: " app", startMs: 18140, endMs: 18320, timestampMs: 18140, confidence: 1 },
  { text: " that", startMs: 18320, endMs: 18520, timestampMs: 18320, confidence: 1 },
  { text: " picks", startMs: 18520, endMs: 18760, timestampMs: 18520, confidence: 1 },
  { text: " the", startMs: 18760, endMs: 18920, timestampMs: 18760, confidence: 1 },
  { text: " spot", startMs: 18920, endMs: 19220, timestampMs: 18920, confidence: 1 },
  { text: " for", startMs: 19220, endMs: 19640, timestampMs: 19220, confidence: 1 },
  { text: " you.", startMs: 19640, endMs: 19880, timestampMs: 19640, confidence: 1 },
  // Clip 7: "You just pick what your group actually cares about and it shows you where to go"
  { text: " You", startMs: 20300, endMs: 20900, timestampMs: 20300, confidence: 1 },
  { text: " just", startMs: 20900, endMs: 21140, timestampMs: 20900, confidence: 1 },
  { text: " pick", startMs: 21140, endMs: 21380, timestampMs: 21140, confidence: 1 },
  { text: " what", startMs: 21380, endMs: 21640, timestampMs: 21380, confidence: 1 },
  { text: " your", startMs: 21640, endMs: 21860, timestampMs: 21640, confidence: 1 },
  { text: " group", startMs: 21860, endMs: 22160, timestampMs: 21860, confidence: 1 },
  { text: " actually", startMs: 22160, endMs: 22920, timestampMs: 22160, confidence: 1 },
  { text: " cares", startMs: 22920, endMs: 23300, timestampMs: 22920, confidence: 1 },
  { text: " about", startMs: 23300, endMs: 23640, timestampMs: 23300, confidence: 1 },
  { text: " and", startMs: 23640, endMs: 24000, timestampMs: 23640, confidence: 1 },
  { text: " it", startMs: 24000, endMs: 24140, timestampMs: 24000, confidence: 1 },
  { text: " shows", startMs: 24140, endMs: 24420, timestampMs: 24140, confidence: 1 },
  { text: " you", startMs: 24420, endMs: 24760, timestampMs: 24420, confidence: 1 },
  { text: " where", startMs: 24760, endMs: 25160, timestampMs: 24760, confidence: 1 },
  { text: " to", startMs: 25160, endMs: 25300, timestampMs: 25160, confidence: 1 },
  { text: " go.", startMs: 25300, endMs: 25480, timestampMs: 25300, confidence: 1 },
  // Clip 8: "It's called NITELY — link in bio"
  { text: " It's", startMs: 26135, endMs: 26755, timestampMs: 26135, confidence: 1 },
  { text: " called", startMs: 26755, endMs: 26935, timestampMs: 26755, confidence: 1 },
  { text: " NITELY", startMs: 26935, endMs: 27375, timestampMs: 26935, confidence: 1 },
  { text: " link", startMs: 27375, endMs: 27635, timestampMs: 27375, confidence: 1 },
  { text: " in", startMs: 27635, endMs: 27895, timestampMs: 27635, confidence: 1 },
  { text: " bio", startMs: 27895, endMs: 28255, timestampMs: 27895, confidence: 1 },
];

// Convert Whisper JSON format to @remotion/captions Caption format
function whisperToCaptions(whisperJson: {
  segments: Array<{
    words: Array<{ word: string; start: number; end: number }>;
  }>;
}): Caption[] {
  const captions: Caption[] = [];
  for (const segment of whisperJson.segments) {
    for (const word of segment.words) {
      captions.push({
        text: ` ${word.word.trim()}`,
        startMs: Math.round(word.start * 1000),
        endMs: Math.round(word.end * 1000),
        timestampMs: Math.round(word.start * 1000),
        confidence: 1,
      });
    }
  }
  return captions;
}

export const Captions: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender("Loading captions"));

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("captions.json"));
      if (!response.ok) throw new Error("No captions file");
      const data = await response.json();

      // Handle Whisper JSON format vs @remotion/captions format
      if (data.segments) {
        setCaptions(whisperToCaptions(data));
      } else if (Array.isArray(data)) {
        setCaptions(data);
      } else {
        throw new Error("Unknown captions format");
      }
      continueRender(handle);
    } catch {
      // Use fallback captions
      setCaptions(FALLBACK_CAPTIONS);
      continueRender(handle);
    }
  }, [handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  if (!captions) return null;

  return <CaptionsRenderer captions={captions} />;
};

const CaptionsRenderer: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 350,
    });
  }, [captions]);

  if (frame > MAX_CAPTION_FRAME) return null;

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.min(
          nextPage ? Math.round((nextPage.startMs / 1000) * fps) : Infinity,
          startFrame + Math.round((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps),
          MAX_CAPTION_FRAME
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
            premountFor={5}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line transition animation
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.3, stiffness: 100 },
  });
  const enterScale = interpolate(enterSpring, [0, 1], [0.94, 1.0]);
  const enterOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const enterTranslateY = interpolate(enterSpring, [0, 1], [10, 0]);

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 105,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: enterOpacity,
        transform: `scale(${enterScale}) translateY(${enterTranslateY}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          textAlign: "center",
          fontFamily,
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.3,
          letterSpacing: -1,
          whiteSpace: "pre-wrap",
          padding: "0 40px",
          textShadow:
            "3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 6px 12px rgba(0,0,0,0.6)",
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const isPast = absoluteTimeMs >= token.toMs;

          let color = UPCOMING_COLOR;
          if (isActive) color = HIGHLIGHT_COLOR;
          else if (isPast) color = SPOKEN_COLOR;

          return (
            <span key={i} style={{ color }}>
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
