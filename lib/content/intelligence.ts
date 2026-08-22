export interface ChatMessage {
  who: "Cliente" | "MC AI";
  lines: string[];
}

export const AI_HEADLINE = ["Agente de", "WhatsApp"];
export const AI_EMPHASIS = "personalizado para tu negocio.";
export const AI_BODY =
  "Responde consultas, califica clientes, entrega información y mantiene conversaciones activas incluso cuando tú no estás.";
export const AI_STATUS = "Activo 24/7";

export const CAPABILITIES = ["Responde", "Califica", "Agenda", "Deriva"];

export const CHAT_MESSAGES: ChatMessage[] = [
  { who: "Cliente", lines: ["Hola 👋", "¿Tienen disponibilidad mañana?"] },
  { who: "MC AI", lines: ["¡Hola! Sí.", "¿Para qué horario estás buscando?"] },
  { who: "Cliente", lines: ["Después de las 17:00."] },
  {
    who: "MC AI",
    lines: [
      "Perfecto.",
      "Tenemos disponibilidad a las 17:30 y 18:15.",
      "¿Quieres que te reserve uno?",
    ],
  },
  { who: "Cliente", lines: ["17:30 👍"] },
  { who: "MC AI", lines: ["Listo.", "Tu solicitud quedó registrada."] },
];

export const SYSTEM_PANEL_LABEL = "Lead detectado";
export const SYSTEM_PANEL_ROWS: [string, string][] = [
  ["Intención", "Reserva"],
  ["Horario", "17:30"],
  ["Estado", "Calificado"],
];

export const CLOSING_HEADLINE = ["Tu negocio", "sigue hablando."];
export const CLOSING_EMPHASIS = "incluso cuando no estás";
