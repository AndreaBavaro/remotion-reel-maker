import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { GroupChatScene } from "./scenes/GroupChatScene";
import { KingStreetScene } from "./scenes/KingStreetScene";
import { AppDemoScene } from "./scenes/AppDemoScene";
import { CtaScene } from "./scenes/CtaScene";
import { EndCard } from "./scenes/EndCard";
import { FaceCam } from "./components/FaceCam";
import { Captions } from "./components/Captions";
import { TextOverlay } from "./components/TextOverlay";

export const NitelyReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      {/* Layer 1 (bottom): Scenes */}
      <AbsoluteFill>
        {/* GroupChat: clips 1-3 (0→335) */}
        <Sequence from={0} durationInFrames={342} premountFor={10}>
          <GroupChatScene />
        </Sequence>
        {/* AppDemo: clips 5,7,8 with clip9 screen recording (501→869) */}
        <Sequence from={501} durationInFrames={368} premountFor={10}>
          <AppDemoScene />
        </Sequence>
        {/* End Card: fade to black with logo + CTA (869→959) */}
        <Sequence from={869} durationInFrames={90}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>

      {/* Layer 1.5: KingStreet photos during clip4 "same three bars" (335→501) */}
      <AbsoluteFill style={{ zIndex: 5 }}>
        <Sequence from={335} durationInFrames={166} premountFor={10}>
          <KingStreetScene />
        </Sequence>
      </AbsoluteFill>

      {/* Layer 2 (middle): Captions */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        <Captions />
      </AbsoluteFill>

      {/* Continuous voiceover audio track */}
      <Audio src={staticFile("voiceover.wav")} />

      {/* Layer 2.5: Text overlays for emphasis phrases */}
      <AbsoluteFill style={{ zIndex: 12 }}>
        <TextOverlay />
      </AbsoluteFill>

      {/* Layer 3 (top): FaceCam */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <FaceCam />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
