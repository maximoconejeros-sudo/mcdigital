export interface ConversationLine {
  who: "Cliente" | "MC AI";
  text: string;
}

export interface Conversation {
  lines: ConversationLine[];
  style: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    scale: number;
    blur: number;
  };
  whatsapp?: boolean;
}

export const CONVERSATIONS: Conversation[] = [
  {
    style: { top: "16%", left: "8%", scale: 1, blur: 0 },
    lines: [
      { who: "Cliente", text: "¿Tienen disponibilidad?" },
      { who: "MC AI", text: "Sí. ¿Para qué fecha?" },
    ],
  },
  {
    style: { top: "44%", right: "9%", scale: 0.82, blur: 0.6 },
    lines: [
      { who: "Cliente", text: "Quiero cotizar." },
      { who: "MC AI", text: "Claro. Cuéntame qué necesitas." },
    ],
  },
  {
    style: { bottom: "16%", left: "12%", scale: 0.9, blur: 0 },
    whatsapp: true,
    lines: [
      { who: "Cliente", text: "¿Cuál es el horario?" },
      { who: "MC AI", text: "Te ayudo." },
    ],
  },
];

export const WHATSAPP_STEPS = ["Mensaje", "Calificación", "Respuesta", "Acción"];

export const INTELLIGENCE_HEADLINE = ["Tu negocio", "sigue hablando."];
export const INTELLIGENCE_EMPHASIS = "incluso cuando no estás";

export const INTELLIGENCE_SUB =
  "Agentes de IA y automatizaciones diseñados para responder, orientar y mantener conversaciones activas.";

export const WHATSAPP_SUB =
  "Tu negocio sigue conversando incluso cuando tú no estás.";
