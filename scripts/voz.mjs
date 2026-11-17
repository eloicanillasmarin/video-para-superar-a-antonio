// Genera la voz con ElevenLabs y los tiempos de cada palabra.
//   node scripts/voz.mjs            -> llama a ElevenLabs (public/voz.mp3 + src/arroba/timings.json)
//   node scripts/voz.mjs --estimar  -> sin audio, tiempos estimados (para maquetar)
// La API key se lee de ELEVENLABS_API_KEY (en la nube la inyecta el proxy).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const guion = JSON.parse(fs.readFileSync(path.join(root, "src/arroba/guion.json"), "utf8"));
const text = guion.segments.join(" ");
const outTimings = path.join(root, "src/arroba/timings.json");

// token -> segmento, con su rango de caracteres en el texto completo
const tokens = [];
{
  let offset = 0;
  guion.segments.forEach((seg, s) => {
    for (const m of seg.matchAll(/\S+/g)) {
      tokens.push({ text: m[0], seg: s, from: offset + m.index, to: offset + m.index + m[0].length - 1 });
    }
    offset += seg.length + 1;
  });
}

const estimar = process.argv.includes("--estimar");
let words;
let audio = null;

if (estimar) {
  let t = 0.15;
  words = tokens.map((tk) => {
    const len = tk.text.replace(/[^\p{L}\p{N}]/gu, "").length;
    const start = t;
    const end = start + 0.052 * len + 0.07;
    t = end;
    if (/[.?!…:]$|[.?!…:]»$/.test(tk.text)) t += 0.32;
    else if (/[,;]$|,»$/.test(tk.text)) t += 0.14;
    return { text: tk.text, seg: tk.seg, start: +start.toFixed(3), end: +end.toFixed(3) };
  });
} else {
  const key = process.env.ELEVENLABS_API_KEY || "proxy-injected";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${guion.voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.38, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.0 },
      }),
    },
  );
  if (!res.ok) {
    console.error("ElevenLabs error", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/voz.mp3"), Buffer.from(data.audio_base64, "base64"));
  audio = "voz.mp3";
  fs.mkdirSync(path.join(root, "out"), { recursive: true });
  fs.writeFileSync(path.join(root, "out/alignment.json"), JSON.stringify(data.alignment));
  const al = data.alignment ?? data.normalized_alignment;
  if (al.characters.join("") !== text) console.warn("Aviso: el alineado no coincide 1:1 con el texto; se usa la posición.");
  words = tokens.map((tk) => ({
    text: tk.text,
    seg: tk.seg,
    start: al.character_start_times_seconds[Math.min(tk.from, al.characters.length - 1)],
    end: al.character_end_times_seconds[Math.min(tk.to, al.characters.length - 1)],
  }));
}

const duration = +(words[words.length - 1].end + 0.6).toFixed(3);
fs.writeFileSync(outTimings, JSON.stringify({ audio, duration, words }, null, 1));
console.log(`OK: ${words.length} palabras, ${duration}s, audio=${audio}`);
