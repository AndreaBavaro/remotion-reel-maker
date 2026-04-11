import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "900"],
  subsets: ["latin"],
});

const GLOW_CIRCLES = [
  { x: 340, y: 780, size: 400 },
  { x: 740, y: 850, size: 300 },
  { x: 540, y: 1000, size: 350 },
  { x: 200, y: 900, size: 200 },
];

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoFrame = 2;
  const taglineFrame = 8;
  const linkFrame = 18;

  // Logo animation
  const logoSpring = spring({
    frame: Math.max(0, frame - logoFrame),
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 100 },
  });
  const logoTranslateY = interpolate(logoSpring, [0, 1], [40, 0]);
  const logoScale = interpolate(logoSpring, [0, 1], [0.9, 1.0]);
  const logoOpacity = interpolate(
    frame,
    [logoFrame, logoFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline animation
  const taglineSpring = spring({
    frame: Math.max(0, frame - taglineFrame),
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 100 },
  });
  const taglineTranslateY = interpolate(taglineSpring, [0, 1], [30, 0]);
  const taglineOpacity = interpolate(
    frame,
    [taglineFrame, taglineFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Link in bio
  const linkBaseOpacity = interpolate(
    frame,
    [linkFrame, linkFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const linkPulse =
    frame >= linkFrame
      ? interpolate(
          Math.sin(((frame - linkFrame) / 30) * Math.PI * 2),
          [-1, 1],
          [0.3, 0.6]
        )
      : 0;
  const linkOpacity = frame >= linkFrame + 8 ? linkPulse : linkBaseOpacity;

  // Background glow drift
  const glowDrift = interpolate(frame, [0, 37], [0, -50], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      {/* Background glow circles */}
      {GLOW_CIRCLES.map((circle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: circle.x - circle.size / 2,
            top: circle.y - circle.size / 2,
            width: circle.size,
            height: circle.size,
            borderRadius: "50%",
            backgroundColor: "rgba(59,130,246,0.08)",
            filter: "blur(80px)",
            transform: `translateY(${glowDrift}px)`,
          }}
        />
      ))}

      {/* "Nitely" logo */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontSize: 84,
          fontWeight: 900,
          color: "white",
          opacity: logoOpacity,
          transform: `translateY(${logoTranslateY}px) scale(${logoScale})`,
        }}
      >
        Nitely
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: 920,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontSize: 34,
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
        }}
      >
        Friday night, solved.
      </div>

      {/* Link in bio */}
      <div
        style={{
          position: "absolute",
          top: 1700,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontSize: 22,
          fontWeight: 400,
          color: "rgba(255,255,255,0.4)",
          opacity: linkOpacity,
        }}
      >
        Link in bio
      </div>
    </AbsoluteFill>
  );
};
