import React from "react";
import { SimpleReel } from "../shared/SimpleReel";
import { CLIPS, END_CARD_FRAMES } from "./timing";
import { CAPTIONS } from "./captions";

const HOOK_TEXT = "KING WEST\nLAST FRIDAY";
const CTA_TEXT = "Download Nitely\nKnow before you go";

export const Reel3: React.FC = () => {
  return (
    <SimpleReel
      clips={CLIPS as unknown as { src: string; durationInFrames: number }[]}
      captions={CAPTIONS}
      hookText={HOOK_TEXT}
      ctaText={CTA_TEXT}
      endCardFrames={END_CARD_FRAMES}
    />
  );
};
