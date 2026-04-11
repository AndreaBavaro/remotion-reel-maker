import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ChatBubble, ChatBubbleProps } from "../components/ChatBubble";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

const AVATAR_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

const MESSAGES: Omit<ChatBubbleProps, "enterFrame">[] = [
  { sender: "Marco", text: "where are we going tonight", side: "left", color: "gray" },
  { sender: "Sarah", text: "idk you pick", side: "left", color: "gray" },
  { sender: "", text: "what about King St?", side: "right", color: "blue" },
  { sender: "Jay", text: "cover is $30 💀", side: "left", color: "gray" },
  { sender: "Priya", text: "too far", side: "left", color: "gray" },
  { sender: "Mike", text: "I'm not waiting in line", side: "left", color: "gray" },
  { sender: "Sarah", text: "lol what about Ossington", side: "left", color: "gray" },
  { sender: "Jay", text: "that place was dead last time", side: "left", color: "gray" },
  { sender: "Marco", text: "just pick somewhere!!", side: "left", color: "gray" },
  { sender: "Priya", text: "ok everyone vote top 3", side: "left", color: "gray" },
  { sender: "", text: "no one's gonna agree 😂", side: "right", color: "blue" },
  { sender: "Mike", text: "this happens every week", side: "left", color: "gray" },
  { sender: "Sarah", text: "someone just decide pls", side: "left", color: "gray" },
  { sender: "Jay", text: "I'm not picking", side: "left", color: "gray" },
  { sender: "Marco", text: "ok fine let's just go to the usual", side: "left", color: "gray" },
  { sender: "Priya", text: "...", side: "left", color: "gray", isTypingIndicator: true },
];

const ENTER_FRAMES = [
  25, 35, 45, 55, 65, 75, 85, 95, 105,
  130, 150, 170, 190, 215, 255, 285,
];

const BUBBLE_GAP = 20;

export const GroupChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [330, 338], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // POV hook text — visible for first ~40 frames
  const hookSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 200 },
  });
  const hookScale = interpolate(hookSpring, [0, 1], [0.5, 1]);
  const hookOpacity = interpolate(frame, [0, 3, 30, 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scroll chat up as new bubbles arrive in clips 2-3
  const scrollY = interpolate(frame, [100, 290], [0, -650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timestampOpacity = interpolate(frame, [110, 117], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a", opacity: fadeOut }}>
      {/* POV Hook Text */}
      {frame < 45 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 64,
              fontWeight: 600,
              color: "white",
              textAlign: "center",
              lineHeight: 1.3,
              opacity: hookOpacity,
              transform: `scale(${hookScale})`,
              padding: "0 60px",
            }}
          >
            POV: it's Friday night...
            <br />
            <span style={{ fontSize: 52, color: "rgba(255,255,255,0.6)" }}>
              again
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Chat Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 600,
            color: "white",
          }}
        >
          Friday Night Plans 🍻
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 10,
          }}
        >
          {AVATAR_COLORS.map((c, i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: c,
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat Bubbles Container — flex-end to stack from bottom like iMessage */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: BUBBLE_GAP,
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {MESSAGES.map((msg, i) => (
            <ChatBubble
              key={i}
              {...msg}
              enterFrame={ENTER_FRAMES[i]}
            />
          ))}
        </div>

        {/* Timestamp */}
        {frame >= 70 && (
          <div
            style={{
              textAlign: "center",
              fontFamily,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              marginTop: 12,
              opacity: timestampOpacity,
            }}
          >
            8:47 PM
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
