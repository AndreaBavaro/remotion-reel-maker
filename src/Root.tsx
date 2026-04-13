import { Composition } from "remotion";
import { NitelyReel } from "./NitelyReel";

// To register a new reel after Claude generates it under src/reels/reelN/:
//   import { ReelN } from "./reels/reelN/ReelN";
//   import { TOTAL_FRAMES as REELN_TOTAL_FRAMES } from "./reels/reelN/timing";
// Then add a <Composition id="ReelN" ... /> below.
// Per-reel folders are gitignored — each collaborator builds their own locally.

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
    </>
  );
};
