import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";

const CLIPS = [
  { src: "clip1.MOV", from: 0, duration: 118 },
  { src: "clip2.MOV", from: 118, duration: 138 },
  { src: "clip3.MOV", from: 256, duration: 79 },
  { src: "clip4.MOV", from: 335, duration: 166 },
  { src: "clip5.MOV", from: 501, duration: 108 },
  { src: "clip7.MOV", from: 609, duration: 175 },
  { src: "clip8.MOV", from: 784, duration: 85 },
];

const CUT_FRAMES = [118, 256, 335, 501, 609, 784];

// Emphasis zoom frames — key words that get a subtle zoom punch
const EMPHASIS_FRAMES = [160, 220, 280, 430, 555, 700, 810];

export const FaceCam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out near end (frames 855-869)
  const fadeOutOpacity = interpolate(frame, [855, 869], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOutScale = interpolate(frame, [855, 869], [1.0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame >= 869) return null;

  // Jump cut scale punch
  let jumpCutScale = 1.0;
  for (const cutFrame of CUT_FRAMES) {
    if (frame >= cutFrame && frame < cutFrame + 8) {
      const localFrame = frame - cutFrame;
      const punchSpring = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, mass: 0.3, stiffness: 250 },
      });
      jumpCutScale = interpolate(punchSpring, [0, 1], [0.88, 1.0]);
    }
  }

  const combinedScale = fadeOutScale * jumpCutScale;

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 40,
        width: 234,
        height: 312,
        borderRadius: 16,
        overflow: "hidden",
        border: "3px solid white",
        boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        opacity: fadeOutOpacity,
        transform: `scale(${combinedScale})`,
        transformOrigin: "center center",
      }}
    >
      {CLIPS.map((clip, i) => (
        <Sequence
          key={i}
          from={clip.from}
          durationInFrames={clip.duration}
          layout="none"
        >
          <Video
            src={staticFile(clip.src)}
            muted
            style={{
              width: 234,
              height: 312,
              objectFit: "cover",
            }}
          />
        </Sequence>
      ))}
    </div>
  );
};
