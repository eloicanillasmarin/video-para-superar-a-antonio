import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, Easing } from "remotion";
import { FPS, WORDS, TOTAL_FRAMES, SCENE_STARTS, f, norm } from "./timing";
import { POPPINS } from "./fonts";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** spring 0..1 que arranca en el frame `from` (global) */
export const pop = (frame: number, from: number, damping = 11, stiffness = 140) =>
  spring({ frame: frame - from, fps: FPS, config: { damping, stiffness } });

export const ease = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], { ...clamp, easing: Easing.inOut(Easing.cubic) });

/** Lienzo SVG vertical a pantalla completa */
export const Stage: React.FC<{ children: React.ReactNode; zoom?: number; ox?: number; oy?: number }> = ({
  children,
  zoom = 1,
  ox = 540,
  oy = 960,
}) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <g transform={`translate(${ox},${oy}) scale(${zoom}) translate(${-ox},${-oy})`}>{children}</g>
    </svg>
  </AbsoluteFill>
);

/** Etiqueta tipo "pill" que entra con muelle */
export const Tag: React.FC<{
  frame: number;
  from: number;
  x: number;
  y: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ frame, from, x, y, children, bg = "#fff", color = "#1b1b2f", size = 54, rotate = -3 }) => {
  const s = pop(frame, from, 10, 160);
  if (frame < from) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${s}) rotate(${rotate}deg)`,
        background: bg,
        color,
        fontFamily: POPPINS,
        fontWeight: 900,
        fontSize: size,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        borderRadius: size * 0.5,
        boxShadow: "0 10px 0 rgba(0,0,0,0.25)",
        whiteSpace: "nowrap",
        letterSpacing: -0.5,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Subtítulos dinámicos ---------- */

type Chunk = { words: typeof WORDS; start: number; end: number };

const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    if (cur.length && cur[0].seg !== w.seg) flush();
    cur.push(w);
    const punct = /[.,:;?!…»]$/.test(w.text);
    if (cur.length >= 3 || punct || i === WORDS.length - 1) flush();
  });
  for (let i = 0; i < out.length; i++) {
    const next = out[i + 1];
    out[i].end = next ? Math.min(next.start, out[i].end + 0.5) : out[i].end + 0.5;
  }
  return out;
})();

const KEYWORDS = new Set(
  ["simbolo", "1971", "ray", "tomlinson", "dos", "arroba", "at", "en", "email", "qwerty", "quinientos", "medieval", "once", "caracol", "mono", "strudel", "planeta", "llamas", "perfecta", "mercaderes"].map(norm),
);

const clean = (t: string) => t.replace(/[«»"]/g, "").replace(/[,.:;…]+$/g, "");

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunk = CHUNKS.find((c) => t >= c.start - 0.05 && t < c.end);
  if (!chunk) return null;
  const enter = pop(frame, f(chunk.start - 0.05), 12, 220);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", top: 1330, pointerEvents: "none" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 22px",
          width: 960,
          transform: `scale(${0.7 + 0.3 * enter}) translateY(${(1 - enter) * 30}px)`,
          fontFamily: POPPINS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.12,
          textTransform: "uppercase",
          letterSpacing: -1,
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start - 0.03;
          const isKey = KEYWORDS.has(norm(w.text));
          const wp = pop(frame, f(w.start - 0.03), 9, 260);
          return (
            <span
              key={i}
              style={{
                color: active ? (isKey ? "#ffd23f" : "#ffffff") : "rgba(255,255,255,0.55)",
                WebkitTextStroke: "14px #12121f",
                paintOrder: "stroke fill",
                transform: `scale(${active ? 1 + 0.12 * (1 - wp) + (isKey ? 0.08 : 0) : 0.96}) rotate(${isKey && active ? -2 : 0}deg)`,
                display: "inline-block",
                textShadow: "0 8px 0 rgba(0,0,0,0.35)",
              }}
            >
              {clean(w.text)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Transición entre escenas ---------- */

const WIPE_COLORS = ["#ffd23f", "#ff5d8f", "#3ddc97", "#4f7cff", "#ff8a3d", "#a06bff", "#28c2ff"];

export const Wipes: React.FC = () => {
  const frame = useCurrentFrame();
  const b = SCENE_STARTS.slice(1).find((s) => frame >= s - 9 && frame < s + 9);
  if (b === undefined) return null;
  const idx = SCENE_STARTS.indexOf(b);
  const p = interpolate(frame, [b - 9, b, b + 9], [-1, 0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const colors = [WIPE_COLORS[idx % 7], WIPE_COLORS[(idx + 2) % 7], "#12121f"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {colors.map((c, i) => {
        const lag = (i - 1) * 0.12;
        const x = (p + (p < 0 ? -lag : lag)) * 2600;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -700,
              top: -400,
              width: 2500,
              height: 2800,
              background: c,
              transform: `translateX(${x}px) rotate(14deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Detalles globales ---------- */

export const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: `${(frame / TOTAL_FRAMES) * 100}%`, background: "#ffd23f" }} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)", pointerEvents: "none" }} />
);

/** símbolo @ dibujado como texto SVG */
export const At: React.FC<{ x: number; y: number; size: number; color?: string; rotate?: number; opacity?: number; stroke?: string }> = ({
  x,
  y,
  size,
  color = "#ffd23f",
  rotate = 0,
  opacity = 1,
  stroke = "#12121f",
}) => (
  <text
    x={x}
    y={y}
    fontFamily={POPPINS}
    fontWeight={900}
    fontSize={size}
    textAnchor="middle"
    dominantBaseline="central"
    fill={color}
    stroke={stroke}
    strokeWidth={size * 0.06}
    paintOrder="stroke"
    opacity={opacity}
    transform={`rotate(${rotate} ${x} ${y})`}
  >
    @
  </text>
);
