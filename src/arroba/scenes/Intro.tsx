import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Person } from "../Person";
import { At, Stage, Tag, clamp, ease, pop } from "../ui";
import { at, mouthAt, sceneRange } from "../timing";
import { POPPINS, MONO } from "../fonts";

/* ====================== ESCENA 0 · GANCHO ====================== */

const Phone: React.FC<{ glow: number }> = ({ glow }) => (
  <g transform="translate(0,-40)">
    <rect x={-34} y={-62} width={68} height={124} rx={12} fill="#15151f" />
    <rect x={-28} y={-54} width={56} height={104} rx={6} fill={`rgba(120,200,255,${0.55 + glow * 0.45})`} />
    <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={900} fontSize={46} fill="#12121f">
      @
    </text>
  </g>
);

const Stars: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {[
      [210, 330],
      [300, 290],
      [420, 360],
      [250, 470],
      [380, 520],
      [455, 300],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={4 + 2 * Math.sin(frame / 6 + i * 2)} fill="#fff6c9" />
    ))}
  </>
);

export const S0Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(0);
  const tSimbolo = at(0, "símbolo");
  const tCien = at(0, "cien");
  const tIdea = at(0, "idea");
  const tNo = at(0, "no");

  const big = pop(frame, tSimbolo, 9, 120);
  const confused = ease(frame, tNo, tNo + 8);
  const scroll = Math.sin(frame / 4) * 4;
  const counter = Math.round(interpolate(frame, [tCien, tCien + 24], [0, 100], clamp));

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2e2466, #5a3fa8)" }}>
      <Stage zoom={1 + (frame - start) * 0.0008}>
        {/* ventana */}
        <rect x={160} y={240} width={330} height={360} rx={18} fill="#0f1640" stroke="#d9c7ff" strokeWidth={16} />
        <Stars frame={frame} />
        <circle cx={410} cy={330} r={46} fill="#fff1b8" />
        <circle cx={430} cy={318} r={46} fill="#0f1640" />
        <line x1={325} y1={240} x2={325} y2={600} stroke="#d9c7ff" strokeWidth={12} />
        <path d="M 130 220 Q 170 420 140 640 L 200 640 Q 230 420 200 220 Z" fill="#ff5d8f" />
        <path d="M 520 220 Q 480 420 510 640 L 450 640 Q 420 420 450 220 Z" fill="#ff5d8f" />
        <rect x={110} y={208} width={440} height={18} rx={9} fill="#3a2a1a" />
        {/* póster y estantería */}
        <g transform="rotate(4 820 400)">
          <rect x={690} y={260} width={260} height={330} rx={10} fill="#ffd23f" />
          <At x={820} y={400} size={180} color="#ff5d8f" />
          <rect x={720} y={520} width={200} height={20} rx={10} fill="#12121f" opacity={0.6} />
        </g>
        <rect x={640} y={720} width={340} height={20} rx={6} fill="#3a2a1a" />
        {["#3ddc97", "#4f7cff", "#ff8a3d", "#ff5d8f", "#ffd23f"].map((c, i) => (
          <rect key={i} x={660 + i * 46} y={620 + (i % 2) * 14} width={38} height={100 - (i % 2) * 14} rx={4} fill={c} />
        ))}
        <circle cx={930} cy={690} r={28} fill="#3ddc97" />
        <rect x={912} y={690} width={36} height={30} rx={6} fill="#a0603a" />
        {/* suelo */}
        <rect x={0} y={1420} width={1080} height={500} fill="#271d55" />
        {/* cama */}
        <rect x={60} y={1080} width={960} height={110} rx={30} fill="#f3e9ff" />
        <rect x={40} y={1170} width={1000} height={260} rx={40} fill="#4f7cff" />
        <path d="M 40 1250 Q 540 1200 1040 1250 L 1040 1430 L 40 1430 Z" fill="#3c63e0" />
        <rect x={40} y={1400} width={40} height={90} fill="#3a2a1a" />
        <rect x={1000} y={1400} width={40} height={90} fill="#3a2a1a" />
        {/* luz del móvil */}
        <path d="M 540 900 L 380 560 L 700 560 Z" fill="rgba(140,210,255,0.13)" />

        <Person
          x={540}
          y={1330}
          scale={1.25}
          sitting
          outfit="hoodie"
          shirt="#ff8a3d"
          pants="#2b2f4f"
          hair="#5a3420"
          hairStyle="curly"
          skin="#e8b08a"
          armR={[30 + confused * 40, 130 - confused * 60 + scroll]}
          armL={[10 + confused * 70, 20 + confused * 40]}
          itemR={
            <g transform={`rotate(${-(30 + confused * 40) + 130 - confused * 60 + scroll})`} opacity={1 - confused}>
              <Phone glow={big} />
            </g>
          }
          mouth={mouthAt(frame)}
          lookY={1 - confused}
          lookX={confused * 0.5}
          headTilt={confused * -8}
          eyesWide={confused * 0.8}
          brows={confused}
          blinkSeed={3}
        />

        {/* @ gigante */}
        {frame >= tSimbolo && (
          <g transform={`translate(540,${interpolate(big, [0, 1], [900, 400])}) scale(${big * 0.8}) rotate(${(1 - big) * -200 + Math.sin(frame / 8) * 4})`}>
            <circle r={230} fill="#ffd23f" opacity={0.18} />
            <circle r={190} fill="#ffd23f" opacity={0.18} />
            <At x={0} y={-10} size={360} color="#ffffff" />
          </g>
        )}
        {/* interrogaciones */}
        {[0, 1, 2].map((i) => {
          const p = pop(frame, tIdea + i * 4, 8, 180);
          return frame >= tIdea + i * 4 ? (
            <text
              key={i}
              x={360 + i * 180}
              y={880 - i * 30 + Math.sin(frame / 5 + i) * 10}
              fontFamily={POPPINS}
              fontWeight={900}
              fontSize={120 * p}
              textAnchor="middle"
              fill="#ff5d8f"
              stroke="#12121f"
              strokeWidth={8}
              paintOrder="stroke"
              transform={`rotate(${(i - 1) * 14} ${360 + i * 180} 880)`}
            >
              ?
            </text>
          ) : null;
        })}
      </Stage>

      {/* notificaciones */}
      <Tag frame={frame} from={start + 4} x={300} y={150} size={40} bg="#ffffff" rotate={-4}>
        @antonio te mencionó
      </Tag>
      <Tag frame={frame} from={start + 12} x={720} y={230} size={40} bg="#3ddc97" rotate={3}>
        ana@mail.com
      </Tag>
      {frame >= tCien && (
        <div
          style={{
            position: "absolute",
            left: 790,
            top: 760,
            transform: `scale(${pop(frame, tCien)}) rotate(8deg)`,
            fontFamily: MONO,
            fontSize: 110,
            color: "#ffd23f",
            textShadow: "6px 6px 0 #12121f",
          }}
        >
          x{counter}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ====================== Laboratorio 1971 (fondo compartido) ====================== */

const Lab: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <rect x={0} y={0} width={1080} height={1920} fill="#f2a541" />
    {/* rayas setenteras */}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={0} y={140 + i * 46} width={1080} height={30} fill={["#e0582f", "#c9402a", "#8a2f20"][i]} />
    ))}
    {/* friso de madera */}
    <rect x={0} y={1000} width={1080} height={420} fill="#9a5b2e" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={i * 92} y={1000} width={6} height={420} fill="#7a4420" />
    ))}
    <rect x={0} y={990} width={1080} height={20} fill="#5a3218" />
    {/* suelo a cuadros */}
    {Array.from({ length: 6 }).map((_, r) =>
      Array.from({ length: 10 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={c * 108} y={1420 + r * 90} width={108} height={90} fill={(r + c) % 2 ? "#e9e1cf" : "#c7bda6"} />
      )),
    )}
    {/* reloj */}
    <circle cx={900} cy={420} r={70} fill="#fff7e6" stroke="#5a3218" strokeWidth={12} />
    <line x1={900} y1={420} x2={900 + 40 * Math.sin(frame / 20)} y2={420 - 40 * Math.cos(frame / 20)} stroke="#12121f" strokeWidth={8} strokeLinecap="round" />
    <line x1={900} y1={420} x2={930} y2={420} stroke="#12121f" strokeWidth={8} strokeLinecap="round" />
    {/* póster ARPANET */}
    <g transform="rotate(-3 220 520)">
      <rect x={70} y={360} width={300} height={330} rx={8} fill="#fff7e6" />
      <text x={220} y={410} textAnchor="middle" fontFamily={MONO} fontSize={52} fill="#c9402a">
        ARPANET
      </text>
      {[
        [120, 480],
        [220, 460],
        [320, 500],
        [160, 600],
        [280, 620],
      ].map(([x, y], i, arr) => (
        <g key={i}>
          {i > 0 && <line x1={arr[i - 1][0]} y1={arr[i - 1][1]} x2={x} y2={y} stroke="#12121f" strokeWidth={4} />}
          <circle cx={x} cy={y} r={14} fill={frame % 30 < 15 && i % 2 ? "#3ddc97" : "#4f7cff"} stroke="#12121f" strokeWidth={4} />
        </g>
      ))}
    </g>
    {/* planta */}
    <rect x={950} y={1300} width={90} height={120} rx={10} fill="#c9402a" />
    {[-30, 0, 30].map((r, i) => (
      <ellipse key={i} cx={995} cy={1230} rx={26} ry={90} fill="#3a8f4a" transform={`rotate(${r + Math.sin(frame / 25 + i) * 3} 995 1300)`} />
    ))}
  </>
);

