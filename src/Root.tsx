import { Composition } from "remotion";
import { NitelyReel } from "./NitelyReel";
import { Reel1 } from "./reels/reel1/Reel1";
import { TOTAL_FRAMES as REEL1_TOTAL_FRAMES } from "./reels/reel1/timing";
import { Reel2 } from "./reels/reel2/Reel2";
import { TOTAL_FRAMES as REEL2_TOTAL_FRAMES } from "./reels/reel2/timing";
import { Reel3 } from "./reels/reel3/Reel3";
import { TOTAL_FRAMES as REEL3_TOTAL_FRAMES } from "./reels/reel3/timing";
import { Reel4 } from "./reels/reel4/Reel4";
import { TOTAL_FRAMES as REEL4_TOTAL_FRAMES } from "./reels/reel4/timing";
import { Reel5 } from "./reels/reel5/Reel5";
import { TOTAL_FRAMES as REEL5_TOTAL_FRAMES } from "./reels/reel5/timing";
import { Reel6 } from "./reels/reel6/Reel6";
import { TOTAL_FRAMES as REEL6_TOTAL_FRAMES } from "./reels/reel6/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NitelyReel"
        component={NitelyReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={959}
      />
      <Composition
        id="Reel1"
        component={Reel1}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL1_TOTAL_FRAMES}
      />
      <Composition
        id="Reel2"
        component={Reel2}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL2_TOTAL_FRAMES}
      />
      <Composition
        id="Reel3"
        component={Reel3}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL3_TOTAL_FRAMES}
      />
      <Composition
        id="Reel4"
        component={Reel4}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL4_TOTAL_FRAMES}
      />
      <Composition
        id="Reel5"
        component={Reel5}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL5_TOTAL_FRAMES}
      />
      <Composition
        id="Reel6"
        component={Reel6}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={REEL6_TOTAL_FRAMES}
      />
    </>
  );
};
