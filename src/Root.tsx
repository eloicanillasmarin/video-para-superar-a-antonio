import { Composition } from "remotion";
import { MiVideo } from "./MiVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MiVideo"
      component={MiVideo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
