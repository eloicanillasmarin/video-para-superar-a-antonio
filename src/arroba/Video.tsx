import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { AUDIO, sceneRange } from "./timing";
import { Captions, Progress, Vignette, Wipes } from "./ui";
import { S0Hook, S1Year, S2Machines } from "./scenes/Intro";
import { S3Keyboard, S4FirstEmail } from "./scenes/Invento";
import { S5Medieval, S6World, S7Outro } from "./scenes/Historia";

const SCENES = [S0Hook, S1Year, S2Machines, S3Keyboard, S4FirstEmail, S5Medieval, S6World, S7Outro];

export const ArrobaVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = SCENES.findIndex((_, i) => {
    const [a, b] = sceneRange(i);
    return frame >= a && frame < b;
  });
  const Scene = SCENES[idx === -1 ? SCENES.length - 1 : idx];
  return (
    <AbsoluteFill style={{ backgroundColor: "#12121f" }}>
      <Scene />
      <Vignette />
      <Captions />
      <Wipes />
      <Progress />
      {AUDIO && <Audio src={staticFile(AUDIO)} />}
    </AbsoluteFill>
  );
};
