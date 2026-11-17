import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Person } from "../Person";
import { At, Stage, Tag, clamp, ease, pop } from "../ui";
import { at, mouthAt, sceneRange } from "../timing";
import { POPPINS, MONO, MEDIEVAL, HAND } from "../fonts";
import { RAY } from "./Intro";

/* ====================== ESCENA 5 · ESPAÑA MEDIEVAL ====================== */

const Town: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <defs>
      <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ffb36b" />
        <stop offset="1" stopColor="#ffe3a8" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#sky)" />
    <circle cx={820} cy={300} r={110} fill="#fff1c1" />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${((frame * (0.6 + i * 0.4) + i * 500) % 1400) - 200},${200 + i * 160})`}>
        <ellipse rx={90} ry={34} fill="#fff" opacity={0.85} />
        <ellipse cx={50} cy={-20} rx={60} ry={34} fill="#fff" opacity={0.85} />
      </g>
    ))}
    {/* colinas y castillo al fondo */}
    <path d="M 0 760 Q 250 620 520 720 Q 800 600 1080 720 L 1080 900 L 0 900 Z" fill="#d9a066" />
    <g fill="#b9834f">
      <rect x={600} y={560} width={160} height={180} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={600 + i * 44} y={536} width={28} height={30} />
      ))}
      <rect x={760} y={500} width={60} height={240} />
      <path d="M 750 500 L 790 430 L 830 500 Z" fill="#a0402a" />
    </g>
    {/* casas */}
    {[
      { x: -20, w: 300, h: 520, c: "#f3e2c0", roof: "#c4532f" },
      { x: 280, w: 260, h: 600, c: "#e8cfa4", roof: "#a8432a" },
      { x: 540, w: 300, h: 480, c: "#f6e7c9", roof: "#c4532f" },
      { x: 840, w: 260, h: 560, c: "#ead4ab", roof: "#9b3b25" },
    ].map((h, i) => (
      <g key={i}>
        <rect x={h.x} y={1300 - h.h} width={h.w} height={h.h} fill={h.c} stroke="#7a4a2a" strokeWidth={6} />
        <path d={`M ${h.x - 20} ${1300 - h.h} L ${h.x + h.w / 2} ${1300 - h.h - 120} L ${h.x + h.w + 20} ${1300 - h.h} Z`} fill={h.roof} />
        <path d={`M ${h.x + h.w / 2 - 50} 1300 L ${h.x + h.w / 2 - 50} 1170 Q ${h.x + h.w / 2} 1110 ${h.x + h.w / 2 + 50} 1170 L ${h.x + h.w / 2 + 50} 1300 Z`} fill="#6b3d22" />
        <path d={`M ${h.x + 40} ${1300 - h.h + 120} l 0 -40 q 30 -40 60 0 l 0 40 z`} fill="#3a2a1a" />
        <path d={`M ${h.x + h.w - 100} ${1300 - h.h + 120} l 0 -40 q 30 -40 60 0 l 0 40 z`} fill="#3a2a1a" />
      </g>
    ))}
    {/* toldo del puesto */}
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={`M ${120 + i * 105} 1010 L ${225 + i * 105} 1010 L ${225 + i * 105} 1080 Q ${172 + i * 105} 1110 ${120 + i * 105} 1080 Z`} fill={i % 2 ? "#ffffff" : "#c9402a"} stroke="#7a2a1a" strokeWidth={4} />
    ))}
    {/* empedrado */}
    <rect x={0} y={1300} width={1080} height={620} fill="#b7a58a" />
    {Array.from({ length: 7 }).map((_, r) =>
      Array.from({ length: 9 }).map((_, c) => (
        <ellipse key={`${r}-${c}`} cx={c * 130 + (r % 2) * 65} cy={1340 + r * 90} rx={56} ry={30} fill="#a3917a" />
      )),
    )}
  </>
);

const Amphora: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -20 -150 L 20 -150 L 18 -120 Q 70 -90 60 -30 Q 40 10 0 14 Q -40 10 -60 -30 Q -70 -90 -18 -120 Z" fill="#c4682f" stroke="#7a3a1a" strokeWidth={6} />
    <path d="M -18 -130 Q -50 -140 -44 -100" fill="none" stroke="#7a3a1a" strokeWidth={8} />
    <path d="M 18 -130 Q 50 -140 44 -100" fill="none" stroke="#7a3a1a" strokeWidth={8} />
    <rect x={-56} y={-70} width={112} height={12} fill="#7a3a1a" opacity={0.5} />
  </g>
);

export const S5Medieval: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(5);
  const lf = frame - start;
  const tQuinientos = at(5, "quinientos");
  const tEspana = at(5, "españoles");
  const tMercaderes = at(5, "mercaderes");
  const tPesar = at(5, "pesar");
  const tOnce = at(5, "once");

  // rebobinado VHS
  const rewindEnd = Math.min(tQuinientos, start + 22);
  const year = Math.round(interpolate(frame, [start, rewindEnd], [1971, 1448], clamp));
  const rewinding = frame < rewindEnd + 6;

  // balanza
  const drop = interpolate(frame, [tPesar, tPesar + 10], [-500, 0], { ...clamp });
  const tilt = frame < tPesar + 8 ? 0 : interpolate(pop(frame, tPesar + 8, 5, 120), [0, 1], [0, 12]);
  const parch = pop(frame, tOnce - 6, 12, 120);
  const write = interpolate(frame, [tOnce - 2, tOnce + 22], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <Stage zoom={1.02 + lf * 0.0004}>
        <Town frame={frame} />
        {/* puesto */}
        <rect x={90} y={1170} width={520} height={40} rx={8} fill="#7a4a2a" />
        <rect x={110} y={1210} width={30} height={200} fill="#7a4a2a" />
        <rect x={560} y={1210} width={30} height={200} fill="#7a4a2a" />
        <Amphora x={140} y={1170} s={0.7} />
        <Amphora x={540} y={1170} s={0.8} />
        {/* balanza */}
        <g transform="translate(340,1170)">
          <rect x={-10} y={-300} width={20} height={300} fill="#5b3a1e" />
          <rect x={-50} y={-12} width={100} height={12} fill="#5b3a1e" />
          <g transform={`translate(0,-300) rotate(${tilt})`}>
            <rect x={-150} y={-8} width={300} height={16} rx={8} fill="#c9a24a" />
            <circle r={16} fill="#8a6a2a" />
            {[-1, 1].map((s) => (
              <g key={s} transform={`translate(${s * 140},0) rotate(${-tilt})`}>
                <line x1={-40} y1={110} x2={0} y2={0} stroke="#8a6a2a" strokeWidth={4} />
                <line x1={40} y1={110} x2={0} y2={0} stroke="#8a6a2a" strokeWidth={4} />
                <path d="M -60 110 Q 0 150 60 110 Z" fill="#c9a24a" />
                {s === -1 && frame >= tPesar && (
                  <g transform={`translate(0,${108 + drop})`}>
                    <path d="M -46 0 Q -50 -80 -16 -86 L 16 -86 Q 50 -80 46 0 Z" fill="#d9b97a" stroke="#7a5a2a" strokeWidth={5} />
                    <path d="M -18 -86 L 0 -104 L 18 -86" fill="#d9b97a" stroke="#7a5a2a" strokeWidth={5} />
                    <text y={-30} textAnchor="middle" dominantBaseline="central" fontFamily={MEDIEVAL} fontSize={56} fill="#5b3a1e">
                      @
                    </text>
                  </g>
                )}
                {s === 1 && (
                  <g transform="translate(0,108)">
                    <rect x={-30} y={-40} width={60} height={40} rx={4} fill="#6b6b78" />
                    <rect x={-18} y={-74} width={36} height={34} rx={4} fill="#6b6b78" />
                  </g>
                )}
              </g>
            ))}
          </g>
        </g>

        <Person
          x={790}
          y={1680}
          scale={1.15}
          outfit="tunic"
          shirt="#3d6b8f"
          pants="#4a3420"
          shoes="#3a2a1a"
          hair="#5a3a22"
          beard
          hat="medieval"
          hatColor="#8e2a2a"
          skin="#e3a77d"
          armL={frame >= tMercaderes ? [interpolate(pop(frame, tMercaderes), [0, 1], [8, 100]), 20] : [8, 8]}
          armR={[12, 20]}
          lookX={-1}
          smile={1.4}
          blinkSeed={6}
        />

        {/* pergamino */}
        {frame >= tOnce - 6 && (
          <g transform={`translate(540,520) scale(${parch}) rotate(-4)`}>
            <rect x={-330} y={-200} width={660} height={400} rx={10} fill="#f3e2b8" stroke="#8a6a3a" strokeWidth={8} />
            <ellipse cx={-330} cy={0} rx={30} ry={200} fill="#e2cb92" stroke="#8a6a3a" strokeWidth={8} />
            <ellipse cx={330} cy={0} rx={30} ry={200} fill="#e2cb92" stroke="#8a6a3a" strokeWidth={8} />
            <text
              x={-140}
              y={-10}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={MEDIEVAL}
              fontSize={260}
              fill={`rgba(74,40,20,${write})`}
              stroke="#4a2814"
              strokeWidth={6}
              strokeDasharray={1400}
              strokeDashoffset={1400 * (1 - write)}
            >
              @
            </text>
            <text x={130} y={-40} textAnchor="middle" fontFamily={HAND} fontSize={96} fill="#4a2814" opacity={ease(frame, tOnce + 8, tOnce + 18)}>
              = 11,5
            </text>
            <text x={130} y={60} textAnchor="middle" fontFamily={HAND} fontSize={96} fill="#4a2814" opacity={ease(frame, tOnce + 14, tOnce + 24)}>
              kilos
            </text>
          </g>
        )}
      </Stage>

      <Tag frame={frame} from={tEspana} x={300} y={240} size={50} bg="#8e2a2a" color="#fff7e6" rotate={-4}>
        España · s. XV
      </Tag>

      {/* rebobinado */}
      {rewinding && (
        <AbsoluteFill style={{ background: `rgba(10,10,30,${interpolate(frame, [rewindEnd, rewindEnd + 6], [0.75, 0], clamp)})` }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: ((i * 263 + lf * 90) % 1920) - 20,
                height: 14 + (i % 3) * 10,
                background: "rgba(255,255,255,0.25)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              width: "100%",
              top: 760,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 280,
              color: "#fff",
              textShadow: "8px 0 #ff2e63, -8px 0 #28c2ff",
              opacity: interpolate(frame, [rewindEnd, rewindEnd + 6], [1, 0], clamp),
            }}
          >
            ◀◀ {year}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ====================== ESCENA 6 · MOTES POR EL MUNDO ====================== */

const Snail: React.FC = () => (
  <g>
    <ellipse cx={10} cy={60} rx={110} ry={26} fill="#9bd35a" stroke="#12121f" strokeWidth={6} />
    <circle cx={-80} cy={30} r={30} fill="#9bd35a" stroke="#12121f" strokeWidth={6} />
    <line x1={-90} y1={4} x2={-110} y2={-40} stroke="#12121f" strokeWidth={6} />
    <line x1={-74} y1={4} x2={-70} y2={-44} stroke="#12121f" strokeWidth={6} />
    <circle cx={-110} cy={-44} r={8} fill="#12121f" />
    <circle cx={-70} cy={-48} r={8} fill="#12121f" />
    <circle cx={20} cy={-10} r={70} fill="#ff9f43" stroke="#12121f" strokeWidth={6} />
    <path d="M 20 -10 m 0 -50 a 50 50 0 1 1 -10 2 a 36 36 0 1 0 30 30 a 20 20 0 1 1 -18 -16" fill="none" stroke="#12121f" strokeWidth={6} />
  </g>
);

const Monkey: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <path d={`M 40 40 Q 140 ${40 + Math.sin(frame / 6) * 10} 120 -50 Q 100 -110 60 -80 Q 40 -60 70 -40`} fill="none" stroke="#8a5a3a" strokeWidth={16} strokeLinecap="round" />
    <ellipse cx={0} cy={30} rx={60} ry={56} fill="#8a5a3a" stroke="#12121f" strokeWidth={6} />
    <circle cx={0} cy={-50} r={52} fill="#8a5a3a" stroke="#12121f" strokeWidth={6} />
    <circle cx={-52} cy={-50} r={18} fill="#8a5a3a" stroke="#12121f" strokeWidth={6} />
    <circle cx={52} cy={-50} r={18} fill="#8a5a3a" stroke="#12121f" strokeWidth={6} />
    <ellipse cx={0} cy={-40} rx={36} ry={32} fill="#f2c9a0" />
    <circle cx={-14} cy={-52} r={7} fill="#12121f" />
    <circle cx={14} cy={-52} r={7} fill="#12121f" />
    <path d="M -12 -28 Q 0 -18 12 -28" fill="none" stroke="#12121f" strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Strudel: React.FC = () => (
  <g>
    <ellipse cx={0} cy={50} rx={130} ry={22} fill="#ffffff" stroke="#12121f" strokeWidth={6} />
    <rect x={-110} y={-40} width={170} height={80} rx={40} fill="#e3a34f" stroke="#12121f" strokeWidth={6} />
    <circle cx={70} cy={0} r={44} fill="#f2c27a" stroke="#12121f" strokeWidth={6} />
    <path d="M 70 0 m 0 -28 a 28 28 0 1 1 -6 1 a 18 18 0 1 0 16 16 a 8 8 0 1 1 -8 -6" fill="none" stroke="#8a4a1a" strokeWidth={6} />
    {[-80, -40, 0].map((x) => (
      <circle key={x} cx={x} cy={-44} r={6} fill="#fff" />
    ))}
  </g>
);

export const S6World: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(6);
  const lf = frame - start;
  const tMote = at(6, "mote");
  const tItalia = at(6, "Italia");
  const tHolanda = at(6, "Holanda");
  const tIsrael = at(6, "Israel");
  const tStrudel = at(6, "strudel");
  const globe = pop(frame, start, 12, 90);

  const cards = [
    { t: tItalia, x: 290, y: 460, rot: -6, color: "#ff9f43", land: "ITALIA", name: "chiocciola", icon: <Snail /> },
    { t: tHolanda, x: 800, y: 760, rot: 5, color: "#ff8a3d", land: "HOLANDA", name: "apenstaartje", icon: <Monkey frame={frame} /> },
    { t: tIsrael, x: 290, y: 1130, rot: -4, color: "#28c2ff", land: "ISRAEL", name: "shtrudel", icon: <Strudel /> },
  ];

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2b6fd6, #142a66)" }}>
      <Stage>
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={(i * 263) % 1080} cy={(i * 457) % 1920} r={2 + (i % 3)} fill="#fff" opacity={0.3 + 0.3 * Math.sin(frame / 8 + i)} />
        ))}
        {/* globo */}
        <g transform={`translate(540,800) scale(${globe}) rotate(${lf * 0.15})`}>
          <circle r={330} fill="#3aa0ff" stroke="#12121f" strokeWidth={10} />
          <clipPath id="globeclip">
            <circle r={325} />
          </clipPath>
          <g clipPath="url(#globeclip)">
            <g transform={`translate(${((lf * 3) % 900) - 450},0)`}>
              {[-900, 0, 900].map((o) => (
                <g key={o} transform={`translate(${o},0)`} fill="#3ddc97" stroke="#12121f" strokeWidth={6}>
                  <path d="M -260 -160 Q -180 -260 -60 -200 Q 0 -120 -80 -60 Q -160 0 -200 -60 Q -280 -80 -260 -160 Z" />
                  <path d="M -120 20 Q -40 0 -20 80 Q -40 200 -100 260 Q -150 160 -120 20 Z" />
                  <path d="M 60 -220 Q 200 -260 300 -160 Q 340 -60 240 -40 Q 160 -80 120 -20 Q 40 -60 60 -220 Z" />
                  <path d="M 120 20 Q 220 0 260 80 Q 240 180 160 160 Q 100 100 120 20 Z" />
                </g>
              ))}
            </g>
            <ellipse cx={-120} cy={-140} rx={110} ry={60} fill="#fff" opacity={0.2} />
          </g>
          {/* órbita de @ */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + lf / 30;
            return <At key={i} x={Math.cos(a) * 420} y={Math.sin(a) * 160} size={70} color="#ffd23f" rotate={-lf * 0.15} />;
          })}
        </g>

        {cards.map((c, i) => {
          if (frame < c.t - 3) return null;
          const s = pop(frame, c.t - 3, 9, 170);
          const wob = Math.sin((frame + i * 20) / 10) * 2;
          return (
            <g key={i} transform={`translate(${c.x},${c.y}) scale(${s}) rotate(${c.rot + wob})`}>
              <rect x={-230} y={-200} width={460} height={400} rx={36} fill="#fff7e6" stroke="#12121f" strokeWidth={10} />
              <rect x={-230} y={-200} width={460} height={80} rx={36} fill={c.color} stroke="#12121f" strokeWidth={10} />
              <text y={-158} textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={900} fontSize={50} fill="#12121f">
                {c.land}
              </text>
              <g transform="translate(0,30) scale(0.95)">{c.icon}</g>
              <text y={160} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#12121f">
                «{c.name}»
              </text>
            </g>
          );
        })}
        {frame >= tStrudel && (
          <g transform={`translate(760,1180) scale(${pop(frame, tStrudel, 8, 200)}) rotate(10)`}>
            <text textAnchor="middle" fontFamily={POPPINS} fontWeight={900} fontSize={84} fill="#ffd23f" stroke="#12121f" strokeWidth={10} paintOrder="stroke">
              ¡ÑAM!
            </text>
          </g>
        )}
      </Stage>
      <Tag frame={frame} from={tMote} x={540} y={130} size={54} bg="#ffd23f" rotate={-3}>
        LOS MOTES DE LA @
      </Tag>
    </AbsoluteFill>
  );
};

/* ====================== ESCENA 7 · FINAL ====================== */

export const S7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(7);
  const lf = frame - start;
  const tConectando = at(7, "conectando");
  const tTu = at(7, "tú");
  const tComentarios = at(7, "comentarios");
  const net = ease(frame, tConectando - 4, tConectando + 20);
  const ask = pop(frame, tTu - 2, 10, 140);

  const nodes: [number, number][] = [
    [200, 420],
    [540, 280],
    [880, 420],
    [300, 720],
    [780, 700],
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [2, 4],
    [3, 4],
    [1, 4],
    [1, 3],
  ];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#ff5d8f, #ff9f43)" }}>
      <Stage zoom={1 + lf * 0.0005}>
        {/* rayos de fondo */}
        <g transform={`translate(540,700) rotate(${lf * 0.3})`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M 0 0 L -90 -1400 L 90 -1400 Z" fill="#ffffff" opacity={0.08} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        {/* red de @ */}
        {links.map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          const p = Math.min(1, Math.max(0, net * 1.6 - i * 0.1));
          const mt = ((lf * 0.03 + i * 0.37) % 1) * p;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="#fff" strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" />
              {p >= 1 && (
                <g transform={`translate(${x1 + (x2 - x1) * mt},${y1 + (y2 - y1) * mt})`}>
                  <rect x={-24} y={-17} width={48} height={34} rx={5} fill="#ffd23f" stroke="#12121f" strokeWidth={4} />
                  <path d="M -24 -17 L 0 3 L 24 -17" fill="none" stroke="#12121f" strokeWidth={4} />
                </g>
              )}
            </g>
          );
        })}
        {nodes.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${pop(frame, start + 3 + i * 3)})`}>
            <circle r={70} fill="#fff" stroke="#12121f" strokeWidth={8} />
            <At x={0} y={-4} size={90} color={["#4f7cff", "#ff5d8f", "#3ddc97", "#a06bff", "#ff8a3d"][i]} />
          </g>
        ))}
        {/* suelo */}
        <ellipse cx={540} cy={1900} rx={900} ry={360} fill="#3ddc97" stroke="#12121f" strokeWidth={10} />

        {/* Mercader, presentadora y Ray saludando */}
        <Person
          x={190}
          y={1720}
          scale={0.8}
          outfit="tunic"
          shirt="#3d6b8f"
          pants="#4a3420"
          hair="#5a3a22"
          beard
          hat="medieval"
          skin="#e3a77d"
          armL={[150 + Math.sin(frame / 4) * 12, -20]}
          smile={1.5}
          blinkSeed={6}
        />
        <Person x={890} y={1720} scale={0.8} {...RAY} armR={[150 + Math.sin(frame / 4 + 1) * 12, -20]} smile={1.5} blinkSeed={2} />
        <Person
          x={540}
          y={1800}
          scale={1.05}
          outfit="hoodie"
          shirt="#ff8a3d"
          pants="#2b2f4f"
          hair="#5a3420"
          hairStyle="curly"
          skin="#e8b08a"
          mouth={mouthAt(frame)}
          armR={frame >= tTu ? [60, -30] : [20, 20]}
          armL={frame >= tComentarios ? [10, 140] : [15, 15]}
          headTilt={Math.sin(frame / 12) * 4}
          blinkSeed={3}
        />
      </Stage>

      {frame >= tTu - 2 && (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 960,
            transform: `translate(-50%,-50%) scale(${ask}) rotate(-3deg)`,
            background: "#12121f",
            color: "#fff",
            fontFamily: POPPINS,
            fontWeight: 900,
            fontSize: 74,
            lineHeight: 1.05,
            textAlign: "center",
            padding: "28px 48px",
            borderRadius: 40,
            boxShadow: "0 14px 0 rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          ¿CÓMO LA LLAMAS <span style={{ color: "#ffd23f" }}>TÚ</span>?
          <div style={{ fontSize: 44, color: "#ff9f43", marginTop: 8, fontFamily: MONO }}>
            ▼ comentarios ▼
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
