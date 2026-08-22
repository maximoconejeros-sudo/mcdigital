export interface Project {
  number: string;
  client: string;
  industry: string;
  services: string;
  year: string;
  /** Drop a cover image in public/projects/project-0N/ and point this at
   * it (e.g. "/projects/project-01/cover.jpg") to replace the placeholder
   * panel with the real thing — no other code changes needed. */
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    number: "01",
    client: "Restaurante boutique",
    industry: "Gastronomía",
    services: "Landing page — WhatsApp AI",
    year: "2025",
  },
  {
    number: "02",
    client: "Clínica dental",
    industry: "Salud",
    services: "Sitio completo — Agente IA",
    year: "2025",
  },
  {
    number: "03",
    client: "Estudio legal",
    industry: "Servicios profesionales",
    services: "Sitio completo",
    year: "2025",
  },
];
