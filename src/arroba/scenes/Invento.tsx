import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Person } from "../Person";
import { At, Stage, Tag, clamp, ease, pop } from "../ui";
import { at, sceneRange } from "../timing";
import { POPPINS, MONO } from "../fonts";
import { Lab, RAY } from "./Intro";

/* ====================== ESCENA 3 · EL TECLADO ====================== */

const ROWS = ["1234567890", "QWERTYUIOP@", "ASDFGHJKL", "ZXCVBNM"];

const Key: React.FC<{ x: number; y: number; ch: string; hot: number; press: number }> = ({ x, y, ch, hot, press }) => (
  <g transform={`translate(${x},${y + press * 14})`}>
    {hot > 0 && <circle r={60 + hot * 40 + Math.sin(hot * 20) * 4} fill="#ffd23f" opacity={0.35 * hot} />}
    <rect x={-8} y={0} width={16} height={60 - press * 14} fill="#555" />
    <circle cy={press * 0 + 10} r={44} fill="#1b1b24" />
    <circle r={44} fill={hot > 0 ? "#ffd23f" : "#f4efe2"} stroke="#1b1b24" strokeWidth={7} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={800} fontSize={ch === "@" ? 56 : 40} fill="#1b1b24">
      {ch}
    </text>
  </g>
);

const NameCard: React.FC<{ x: number; y: number; s: number; label: string; icon: "person" | "pc"; color: string }> = ({ x, y, s, label, icon, color }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-210} y={-120} width={420} height={240} rx={30} fill="#fff" stroke="#12121f" strokeWidth={8} />
    <circle cx={0} cy={-35} r={58} fill={color} />
    {icon === "person" ? (
      <>
        <circle cx={0} cy={-50} r={20} fill="#fff" />
        <path d="M -32 -8 Q 0 -40 32 -8 Z" fill="#fff" />
      </>
    ) : (
      <>
        <rect x={-30} y={-62} width={60} height={42} rx={6} fill="#fff" />
        <rect x={-10} y={-18} width={20} height={10} fill="#fff" />
      </>
    )}
    <text y={70} textAnchor="middle" fontFamily={MONO} fontSize={56} fill="#12121f">
      {label}
    </text>
  </g>
);

