import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

const PHOTOS = [
  {
    src: "line1.png",
    enterFrame: 3,
    top: -40,
    left: -60,
    width: 680,
    height: 1050,
    rotate: -3,
  },
  {
    src: "line2.png",
    enterFrame: 10,
    top: -60,
    left: 460,
    width: 700,
    height: 1050,
    rotate: 3,
  },
  {
    src: "line3.png",
    enterFrame: 18,
    top: 820,
    left: 80,
    width: 920,
    height: 1200,
    rotate: -1,
  },
];

export const KingStreetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [156, 164], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Dark backdrop to fully cover the chat behind */}
      <AbsoluteFill style={{ backgroundColor: "rgba(10, 14, 26, 0.95)" }} />
      {PHOTOS.map((photo, i) => {
        const localFrame = frame - photo.enterFrame;
        if (localFrame < 0) return null;

        const enterSpring = spring({
          frame: localFrame,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 120 },
        });

        const scale = interpolate(enterSpring, [0, 1], [0.6, 1.0]);
        const opacity = interpolate(localFrame, [0, 4], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });
        const translateY = interpolate(enterSpring, [0, 1], [60, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: photo.top,
              left: photo.left,
              width: photo.width,
              height: photo.height,
              borderRadius: 16,
              overflow: "hidden",
              opacity,
              transform: `scale(${scale}) translateY(${translateY}px) rotate(${photo.rotate}deg)`,
              transformOrigin: "center center",
              boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
              border: "3px solid rgba(255,255,255,0.15)",
            }}
          >
            <Img
              src={staticFile(photo.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      })}

      {/* 😴 Emoji over photo 3 */}
      {frame >= 28 && frame <= 70 && (
        <EmojiOverlay frame={frame - 28} fps={fps} />
      )}
    </AbsoluteFill>
  );
};

const EmojiOverlay: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const springProgress = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 100 },
  });

  const scale = interpolate(springProgress, [0, 1], [0.3, 1.0]);
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 950,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 120,
          transform: `scale(${scale})`,
        }}
      >
        😴
      </div>
    </div>
  );
};
