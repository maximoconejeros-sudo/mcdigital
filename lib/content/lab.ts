export interface LabWorld {
  name: string;
  label: string;
  tagline: string;
  bg: string;
  fg: string;
  accent: string;
  gradient: string;
  /** the real asset this placeholder stands in for — see the asset report
   * delivered separately, not shown on the page */
  imageSlot: string;
}

export const LAB_INTRO_LABEL = "Digital Lab";
export const LAB_HEADLINE = ["One studio.", "Many possibilities."];
export const LAB_SUB =
  "No repetimos fórmulas. Cada experiencia nace alrededor del negocio que la necesita.";

export const LAB_WORLDS: LabWorld[] = [
  {
    name: "Luxury",
    label: "Hospitality / Real estate / Premium brands",
    tagline: "Elegancia editorial, sin prisa.",
    bg: "#0d0c0a",
    fg: "#f2eee5",
    accent: "#e0c477",
    gradient: "linear-gradient(155deg, #e0c477 0%, #6b5a34 60%, #0d0c0a 130%)",
    imageSlot: "lab-luxury-01.webp",
  },
  {
    name: "Energy",
    label: "Commerce / Performance / Culture",
    tagline: "Contraste alto, movimiento rápido.",
    bg: "#090909",
    fg: "#faf8f3",
    accent: "#c59a45",
    gradient: "linear-gradient(155deg, #faf8f3 0%, #c59a45 55%, #090909 130%)",
    imageSlot: "lab-energy-01.webp",
  },
  {
    name: "Precision",
    label: "Health / Services / Technology",
    tagline: "Mínimo, claro, exacto.",
    bg: "#f2eee5",
    fg: "#242422",
    accent: "#5b5a55",
    gradient: "linear-gradient(155deg, #ffffff 0%, #ddd8cd 55%, #b8b5ac 130%)",
    imageSlot: "lab-precision-01.webp",
  },
];
