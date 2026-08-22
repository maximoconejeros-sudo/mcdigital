export interface ProcessStage {
  number: string;
  key: string;
  name: string;
  copy: string;
}

export const PROCESS_INTRO_LABEL = "Nuestro proceso / 05";
export const PROCESS_HEADLINE = ["De una idea", "a un sistema."];
export const PROCESS_EMPHASIS = "paso a paso.";

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: "01",
    key: "DISCOVER",
    name: "Descubrir",
    copy: "Entendemos tu negocio, tu cliente y la oportunidad.",
  },
  {
    number: "02",
    key: "DEFINE",
    name: "Definir",
    copy: "Convertimos información en una dirección clara.",
  },
  {
    number: "03",
    key: "DESIGN",
    name: "Diseñar",
    copy: "Tipografía, imagen, color y llamada a la acción toman forma.",
  },
  {
    number: "04",
    key: "BUILD",
    name: "Construir",
    copy: "Las piezas se convierten en una interfaz digital real.",
  },
  {
    number: "05",
    key: "CONNECT",
    name: "Conectar",
    copy: "La conversación con IA se integra directamente en la experiencia.",
  },
  {
    number: "06",
    key: "LAUNCH",
    name: "Lanzar",
    copy: "Todo se activa: navegación, contenido, IA y conversión.",
  },
  {
    number: "07",
    key: "EVOLVE",
    name: "Evolucionar",
    copy: "El sistema sigue creciendo con datos reales, no se queda quieto.",
  },
];

// each stage's fragments — what appears/organizes/assembles behind its name
export const DISCOVER_FRAGMENTS = ["Negocio", "Cliente", "Objetivo"];

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
