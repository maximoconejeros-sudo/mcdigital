"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/lib/animation/lenis";
import { hasWebGL } from "@/lib/webgl/detect";
import Loader from "@/components/scenes/Loader";
import Experience from "@/components/canvas/Experience";
import ServicesExperience from "@/components/canvas/ServicesExperience";
import FinalExperience from "@/components/canvas/FinalExperience";
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import HeroTypography from "@/components/ui/HeroTypography";
import ScrollNarrative from "@/components/ui/ScrollNarrative";
import ServicesNarrative from "@/components/ui/ServicesNarrative";
import PhilosophyNarrative from "@/components/ui/PhilosophyNarrative";
import WorkNarrative from "@/components/ui/WorkNarrative";
import FinalNarrative from "@/components/ui/FinalNarrative";
import StaticFallback from "@/components/ui/StaticFallback";

export default function Home() {
  useLenis();

  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  // Only one act's heavy Canvas is ever mounted at a time — each act's own
  // ScrollTrigger (already tracking scroll progress) diffs isActive inside
  // onUpdate and reports the edge up, so there's no separate observer to
  // keep in sync.
  const [act1Active, setAct1Active] = useState(true);
  const [act2Active, setAct2Active] = useState(false);
  const [act9Active, setAct9Active] = useState(false);

  useEffect(() => {
    // WebGL support can only be probed client-side; gate the state flip
    // behind an effect so the server-rendered shell stays consistent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hasWebGL()) setSupportsWebGL(false);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!supportsWebGL) {
    return <StaticFallback />;
  }

  return (
    <main id="top">
      {!ready && <Loader onComplete={() => setReady(true)} />}

      <CanvasErrorBoundary fallback={<StaticFallback />}>
        <div style={{ position: "fixed", inset: 0, zIndex: 20 }}>
          {act1Active && <Experience reduced={reduced} />}
          {act2Active && <ServicesExperience reduced={reduced} />}
          {act9Active && <FinalExperience reduced={reduced} />}
        </div>
        <HeroTypography play={ready} />
        <ScrollNarrative ready={ready} onActiveChange={setAct1Active} />
        <ServicesNarrative ready={ready} onActiveChange={setAct2Active} />
        <PhilosophyNarrative ready={ready} />
        <WorkNarrative ready={ready} />
      </CanvasErrorBoundary>

      <FinalNarrative ready={ready} onActiveChange={setAct9Active} />

      <Navigation play={ready} />
      <CustomCursor />
    </main>
  );
}
