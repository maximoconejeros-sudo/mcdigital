import * as THREE from "three";

export const STATIONS = [
  {
    number: "01",
    title: "Diagnóstico",
    copy: "Entendemos tu negocio, tus clientes y en qué parte del proceso estás perdiendo tiempo o ventas.",
  },
  {
    number: "02",
    title: "Diseño",
    copy: "Creamos la propuesta visual y de contenido — pensada para tu marca, no para una plantilla.",
  },
  {
    number: "03",
    title: "Conexión",
    copy: "Conectamos tu web y tu agente de WhatsApp para que trabajen juntos, sin que estés detrás de cada paso.",
  },
  {
    number: "04",
    title: "Lanzamiento",
    copy: "Publicamos, medimos resultados y ajustamos lo necesario para que siga mejorando con el tiempo.",
  },
];

export const STATION_X = STATIONS.map((_, i) => i * 7.5);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Triangular envelope centered on station `i` of N as Act V progress
 * sweeps 0..1. */
export function stationEnvelope(progress: number, i: number, width = 0.34) {
  const center = i / (STATIONS.length - 1);
  const d = Math.abs(progress - center);
  return smooth(THREE.MathUtils.clamp(1 - d / width, 0, 1));
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

/** The camera travels horizontally along the stations as the user scrolls
 * vertically — the "spatial journey" replacing a literal timeline. */
export function sampleProcessCamera(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
) {
  const p = smooth(THREE.MathUtils.clamp(progress, 0, 1));
  const span = STATION_X[STATION_X.length - 1] - STATION_X[0];
  const x = STATION_X[0] + span * p;

  _pos.set(x, 0.3, 5.4);
  _look.set(x, 0, 0);
  outPos.copy(_pos);
  outLook.copy(_look);
}
