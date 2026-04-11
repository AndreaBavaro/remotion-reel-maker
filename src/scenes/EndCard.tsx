import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in the whole card
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo scale spring
  const logoSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);

  // Text slide up
  const textSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 160 },
  });
  const textTranslateY = interpolate(textSpring, [0, 1], [30, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Subtitle fade in after main text
  const subSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 18, mass: 0.5, stiffness: 140 },
  });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subTranslateY = interpolate(subSpring, [0, 1], [15, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e1a",
        opacity: fadeIn,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo — large, centered top */}
      <Img
        src={staticFile("logo1.png")}
        style={{
          position: "absolute",
          top: 200,
          left: "50%",
          width: 750,
          height: 750,
          marginLeft: -375,
          borderRadius: 120,
          transform: `scale(${logoScale})`,
          objectFit: "cover",
        }}
      />

      {/* Main text */}
      <div
        style={{
          position: "absolute",
          top: 1050,
          left: 0,
          right: 0,
          fontFamily,
          fontSize: 52,
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          lineHeight: 1.3,
          padding: "0 60px",
          letterSpacing: -1,
        }}
      >
        Plan your night in 3 Taps{"\n"}with Nitely
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 1220,
          left: 0,
          right: 0,
          fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          opacity: subOpacity,
          transform: `translateY(${subTranslateY}px)`,
        }}
      >
        Available on the App Store
      </div>
    </AbsoluteFill>
  );
};
