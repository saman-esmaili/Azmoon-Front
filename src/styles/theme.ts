// ─── Design Tokens — Warm Coral × Teal × Sunshine ────────────────────────────
// Shared across all pages in the project.
// Import: import { C } from "@/theme";

export const C = {
  // backgrounds
  bg:        "#FFFBF7",   // warm cream
  bgSection: "#FFF5EE",   // peach tint
  bgWhite:   "#FFFFFF",

  // primary — deep teal/peacock
  primary:   "#0D9488",
  primaryDk: "#0F766E",
  primaryLt: "#CCFBF1",

  // accent — vivid coral/orange
  accent:    "#F97316",
  accentDk:  "#EA6A0A",
  accentLt:  "#FFF0E4",

  // highlight — sunny yellow
  sun:       "#FCD34D",
  sunDk:     "#F59E0B",

  // supporting palette
  violet:    "#7C3AED",
  violetLt:  "#EDE9FE",
  rose:      "#F43F5E",
  roseLt:    "#FFE4E6",
  sky:       "#0EA5E9",
  skyLt:     "#E0F2FE",
  lime:      "#84CC16",
  limeLt:    "#F0FFF4",

  // text hierarchy
  text:      "#1C1917",
  textSub:   "#57534E",
  textLight: "#A8A29E",

  // borders / shadows
  border:    "rgba(13,148,136,0.13)",
  shadow:    "rgba(13,148,136,0.14)",
} as const;

export type ColorToken = typeof C;
