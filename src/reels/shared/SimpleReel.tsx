import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Inter";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";

const { fontFamily } = loadFont("normal", { weights: ["800", "900"], subsets: ["latin"] });

const FPS = 30;

export type SimpleClip = {
  src: string; // path relative to /public
  trimFromSeconds?: number; // default 0
  durationInFrames: number; // used length
};

export type SimpleReelProps = {
  clips: SimpleClip[];
  captions: Caption[]; // startMs/endMs in absolute reel timeline ms
  hookText?: string; // big overlay text during first ~1.5s
  ctaText?: string; // shown on end card
  endCardFrames?: number; // default 60 (2s)
};

const HOOK_OVERLAY_END = 45; // 1.5s

export const SimpleReel: React.FC<SimpleReelProps> = ({
  clips,
  captions,
  hookText,
  ctaText = "DOWNLOAD NITELY\nLink in bio 👇",
  endCardFrames = 60,
}) => {
  // Compute clip frame offsets
  const clipStarts: number[] = [];
  let cursor = 0;
  for (const c of clips) {
    clipStarts.push(cursor);
    cursor += c.durationInFrames;
  }
  const clipsTotal = cursor;
  const totalFrames = clipsTotal + endCardFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      {/* Layer 0: clip sequence */}
      <AbsoluteFill>
        {clips.map((c, i) => (
          <Sequence
            key={i}
            from={clipStarts[i]}
            durationInFrames={c.durationInFrames}
            premountFor={10}
          >
            <Video
              src={staticFile(c.src)}
              trimBefore={Math.round((c.trimFromSeconds ?? 0) * FPS)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Sequence>
        ))}
      </AbsoluteFill>

      {/* Layer 5: End card */}
      <AbsoluteFill style={{ zIndex: 5 }}>
        <Sequence from={clipsTotal} durationInFrames={endCardFrames}>
          <EndCard ctaText={ctaText} />
        </Sequence>
      </AbsoluteFill>

      {/* Layer 10: Captions */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        <CaptionsLayer captions={captions} maxFrame={clipsTotal} />
      </AbsoluteFill>

      {/* Layer 12: Hook overlay (mandatory first-2s visual change) */}
      {hookText ? (
        <AbsoluteFill style={{ zIndex: 12 }}>
          <Sequence from={0} durationInFrames={HOOK_OVERLAY_END}>
            <HookOverlay text={hookText} durationInFrames={HOOK_OVERLAY_END} />
          </Sequence>
        </AbsoluteFill>
      ) : null}

      {/* Layer 30: Flash cuts at every clip boundary */}
      <AbsoluteFill style={{ zIndex: 30 }}>
        {clipStarts.slice(1).map((f) => (
          <Sequence key={f} from={f - 1} durationInFrames={5}>
            <Flash />
          </Sequence>
        ))}
        {/* Flash at hook overlay cut and at end-card entry */}
        <Sequence from={HOOK_OVERLAY_END - 1} durationInFrames={5}>
          <Flash />
        </Sequence>
        <Sequence from={clipsTotal - 1} durationInFrames={5}>
          <Flash />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  void totalFrames; // explicit no-op to keep type inference calm
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 1, 4], [0, 0.85, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: "white", opacity, pointerEvents: "none" }}
    />
  );
};

const HookOverlay: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const opacity = interpolate(
    frame,
    [0, 4, durationInFrames - 6, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        paddingTop: 220,
        paddingBottom: 320,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontFamily,
          fontWeight: 900,
          fontSize: 110,
          lineHeight: 1.05,
          color: "#FACC15",
          textAlign: "center",
          letterSpacing: -2,
          whiteSpace: "pre-wrap",
          textShadow:
            "4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 10px 20px rgba(0,0,0,0.8)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ ctaText: string }> = ({ ctaText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1e3a 0%, #0a0e1a 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          fontFamily,
          textAlign: "center",
          paddingTop: 200,
          paddingBottom: 300,
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: "#FACC15",
            letterSpacing: -3,
            textShadow: "0 10px 30px rgba(250,204,21,0.35)",
          }}
        >
          Nitely
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 54,
            fontWeight: 800,
            color: "white",
            whiteSpace: "pre-wrap",
            lineHeight: 1.2,
          }}
        >
          {ctaText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HIGHLIGHT_COLOR = "#FACC15";
const UPCOMING_COLOR = "rgba(255,255,255,0.22)";
const SPOKEN_COLOR = "white";
const SWITCH_CAPTIONS_EVERY_MS = 1500;

const CaptionsLayer: React.FC<{ captions: Caption[]; maxFrame: number }> = ({
  captions,
  maxFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 350,
    });
  }, [captions]);

  if (frame > maxFrame) return null;

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.min(
          nextPage ? Math.round((nextPage.startMs / 1000) * fps) : Infinity,
          startFrame + Math.round((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps),
          maxFrame
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
  const s = spring({ frame, fps, config: { damping: 18, mass: 0.3, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const opacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const translateY = interpolate(s, [0, 1], [10, 0]);
  const nowMs = page.startMs + (frame / fps) * 1000;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 290,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: "0 40px",
          textAlign: "center",
          fontFamily,
          fontSize: 58,
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: -1,
          whiteSpace: "pre-wrap",
          textShadow:
            "3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 6px 14px rgba(0,0,0,0.7)",
          textTransform: "uppercase",
        }}
      >
        {page.tokens.map((t, i) => {
          const isActive = t.fromMs <= nowMs && t.toMs > nowMs;
          const isPast = nowMs >= t.toMs;
          const color = isActive ? HIGHLIGHT_COLOR : isPast ? SPOKEN_COLOR : UPCOMING_COLOR;
          return (
            <span key={i} style={{ color }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
