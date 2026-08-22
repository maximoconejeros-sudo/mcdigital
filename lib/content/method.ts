export interface MethodStep {
  key: string;
  label: string;
}

export const METHOD_INTRO_LABEL = "Método";
export const METHOD_HEADLINE = [
  "De una idea",
  "a un sistema digital",
  "listo para crecer.",
];

export const METHOD_STEPS: MethodStep[] = [
  { key: "DISCOVER", label: "Descubrir" },
  { key: "DEFINE", label: "Definir" },
  { key: "DESIGN", label: "Diseñar" },
  { key: "BUILD", label: "Construir" },
  { key: "CONNECT", label: "Conectar" },
  { key: "LAUNCH", label: "Lanzar" },
  { key: "EVOLVE", label: "Evolucionar" },
];

export const DISCOVER_WORDS = [
  "negocio",
  "clientes",
  "objetivo",
  "marca",
  "mercado",
  "voz",
  "historia",
  "producto",
];

export const HUMAN_MOMENT_LABEL = "TECHNOLOGY SHOULD FEEL HUMAN";
export const HUMAN_MOMENT_HEADLINE = [
  "Detrás de cada pantalla",
  "hay personas.",
];
export const HUMAN_MOMENT_COPY =
  "Por eso cada proyecto empieza entendiendo a las personas detrás del negocio.";
/** the real photograph this placeholder stands in for — see the asset
 * report delivered separately, not shown on the page */
export const HUMAN_MOMENT_IMAGE_SLOT = "method-human-moment-01.webp";