/** Ordenador PDP-10 estilizado */
const Mainframe: React.FC<{ x: number; y: number; frame: number; seed: number; label: string }> = ({ x, y, frame, seed, label }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-150} y={-640} width={300} height={640} rx={14} fill="#e8e1cf" stroke="#12121f" strokeWidth={8} />
    <rect x={-130} y={-610} width={260} height={110} rx={8} fill="#2d4e8f" />
    {Array.from({ length: 18 }).map((_, i) => (
      <circle
        key={i}
        cx={-105 + (i % 9) * 26}
        cy={-580 + Math.floor(i / 9) * 46}
        r={8}
        fill={(Math.floor(frame / 4) * 7 + i * 13 + seed) % 5 < 2 ? "#ffd23f" : "#173063"}
      />
    ))}
    {[-60, 60].map((cx, i) => (
      <g key={i} transform={`translate(${cx},-380) rotate(${(frame * (i ? 6 : -6) + seed * 40) % 360})`}>
        <circle r={52} fill="#1f1f2a" />
        <circle r={20} fill="#e8e1cf" />
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={34 * Math.cos((a * Math.PI) / 180)} cy={34 * Math.sin((a * Math.PI) / 180)} r={8} fill="#e8e1cf" />
        ))}
      </g>
    ))}
    <rect x={-130} y={-280} width={260} height={180} rx={8} fill="#d3c9b0" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-110} y={-260 + i * 40} width={220} height={18} rx={6} fill="#b8ac90" />
    ))}
    <text x={0} y={-50} textAnchor="middle" fontFamily={MONO} fontSize={44} fill="#12121f">
      {label}
    </text>
  </g>
);

