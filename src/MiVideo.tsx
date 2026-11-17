import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MiVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b12", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 140, fontFamily: "sans-serif", transform: `scale(${scale})`, opacity }}>
        Hola, Antonio 👋
      </h1>
    </AbsoluteFill>
  );
};
