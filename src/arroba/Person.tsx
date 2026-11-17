import React from "react";
import { useCurrentFrame } from "remotion";

export type Arm = [raise: number, elbow: number];

export type PersonProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skin?: string;
  hair?: string;
  hairStyle?: "short" | "curly" | "long" | "bald" | "bun" | "side";
  shirt?: string;
  pants?: string;
  shoes?: string;
  sleeves?: "long" | "short";
  outfit?: "shirt" | "hoodie" | "tunic";
  glasses?: boolean;
  mustache?: boolean;
  beard?: boolean;
  tie?: string;
  hat?: "none" | "beret" | "medieval";
  hatColor?: string;
  armL?: Arm;
  armR?: Arm;
  itemL?: React.ReactNode;
  itemR?: React.ReactNode;
  /** fase de caminar en radianes (null = quieto) */
  walk?: number | null;
  sitting?: boolean;
  mouth?: number;
  smile?: number;
  lookX?: number;
  lookY?: number;
  headTilt?: number;
  eyesWide?: number;
  blinkSeed?: number;
  brows?: number;
};

const UPPER = 108;
const LOWER = 98;

const ArmShape: React.FC<{
  side: 1 | -1;
  arm: Arm;
  color: string;
  forearm: string;
  skin: string;
  item?: React.ReactNode;
}> = ({ side, arm, color, forearm, skin, item }) => {
  const [raise, elbow] = arm;
  return (
    <g transform={`translate(${side * 86},-440) rotate(${-side * raise})`}>
      <line x1={0} y1={0} x2={0} y2={UPPER} stroke={color} strokeWidth={36} strokeLinecap="round" />
      <g transform={`translate(0,${UPPER}) rotate(${side * elbow})`}>
        <line x1={0} y1={0} x2={0} y2={LOWER} stroke={forearm} strokeWidth={32} strokeLinecap="round" />
        <g transform={`translate(0,${LOWER})`}>
          {item}
          <circle r={21} fill={skin} />
        </g>
      </g>
    </g>
  );
};

