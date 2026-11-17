import { Composition } from "remotion";
import { ArrobaVideo } from "./arroba/Video";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./arroba/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Arroba"
      component={ArrobaVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
