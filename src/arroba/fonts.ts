import { loadFont as poppins } from "@remotion/google-fonts/Poppins";
import { loadFont as vt323 } from "@remotion/google-fonts/VT323";
import { loadFont as medieval } from "@remotion/google-fonts/MedievalSharp";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";

export const POPPINS = poppins("normal", { weights: ["600", "800", "900"], subsets: ["latin"] }).fontFamily;
export const MONO = vt323("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const MEDIEVAL = medieval("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const HAND = caveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
