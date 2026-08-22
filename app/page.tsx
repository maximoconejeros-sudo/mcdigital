"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/lib/animation/lenis";
import { hasWebGL } from "@/lib/webgl/detect";
import Loader from "@/components/scenes/Loader";
import Experience from "@/components/canvas/Experience";
import ServicesExperience from "@/components/canvas/ServicesExperience";
import EcosystemExperience from "@/components/canvas/EcosystemExperience";
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import HeroTypography from "@/components/ui/HeroTypography";
import ScrollNarrative from "@/components/ui/ScrollNarrative";
import ServicesNarrative from "@/components/ui/ServicesNarrative";
import EcosystemNarrative from "@/components/ui/EcosystemNarrative";
import NumbersNarrative from "@/components/ui/NumbersNarrative";
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
  const [act3Active, setAct3Active] = useState(false);

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
          {act3Active && <EcosystemExperience reduced={reduced} />}
        </div>
        <HeroTypography play={ready} />
        <ScrollNarrative ready={ready} onActiveChange={setAct1Active} />
        <ServicesNarrative ready={ready} onActiveChange={setAct2Active} />
        <EcosystemNarrative ready={ready} onActiveChange={setAct3Active} />
        <NumbersNarrative ready={ready} />
      </CanvasErrorBoundary>

      <Navigation play={ready} />
      <CustomCursor />
    </main>
  );
}
