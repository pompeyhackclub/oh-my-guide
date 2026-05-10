// Per-category visual identity.
// Every gradient is hand-picked from the brand palette only — no purples, pinks
// or magentas. Each category has an `icon` (Font Awesome class), an `accent`
// (used for the small icon chip on cards) and a 3-stop `grad` (used for hero
// panels).
//
//   #225075 navy   #0F6C67 teal   #75BF8A sage
//   #FCAB46 amber  #A34B14 rust
const CATEGORY_META = {
  History:       { icon: "fa-solid fa-landmark",            accent: "#225075", grad: ["#225075", "#A34B14", "#FCAB46"] },
  Landmarks:     { icon: "fa-solid fa-tower-observation",   accent: "#0F6C67", grad: ["#0F6C67", "#225075", "#A34B14"] },
  Outdoors:      { icon: "fa-solid fa-tree",                accent: "#0F6C67", grad: ["#75BF8A", "#0F6C67", "#225075"] },
  Walks:         { icon: "fa-solid fa-person-walking",      accent: "#0F6C67", grad: ["#0F6C67", "#75BF8A", "#FCAB46"] },
  Views:         { icon: "fa-solid fa-mountain-sun",        accent: "#A34B14", grad: ["#FCAB46", "#A34B14", "#225075"] },
  Family:        { icon: "fa-solid fa-children",            accent: "#A34B14", grad: ["#FCAB46", "#A34B14", "#0F6C67"] },
  Food:          { icon: "fa-solid fa-utensils",            accent: "#A34B14", grad: ["#A34B14", "#FCAB46", "#75BF8A"] },
  Shopping:      { icon: "fa-solid fa-bag-shopping",        accent: "#A34B14", grad: ["#A34B14", "#FCAB46", "#225075"] },
  Entertainment: { icon: "fa-solid fa-masks-theater",       accent: "#A34B14", grad: ["#A34B14", "#FCAB46", "#0F6C67"] },
  Culture:       { icon: "fa-solid fa-palette",             accent: "#225075", grad: ["#225075", "#0F6C67", "#A34B14"] },
  Quirky:        { icon: "fa-solid fa-wand-magic-sparkles", accent: "#A34B14", grad: ["#FCAB46", "#75BF8A", "#0F6C67"] },
  Transport:     { icon: "fa-solid fa-ship",                accent: "#0F6C67", grad: ["#0F6C67", "#225075", "#75BF8A"] },
};

const FALLBACK = {
  icon: "fa-solid fa-location-dot",
  accent: "#0F6C67",
  grad: ["#0F6C67", "#225075", "#A34B14"],
};

export function categoryMeta(category) {
  return CATEGORY_META[category] ?? FALLBACK;
}

export function categoryGradient(category) {
  const [a, b, c] = categoryMeta(category).grad;
  return `linear-gradient(135deg, ${a} 0%, ${b} 60%, ${c} 100%)`;
}
