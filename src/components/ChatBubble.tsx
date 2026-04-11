import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

export type ChatBubbleProps = {
  sender: string;
  text: string;
  side: "left" | "right";
  color: "gray" | "blue";
  enterFrame: number;
  isTypingIndicator?: boolean;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  side,
  color,
  enterFrame,
  isTypingIndicator = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - enterFrame;

  if (localFrame < 0) return null;

  const springProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 120 },
  });

  const translateY = interpolate(springProgress, [0, 1], [40, 0]);
  const scale = interpolate(springProgress, [0, 1], [0.85, 1.0]);
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const bgColor = color === "blue" ? "#3B82F6" : "#3A3A3C";
  const isLeft = side === "left";

  const borderRadius = isLeft
    ? "24px 24px 24px 6px"
    : "24px 24px 6px 24px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-start" : "flex-end",
        paddingLeft: isLeft ? 48 : 0,
        paddingRight: isLeft ? 0 : 48,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: isLeft ? "left bottom" : "right bottom",
      }}
    >
      {sender && isLeft && (
        <div
          style={{
            fontFamily,
            fontSize: 18,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 6,
          }}
        >
          {sender}
        </div>
      )}
      <div
        style={{
          background: bgColor,
          borderRadius,
          padding: "20px 28px",
          maxWidth: 860,
        }}
      >
        {isTypingIndicator ? (
          <TypingDots />
        ) : (
          <div
            style={{
              fontFamily,
              fontSize: 30,
              fontWeight: 500,
              color: "white",
              lineHeight: 1.3,
            }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap: 7, padding: "6px 8px" }}>
      {[0, 1, 2].map((i) => {
        const dotFrame = frame - i * 4;
        const cycle = Math.sin((dotFrame / 15) * Math.PI * 2);
        const dotOpacity = interpolate(cycle, [-1, 1], [0.3, 1.0]);
        return (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              opacity: dotOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