export const S3Keyboard: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(3);
  const tProblema = at(3, "problema");
  const tPersona = at(3, "persona");
  const tMaquina = at(3, "máquina", 0);
  const tTeclado = at(3, "teclado");
  const tArroba = at(3, "arroba");
  const tCasi = at(3, "Casi");
  const tAt = at(3, "at");
  const tUsuario = at(3, "usuario");
  const tEN = at(3, "en", 1);
  const tMaq2 = at(3, "máquina", 1);
  const tPerfecta = at(3, "perfecta");

  // fase A: dos tarjetas
  const cardsIn = frame < tTeclado + 10;
  const kbIn = ease(frame, tTeclado - 6, tTeclado + 12);
  const kbOut = ease(frame, tCasi - 4, tCasi + 10);
  const pan = interpolate(frame, [tTeclado, tArroba - 4], [260, -330], { ...clamp });
  const hot = frame >= tArroba - 2 ? Math.min(1, (frame - tArroba + 2) / 8) : 0;
  const press = interpolate(frame, [tArroba, tArroba + 4, tArroba + 10], [0, 1, 0], clamp);
  const finger = interpolate(frame, [tArroba - 12, tArroba, tArroba + 14], [-500, 0, -300], clamp);

  const addrIn = frame >= tCasi;
  const typed = Math.floor(interpolate(frame, [tCasi + 2, tAt + 6], [0, 20], clamp));
  const addr = "tomlinson@bbn-tenexa".slice(0, typed);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2a2147, #3d2d6b)" }}>
      {/* Fase A · el problema */}
      {cardsIn && (
        <Stage zoom={1 + (frame - start) * 0.0006}>
          <Lab frame={frame} />
          <rect x={0} y={0} width={1080} height={1920} fill="rgba(20,14,40,0.55)" />
          <NameCard x={540} y={420} s={pop(frame, tPersona - 4)} label="TOMLINSON" icon="person" color="#ff5d8f" />
          <NameCard x={540} y={920} s={pop(frame, tMaquina - 4)} label="BBN-TENEXA" icon="pc" color="#4f7cff" />
          {frame >= tMaquina + 4 && (
            <text
              x={540}
              y={680}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={POPPINS}
              fontWeight={900}
              fontSize={130 * pop(frame, tMaquina + 4)}
              fill="#ffd23f"
              stroke="#12121f"
              strokeWidth={10}
              paintOrder="stroke"
              transform={`rotate(${Math.sin(frame / 4) * 8} 540 680)`}
            >
              ¿ + ?
            </text>
          )}
          <Person x={200} y={1700} scale={0.8} {...RAY} armR={[30, 150]} armL={[10, 10]} lookX={1} lookY={-1} brows={0.7} smile={0} headTilt={8} blinkSeed={4} />
          {frame >= tProblema && (
            <g transform={`translate(860,${1150}) scale(${pop(frame, tProblema)})`}>
              <path d="M 0 -110 L 100 70 L -100 70 Z" fill="#ffd23f" stroke="#12121f" strokeWidth={10} strokeLinejoin="round" />
              <text y={30} textAnchor="middle" fontFamily={POPPINS} fontWeight={900} fontSize={110} fill="#12121f">
                !
              </text>
            </g>
          )}
        </Stage>
      )}

      {/* Fase B · teclado */}
      {kbIn > 0 && kbOut < 1 && (
        <AbsoluteFill style={{ transform: `translateY(${(1 - kbIn) * 1400 + kbOut * -1600}px)` }}>
          <Stage>
            <rect x={0} y={0} width={1080} height={1920} fill="#2a2147" />
            {/* rayas de luz */}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-200 + i * 300} y={-200} width={120} height={2400} fill="#ffffff" opacity={0.04} transform="rotate(20 540 960)" />
            ))}
            <g transform={`translate(540,860) scale(1.35) translate(-540,-740) translate(${pan},0)`}>
              <rect x={-60} y={380} width={1300} height={720} rx={50} fill="#7a6a52" />
              <rect x={-40} y={400} width={1260} height={680} rx={40} fill="#958262" />
              {ROWS.map((row, r) =>
                row.split("").map((ch, c) => {
                  const isAt = ch === "@";
                  return (
                    <Key
                      key={`${r}-${c}`}
                      x={60 + c * 108 + r * 30}
                      y={470 + r * 160}
                      ch={ch}
                      hot={isAt ? hot : 0}
                      press={isAt ? press : 0}
                    />
                  );
                }),
              )}
              {/* dedo */}
              <g transform={`translate(${60 + 10 * 108 + 30},${470 + 160 + finger - 40})`}>
                <rect x={-36} y={-700} width={72} height={680} rx={36} fill="#f0c09a" />
                <rect x={-30} y={-80} width={60} height={50} rx={20} fill="#ffe1cc" />
                <rect x={-60} y={-760} width={120} height={160} rx={30} fill="#bfe0ff" />
              </g>
            </g>
          </Stage>
          <Tag frame={frame} from={tArroba} x={540} y={1180} size={80} bg="#ffd23f" rotate={-4}>
            ¡LA ARROBA!
          </Tag>
        </AbsoluteFill>
      )}

      {/* Fase C · la dirección */}
      {addrIn && (
        <AbsoluteFill style={{ transform: `translateY(${(1 - kbOut) * 1600}px)` }}>
          <Stage>
            <rect x={0} y={0} width={1080} height={1920} fill="#1e7f63" />
            {Array.from({ length: 30 }).map((_, i) => (
              <At key={i} x={(i * 197) % 1080} y={((i * 331 + frame * 3) % 2100) - 100} size={60 + (i % 3) * 30} color="#ffffff" opacity={0.08} stroke="none" />
            ))}
            {/* sobre */}
            <g transform={`translate(540,560) scale(${pop(frame, tCasi)})`}>
              <rect x={-400} y={-230} width={800} height={460} rx={30} fill="#fff7e6" stroke="#12121f" strokeWidth={10} />
              <path d="M -400 -230 L 0 40 L 400 -230" fill="none" stroke="#12121f" strokeWidth={10} strokeLinejoin="round" />
              <rect x={260} y={-200} width={110} height={130} rx={8} fill="#ff5d8f" stroke="#12121f" strokeWidth={6} />
              <At x={315} y={-135} size={80} color="#fff" stroke="#12121f" />
              <rect x={-360} y={100} width={720} height={100} rx={18} fill="#12121f" />
              <text x={0} y={152} textAnchor="middle" dominantBaseline="central" fontFamily={MONO} fontSize={76} fill="#3ddc97">
                {addr}
                {frame % 16 < 8 ? "▌" : " "}
              </text>
            </g>
            {/* USUARIO @ MÁQUINA */}
            {[
              { t: tUsuario, x: 200, label: "USUARIO", c: "#ff5d8f" },
              { t: tEN, x: 540, label: "@ = EN", c: "#ffd23f" },
              { t: tMaq2, x: 880, label: "MÁQUINA", c: "#4f7cff" },
            ].map((b, i) =>
              frame >= b.t ? (
                <g key={i} transform={`translate(${b.x},${960}) scale(${pop(frame, b.t, 8, 200)}) rotate(${(i - 1) * 4})`}>
                  <rect x={-140} y={-60} width={280} height={120} rx={60} fill={b.c} stroke="#12121f" strokeWidth={8} />
                  <text textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={900} fontSize={i === 1 ? 56 : 48} fill="#12121f">
                    {b.label}
                  </text>
                </g>
              ) : null,
            )}
            {/* sello PERFECTA */}
            {frame >= tPerfecta && (
              <g transform={`translate(540,1180) rotate(-8) scale(${interpolate(pop(frame, tPerfecta, 12, 300), [0, 1], [3, 1])})`} opacity={Math.min(1, (frame - tPerfecta) / 3)}>
                <rect x={-260} y={-70} width={520} height={140} rx={20} fill="none" stroke="#ffd23f" strokeWidth={14} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={POPPINS} fontWeight={900} fontSize={96} fill="#ffd23f">
                  PERFECTA
                </text>
              </g>
            )}
            {frame >= tPerfecta &&
              Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const d = ease(frame, tPerfecta, tPerfecta + 14, 120, 380);
                return <circle key={i} cx={540 + Math.cos(a) * d} cy={1180 + Math.sin(a) * d * 0.6} r={14 * (1 - ease(frame, tPerfecta + 8, tPerfecta + 22))} fill="#ffd23f" />;
              })}
          </Stage>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ====================== ESCENA 4 · EL PRIMER EMAIL ====================== */

