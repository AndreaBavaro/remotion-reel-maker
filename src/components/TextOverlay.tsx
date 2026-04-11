import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

interface TextPunch {
  text: string;
  startFrame: number;
  duration: number;
  color?: string;
  fontSize?: number;
}

// Key phrases timed to clip boundaries
const TEXT_PUNCHES: TextPunch[] = [
  // Clip 2: "14 different people giving 14 different opinions"
  { text: "14 DIFFERENT\nPEOPLE", startFrame: 135, duration: 45, color: "#FACC15" },
  { text: "14 DIFFERENT\nOPINIONS", startFrame: 200, duration: 45, color: "#F97316" },
  // Clip 3: "Nobody decides anything"
  { text: "NOBODY\nDECIDES", startFrame: 265, duration: 65, color: "#EF4444", fontSize: 90 },
];

const PunchText: React.FC<{ punch: TextPunch }> = ({ punch }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 280 },
  });

  const exitOpacity = interpolate(
    frame,
    [punch.duration - 8, punch.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(enterSpring, [0, 1], [0.3, 1]);
  const opacity = Math.min(enterSpring, exitOpacity);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 15,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: punch.fontSize || 80,
          fontWeight: 900,
          color: punch.color || "white",
          textAlign: "center",
          lineHeight: 1.1,
          textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
          transform: `scale(${scale})`,
          opacity,
          whiteSpace: "pre-line",
          letterSpacing: -2,
        }}
      >
        {punch.text}
      </div>
    </AbsoluteFill>
  );
};

export const TextOverlay: React.FC = () => {
  return (
    <AbsoluteFill>
      {TEXT_PUNCHES.map((punch, i) => (
        <Sequence
          key={i}
          from={punch.startFrame}
          durationInFrames={punch.duration}
        >
          <PunchText punch={punch} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
