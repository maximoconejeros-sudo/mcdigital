"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import { roomEnvelope } from "@/lib/webgl/act2-layout";
import styles from "./ServicesNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ServiceRef {
  root: HTMLDivElement | null;
}

interface ServiceDef {
  index: string;
  lines: string[];
  copy: string;
  className: string;
  isWhatsapp?: boolean;
}

const SERVICES: ServiceDef[] = [
  {
    index: "01 / 03",
    lines: ["Landing", "pages"],
    copy: "Páginas rápidas, directas y diseñadas para convertir visitas en clientes.",
    className: styles.serviceOne,
  },
  {
    index: "02 / 03",
    lines: ["Complete", "websites"],
    copy: "Sitios completos con una identidad visual propia, diseñados desde cero para tu negocio.",
    className: styles.serviceTwo,
  },
  {
    index: "03 / 03",
    lines: ["AI that", "works."],
    copy: "Responden, agendan y ayudan a cerrar ventas 24/7, con el tono de tu marca.",
    className: styles.serviceThree,
    isWhatsapp: true,
  },
];

export default function ServicesNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const refs = useRef<ServiceRef[]>([]);
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          onActiveChange?.(self.isActive);
        }
        scrollState.act2Progress = self.progress;
        refs.current.forEach((r, i) => {
          if (!r.root) return;
          const env = roomEnvelope(self.progress, i);
          r.root.style.opacity = String(env);
          r.root.style.transform = `translateY(${(1 - env) * 22}px)`;
          r.root.style.filter = `blur(${(1 - env) * 6}px)`;
          r.root.style.pointerEvents = env > 0.5 ? "auto" : "none";
        });
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div className={styles.layer}>
        {SERVICES.map((s, i) => (
          <div
            key={s.index}
            ref={(el) => {
              refs.current[i] = { root: el };
            }}
            className={`${styles.service} ${s.className}`}
            style={{ opacity: 0 }}
          >
            <span className={styles.index}>{s.index}</span>
            <h2 className={styles.headline}>
              {s.lines.map((line) => (
                <span key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </h2>
            <p className={styles.copy}>{s.copy}</p>

            {s.isWhatsapp && (
              <>
                <p className={styles.whatsappSub}>
                  AGENTES DE WHATSAPP CON IA
                </p>
                <div className={styles.bubbles}>
                  <div className={`${styles.bubble} ${styles.bubbleClient}`}>
                    Cliente: &ldquo;Hola, ¿tienen disponibilidad?&rdquo;
                  </div>
                  <div className={`${styles.bubble} ${styles.bubbleAI}`}>
                    AI: &ldquo;Sí. ¿Para qué día necesitas?&rdquo;
                  </div>
                  <div className={`${styles.bubble} ${styles.bubbleClient2}`}>
                    Cliente: &ldquo;Este viernes en la tarde.&rdquo;
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