export const S4FirstEmail: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = sceneRange(4);
  const lf = frame - start;
  const tEmail = at(4, "email");
  const tQue = at(4, "qué");
  const tQwerty = at(4, "qwerty");
  const tAcordaba = at(4, "acuerda");
  const tNi = at(4, "Ni");

  const header = "TO: TOMLINSON@BBN-TENEXB".slice(0, Math.floor(interpolate(lf, [2, 26], [0, 24], clamp)));
  const body = "QWERTYUIOP".slice(0, Math.floor(interpolate(frame, [tQwerty - 2, tQwerty + 16], [0, 10], clamp)));
  const scratch = ease(frame, tNi - 4, tNi + 4);
  const typing = frame < tNi - 4;
  const tap = Math.sin(lf * 1.6) * 8;

  return (
    <AbsoluteFill>
      <Stage zoom={interpolate(frame, [start, tQwerty, tQwerty + 20], [1, 1, 1.08], clamp)} oy={700}>
        <Lab frame={frame} />
        {/* mesa */}
        <rect x={60} y={1080} width={960} height={40} rx={10} fill="#5a3218" />
        <rect x={100} y={1120} width={30} height={300} fill="#5a3218" />
        <rect x={950} y={1120} width={30} height={300} fill="#5a3218" />
        {/* monitor CRT */}
        <g transform="translate(470,760)">
          <rect x={-330} y={-330} width={660} height={560} rx={40} fill="#e8e1cf" stroke="#12121f" strokeWidth={10} />
          <rect x={-290} y={-290} width={580} height={420} rx={50} fill="#0d1f14" />
          {Array.from({ length: 28 }).map((_, i) => (
            <rect key={i} x={-280} y={-285 + i * 15} width={560} height={4} fill="#3ddc97" opacity={0.05} />
          ))}
          <text x={-250} y={-220} fontFamily={MONO} fontSize={48} fill="#3ddc97">
            {header}
          </text>
          <text x={-250} y={-150} fontFamily={MONO} fontSize={48} fill="#3ddc97" opacity={0.7}>
            {lf > 26 ? "FROM: TOMLINSON@BBN-TENEXA" : ""}
          </text>
          <text x={-250} y={-30} fontFamily={MONO} fontSize={110} fill="#b6ffd8">
            {body}
            {frame % 14 < 7 ? "█" : ""}
          </text>
          <rect x={-120} y={230} width={240} height={60} fill="#d3c9b0" stroke="#12121f" strokeWidth={8} />
          <rect x={-200} y={280} width={400} height={30} rx={10} fill="#d3c9b0" stroke="#12121f" strokeWidth={8} />
          <circle cx={260} cy={190} r={12} fill={frame % 20 < 10 ? "#3ddc97" : "#1e7f63"} />
        </g>
        {/* teclado */}
        <rect x={250} y={1030} width={440} height={60} rx={14} fill="#d3c9b0" stroke="#12121f" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={272 + i * 46} y={1044} width={36} height={30} rx={6} fill="#f4efe2" />
        ))}

        <Person
          x={860}
          y={1640}
          scale={1.05}
          {...RAY}
          flip
          armL={typing ? [40, 50 + tap] : [20, 10]}
          armR={typing ? [40, 50 - tap] : [interpolate(scratch, [0, 1], [10, 160]), interpolate(scratch, [0, 1], [10, 120])]}
          lookX={typing ? 1 : -0.3}
          lookY={typing ? 0.5 : -1}
          headTilt={scratch * 10}
          brows={scratch}
          smile={1 - scratch * 1.6}
          eyesWide={scratch * 0.4}
          blinkSeed={5}
        />
        {frame >= tAcordaba &&
          [0, 1].map((i) => (
            <text
              key={i}
              x={790 + i * 110}
              y={900 - i * 50 + Math.sin(frame / 5 + i) * 10}
              fontFamily={POPPINS}
              fontWeight={900}
              fontSize={110 * pop(frame, tAcordaba + i * 4)}
              textAnchor="middle"
              fill="#ff5d8f"
              stroke="#12121f"
              strokeWidth={8}
              paintOrder="stroke"
            >
              ?
            </text>
          ))}
      </Stage>
      {frame >= tEmail && (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 250,
            transform: `translate(-50%,-50%) rotate(-7deg) scale(${interpolate(pop(frame, tEmail, 12, 300), [0, 1], [2.6, 1])})`,
            opacity: Math.min(1, (frame - tEmail) / 3),
            border: "12px solid #c9402a",
            color: "#c9402a",
            background: "rgba(255,247,230,0.92)",
            fontFamily: POPPINS,
            fontWeight: 900,
            fontSize: 70,
            padding: "10px 40px",
            borderRadius: 20,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          PRIMER EMAIL
          <div style={{ fontSize: 40, marginTop: 6 }}>DE LA HISTORIA · 1971</div>
        </div>
      )}
      <Tag frame={frame} from={tQue} x={300} y={1230} size={44} bg="#12121f" color="#fff" rotate={-6}>
        ¿y qué decía…?
      </Tag>
    </AbsoluteFill>
  );
};