/* ====================== ESCENA 1 · 1971 ====================== */

const RAY = {
  hair: "#2a1a10",
  hairStyle: "side" as const,
  mustache: true,
  glasses: true,
  shirt: "#bfe0ff",
  tie: "#c9402a",
  pants: "#6b4a2e",
  skin: "#f0c09a",
};

export const S1Year: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(1);
  const lf = frame - start;
  const tRay = at(1, "Ray");
  const tIng = at(1, "ingeniero");
  const tReto = at(1, "reto");
  const tMensaje = at(1, "mensaje");

  const walkEnd = start + 40;
  const x = interpolate(frame, [start, walkEnd], [-160, 690], { ...clamp });
  const walking = frame < walkEnd;
  const thinking = ease(frame, tReto, tReto + 8);
  const bubble = pop(frame, tMensaje - 4, 10, 120);
  const flip = pop(frame, start + 2, 8, 120);

  return (
    <AbsoluteFill>
      <Stage zoom={1.02 + lf * 0.0005}>
        <Lab frame={frame} />
        {/* calendario 1971 */}
        <g transform={`translate(540,480) rotate(${(1 - flip) * 30}) scale(${flip})`}>
          <rect x={-170} y={-170} width={340} height={340} rx={16} fill="#fff7e6" stroke="#12121f" strokeWidth={10} />
          <rect x={-170} y={-170} width={340} height={90} rx={16} fill="#c9402a" />
          <circle cx={-90} cy={-170} r={14} fill="#12121f" />
          <circle cx={90} cy={-170} r={14} fill="#12121f" />
          <text x={0} y={-112} textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={800} fontSize={48} fill="#fff">
            ENERO
          </text>
          <text x={0} y={40} textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={900} fontSize={130} fill="#12121f">
            1971
          </text>
        </g>
        {/* escritorio con teletipo */}
        <rect x={640} y={1180} width={400} height={30} rx={8} fill="#5a3218" />
        <rect x={660} y={1210} width={24} height={210} fill="#5a3218" />
        <rect x={996} y={1210} width={24} height={210} fill="#5a3218" />
        <rect x={700} y={1080} width={280} height={100} rx={16} fill="#e8e1cf" stroke="#12121f" strokeWidth={6} />
        <rect x={740} y={1040} width={200} height={50} rx={8} fill="#fff" stroke="#12121f" strokeWidth={6} />
        <line x1={760} y1={1060} x2={920} y2={1060} stroke="#999" strokeWidth={4} />

        <Person
          x={x}
          y={1560}
          scale={1.3}
          {...RAY}
          walk={walking ? lf / 3.2 : null}
          armR={walking ? undefined : [interpolate(thinking, [0, 1], [10, 30]), interpolate(thinking, [0, 1], [10, 150])]}
          armL={walking ? undefined : [12, 10]}
          lookX={thinking * 0.8}
          lookY={-thinking}
          headTilt={thinking * 6}
          brows={thinking * 0.6}
          smile={1 - thinking}
          blinkSeed={1}
        />

        {/* bocadillo de pensamiento */}
        {frame >= tMensaje - 4 && (
          <g transform={`translate(780,760) scale(${bubble})`}>
            <circle cx={-170} cy={180} r={16} fill="#fff" />
            <circle cx={-140} cy={130} r={26} fill="#fff" />
            <ellipse rx={220} ry={130} fill="#fff" stroke="#12121f" strokeWidth={8} />
            <rect x={-170} y={-40} width={80} height={70} rx={8} fill="#4f7cff" stroke="#12121f" strokeWidth={6} />
            <rect x={90} y={-40} width={80} height={70} rx={8} fill="#4f7cff" stroke="#12121f" strokeWidth={6} />
            <g transform={`translate(${interpolate(frame, [tMensaje, tMensaje + 25], [-70, 70], clamp)},${-Math.sin(interpolate(frame, [tMensaje, tMensaje + 25], [0, Math.PI], clamp)) * 50})`}>
              <rect x={-36} y={-26} width={72} height={52} rx={6} fill="#ffd23f" stroke="#12121f" strokeWidth={5} />
              <path d="M -36 -26 L 0 4 L 36 -26" fill="none" stroke="#12121f" strokeWidth={5} />
            </g>
          </g>
        )}
      </Stage>
      <Tag frame={frame} from={tRay} x={280} y={760} size={56} bg="#12121f" color="#ffd23f" rotate={-4}>
        RAY TOMLINSON
      </Tag>
      <Tag frame={frame} from={tIng} x={280} y={850} size={40} rotate={2}>
        ingeniero · BBN
      </Tag>
    </AbsoluteFill>
  );
};

