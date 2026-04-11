import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
} from "remotion";

// Flash at every clip cut for energy
const FLASH_FRAMES = [118, 256, 335, 501, 609, 784];

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 1, 4], [0, 0.7, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const FlashCut: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: 25 }}>
      {FLASH_FRAMES.map((f) => (
        <Sequence key={f} from={f} durationInFrames={5}>
          <Flash />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
