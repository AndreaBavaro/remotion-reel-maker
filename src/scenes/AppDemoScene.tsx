import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

export const AppDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitScale = interpolate(frame, [358, 368], [1.0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [358, 368], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });


  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e1a",
        opacity: Math.min(fadeIn, exitOpacity),
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Screen Recording */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 90,
          width: 900,
          borderRadius: 40,
          overflow: "hidden",
          border: "3px solid rgba(59,130,246,0.4)",
          boxShadow: "0 8px 40px rgba(59,130,246,0.25)",
        }}
      >
        <Video
          src={staticFile("clip9.MOV")}
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </div>

    </AbsoluteFill>
  );
};