/* ====================== ESCENA 2 · LAS DOS MÁQUINAS ====================== */

export const S2Machines: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(2);
  const tLas = at(2, "Las");
  const tLado = at(2, "pegadas");

  // empieza muy cerca de una máquina y se aleja para revelar la otra
  const zoom = interpolate(frame, [start, tLas, tLas + 18], [1.9, 1.9, 1.0], { ...clamp });
  const ox = interpolate(frame, [start, tLas + 18], [380, 540], clamp);
  const shrug = ease(frame, tLado - 6, tLado + 4);
  const hop = interpolate(frame, [tLado, tLado + 14], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <Stage zoom={zoom} ox={ox} oy={1000}>
        <Lab frame={frame} />
        <Mainframe x={380} y={1440} frame={frame} seed={0} label="BBN-TENEXA" />
        <Mainframe x={700} y={1440} frame={frame} seed={3} label="BBN-TENEXB" />
        {/* cable */}
        <path d="M 530 1400 Q 540 1460 550 1400" fill="none" stroke="#12121f" strokeWidth={10} />
        {/* sobre saltando */}
        {frame >= tLado && hop < 1 && (
          <g transform={`translate(${interpolate(hop, [0, 1], [430, 650])},${700 - Math.sin(hop * Math.PI) * 160})`}>
            <rect x={-40} y={-28} width={80} height={56} rx={6} fill="#ffd23f" stroke="#12121f" strokeWidth={6} />
            <path d="M -40 -28 L 0 6 L 40 -28" fill="none" stroke="#12121f" strokeWidth={6} />
          </g>
        )}
        <Person
          x={540}
          y={1660}
          scale={0.95}
          {...RAY}
          armL={[interpolate(shrug, [0, 1], [10, 70]), interpolate(shrug, [0, 1], [10, -70])]}
          armR={[interpolate(shrug, [0, 1], [10, 70]), interpolate(shrug, [0, 1], [10, -70])]}
          headTilt={shrug * -10}
          eyesWide={shrug * 0.5}
          smile={1 + shrug}
          brows={shrug}
          blinkSeed={2}
        />
      </Stage>
      <Tag frame={frame} from={tLado} x={540} y={300} size={68} bg="#ff5d8f" color="#fff" rotate={-5}>
        ¡A UN PASO!
      </Tag>
    </AbsoluteFill>
  );
};

export { Lab, Mainframe, RAY };