export const Person: React.FC<PersonProps> = (p) => {
  const frame = useCurrentFrame();
  const skin = p.skin ?? "#f2c29b";
  const hair = p.hair ?? "#2b1d14";
  const shirt = p.shirt ?? "#4f7cff";
  const pants = p.pants ?? "#2d3557";
  const shoes = p.shoes ?? "#1d1d24";
  const outfit = p.outfit ?? "shirt";
  const seed = p.blinkSeed ?? 0;
  const walking = p.walk !== null && p.walk !== undefined;
  const ph = p.walk ?? 0;

  // respiración + rebote al caminar
  const breathe = Math.sin((frame + seed * 7) / 14) * 3;
  const bob = walking ? -Math.abs(Math.sin(ph)) * 16 : 0;

  // parpadeo
  const bl = (frame + seed * 37) % 97;
  const blink = bl < 2 ? 0.12 : bl < 4 ? 0.5 : 1;
  const wide = p.eyesWide ?? 0;

  const hip = p.sitting ? -150 : -250;
  const liftL = walking ? Math.max(0, Math.sin(ph)) * 40 : 0;
  const liftR = walking ? Math.max(0, -Math.sin(ph)) * 40 : 0;
  const swing = walking ? Math.sin(ph) * 22 : 0;

  const armL: Arm = p.armL ?? [8 + swing, 8];
  const armR: Arm = p.armR ?? [8 - swing, 8];
  const forearm = (p.sleeves ?? "long") === "short" ? skin : shirt;

  const mouth = p.mouth ?? 0;
  const smile = p.smile ?? 1;

  const torsoBottom = outfit === "tunic" ? -150 : -245;

  return (
    <g transform={`translate(${p.x},${p.y}) scale(${(p.flip ? -1 : 1) * (p.scale ?? 1)},${p.scale ?? 1})`}>
      {/* sombra */}
      <ellipse cx={0} cy={4} rx={120} ry={18} fill="rgba(0,0,0,0.18)" />
      <g transform={`translate(0,${bob})`}>
        {/* piernas */}
        {p.sitting ? (
          <>
            {[-1, 1].map((s) => (
              <g key={s}>
                <ellipse cx={s * 40} cy={hip + 10} rx={44} ry={34} fill={pants} />
                <line x1={s * 40} y1={hip + 20} x2={s * 40} y2={-24} stroke={pants} strokeWidth={46} strokeLinecap="round" />
                <ellipse cx={s * 48} cy={-10} rx={36} ry={18} fill={shoes} />
              </g>
            ))}
          </>
        ) : (
          <>
            {[
              [-1, liftL],
              [1, liftR],
            ].map(([s, lift]) => (
              <g key={s}>
                <line x1={s * 36} y1={hip} x2={s * 36} y2={-22 - lift} stroke={pants} strokeWidth={48} strokeLinecap="round" />
                <ellipse cx={s * 44} cy={-10 - lift} rx={36} ry={18} fill={shoes} />
              </g>
            ))}
          </>
        )}

        <g transform={`translate(0,${breathe * 0.4}) ${p.sitting ? "translate(0,100)" : ""}`}>
          {/* torso */}
          <path
            d={`M -84 -462 Q -100 -462 -100 -440 L ${outfit === "tunic" ? -112 : -84} ${torsoBottom} L ${outfit === "tunic" ? 112 : 84} ${torsoBottom} L 100 -440 Q 100 -462 84 -462 Z`}
            fill={shirt}
          />
          {outfit === "shirt" && (
            <>
              <rect x={-86} y={-262} width={172} height={22} rx={6} fill={pants} />
              <rect x={-12} y={-262} width={24} height={22} rx={4} fill="#c9a24a" />
              <path d="M -30 -462 L 0 -430 L 30 -462 Z" fill="#ffffff" opacity={0.9} />
            </>
          )}
          {outfit === "hoodie" && (
            <>
              <path d="M -55 -462 Q 0 -400 55 -462" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={10} />
              <rect x={-60} y={-330} width={120} height={60} rx={20} fill="rgba(0,0,0,0.12)" />
              <line x1={-18} y1={-450} x2={-22} y2={-390} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
              <line x1={18} y1={-450} x2={22} y2={-390} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
            </>
          )}
          {outfit === "tunic" && (
            <>
              <rect x={-100} y={-300} width={200} height={24} fill="#5b3a1e" />
              <circle cx={0} cy={-288} r={12} fill="#d8b04a" />
              <path d="M -30 -462 L 0 -420 L 30 -462 Z" fill="rgba(0,0,0,0.15)" />
            </>
          )}
          {p.tie && <path d="M -10 -440 L 10 -440 L 16 -320 L 0 -296 L -16 -320 Z" fill={p.tie} />}

          {/* brazos */}
          <ArmShape side={-1} arm={armL} color={shirt} forearm={forearm} skin={skin} item={p.itemL} />
          <ArmShape side={1} arm={armR} color={shirt} forearm={forearm} skin={skin} item={p.itemR} />

          {/* cuello */}
          <rect x={-19} y={-505} width={38} height={50} fill={skin} />
          <rect x={-19} y={-470} width={38} height={10} fill="rgba(0,0,0,0.12)" />

          {/* cabeza */}
          <g transform={`translate(0,-565) rotate(${p.headTilt ?? 0})`}>
            {p.hairStyle === "long" && <path d="M -82 -10 Q -90 90 -60 110 L 60 110 Q 90 90 82 -10 Z" fill={hair} />}
            <circle cx={-72} cy={6} r={15} fill={skin} />
            <circle cx={72} cy={6} r={15} fill={skin} />
            <circle r={74} fill={skin} />
            {/* pelo */}
            {p.hairStyle !== "bald" && (p.hairStyle ?? "short") === "short" && (
              <path d="M -76 -4 Q -80 -84 0 -86 Q 82 -84 76 -4 Q 60 -46 20 -50 Q -20 -36 -76 -4 Z" fill={hair} />
            )}
            {p.hairStyle === "side" && (
              <path d="M -78 6 Q -84 -86 4 -88 Q 84 -84 78 10 Q 70 -40 40 -48 Q -10 -70 -60 -30 Q -70 -10 -78 6 Z" fill={hair} />
            )}
            {p.hairStyle === "curly" &&
              [-60, -36, -10, 16, 42, 64, -70, 72].map((cx, i) => (
                <circle key={i} cx={cx} cy={i > 5 ? -20 : -58 - Math.sin(i) * 10} r={30} fill={hair} />
              ))}
            {p.hairStyle === "long" && <path d="M -78 10 Q -86 -86 0 -88 Q 86 -86 78 10 Q 50 -50 0 -54 Q -50 -50 -78 10 Z" fill={hair} />}
            {p.hairStyle === "bun" && (
              <>
                <circle cx={0} cy={-98} r={32} fill={hair} />
                <path d="M -76 -4 Q -80 -84 0 -86 Q 82 -84 76 -4 Q 40 -60 0 -56 Q -40 -60 -76 -4 Z" fill={hair} />
              </>
            )}
            {p.hairStyle === "bald" && <path d="M -74 10 Q -80 -20 -66 -30 L -60 20 Z M 74 10 Q 80 -20 66 -30 L 60 20 Z" fill={hair} />}

            {/* mejillas */}
            <circle cx={-44} cy={26} r={13} fill="#ff7a7a" opacity={0.28} />
            <circle cx={44} cy={26} r={13} fill="#ff7a7a" opacity={0.28} />

            {/* ojos */}
            {[-1, 1].map((s) => (
              <g key={s} transform={`translate(${s * 27 + (p.lookX ?? 0) * 6},${-4 + (p.lookY ?? 0) * 4})`}>
                {wide > 0 && <ellipse rx={13 * wide} ry={15 * wide * blink} fill="#fff" />}
                <ellipse rx={7.5 + wide * 2} ry={(9.5 + wide * 2) * blink} fill="#22180f" />
                <circle cx={2.5} cy={-3} r={2.4 * blink} fill="#fff" />
              </g>
            ))}
            {/* cejas */}
            {[-1, 1].map((s) => (
              <line
                key={s}
                x1={s * 15}
                x2={s * 40}
                y1={-26 - (p.brows ?? 0) * 10 - wide * 6}
                y2={-24 - (p.brows ?? 0) * 6 - wide * 6 + (s === 1 ? 0 : 0)}
                stroke={p.hairStyle === "bald" ? "#555" : hair}
                strokeWidth={6}
                strokeLinecap="round"
              />
            ))}
            {/* nariz */}
            <path d="M -4 6 Q 6 16 -2 20" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={4} strokeLinecap="round" />

            {/* boca */}
            {mouth > 0.05 ? (
              <g transform="translate(0,38)">
                <ellipse rx={15} ry={4 + 14 * mouth} fill="#5a1d24" />
                <ellipse cy={6 * mouth} rx={9} ry={5 * mouth} fill="#e0666e" />
              </g>
            ) : (
              <path
                d={`M -16 36 Q 0 ${36 + 12 * smile} 16 36`}
                fill="none"
                stroke="#5a1d24"
                strokeWidth={5}
                strokeLinecap="round"
              />
            )}
            {p.mustache && <path d="M -32 30 Q -16 14 0 24 Q 16 14 32 30 Q 16 26 0 32 Q -16 26 -32 30 Z" fill={hair} />}
            {p.beard && (
              <path d="M -72 10 Q -70 110 0 116 Q 70 110 72 10 Q 60 40 30 52 Q 0 46 -30 52 Q -60 40 -72 10 Z" fill={hair} />
            )}
            {p.glasses && (
              <g fill="rgba(255,255,255,0.15)" stroke="#20160f" strokeWidth={5}>
                <rect x={-50} y={-24} width={42} height={38} rx={12} />
                <rect x={8} y={-24} width={42} height={38} rx={12} />
                <line x1={-8} y1={-8} x2={8} y2={-8} />
              </g>
            )}
            {p.hat === "beret" && (
              <g>
                <ellipse cx={-6} cy={-72} rx={86} ry={30} fill={p.hatColor ?? "#b0263b"} />
                <circle cx={-6} cy={-102} r={8} fill={p.hatColor ?? "#b0263b"} />
              </g>
            )}
            {p.hat === "medieval" && (
              <g>
                <path d="M -84 -40 Q -60 -130 30 -120 Q 100 -110 84 -40 Z" fill={p.hatColor ?? "#8e2a2a"} />
                <rect x={-88} y={-52} width={176} height={22} rx={10} fill="#d8b04a" />
                <path d="M 40 -118 Q 110 -150 120 -80" fill="none" stroke="#f1e2b0" strokeWidth={10} strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>
      </g>
    </g>
  );
};
