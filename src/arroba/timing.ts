import data from "./timings.json";

export type Word = { text: string; seg: number; start: number; end: number };

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const WORDS: Word[] = data.words;
export const AUDIO: string | null = data.audio;
export const DURATION_S: number = data.duration;
export const TOTAL_FRAMES = Math.ceil((DURATION_S + 0.4) * FPS);

export const f = (seconds: number) => Math.round(seconds * FPS);

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9@]/g, "");

const SEG_COUNT = Math.max(...WORDS.map((w) => w.seg)) + 1;

/** Frame en el que arranca cada escena (= segmento del guion). */
export const SCENE_STARTS: number[] = Array.from({ length: SEG_COUNT }, (_, s) => {
  if (s === 0) return 0;
  const first = WORDS.find((w) => w.seg === s)!;
  return f(first.start - 0.12);
});

export const sceneRange = (s: number): [number, number] => [
  SCENE_STARTS[s],
  s + 1 < SEG_COUNT ? SCENE_STARTS[s + 1] : TOTAL_FRAMES,
];

/** Frame en el que se dice una palabra de un segmento (busca por coincidencia). */
export const at = (seg: number, word: string, nth = 0): number => {
  const target = norm(word);
  const inSeg = WORDS.filter((w) => w.seg === seg);
  const exact = inSeg.filter((w) => norm(w.text) === target);
  const list = exact.length ? exact : inSeg.filter((w) => norm(w.text).includes(target));
  const w = list[Math.min(nth, list.length - 1)];
  if (!w) throw new Error(`Palabra "${word}" no encontrada en el segmento ${seg}`);
  return f(w.start);
};

/** Apertura de boca 0..1 según si se está hablando en el frame dado. */
export const mouthAt = (frame: number): number => {
  const t = frame / FPS;
  const w = WORDS.find((x) => t >= x.start && t < x.end);
  if (!w) return 0;
  const p = t - w.start;
  return 0.25 + 0.75 * Math.abs(Math.sin(p * Math.PI * 6.5));
};
