"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/lib/animation/lenis";
import { hasWebGL } from "@/lib/webgl/detect";
import Loader from "@/components/scenes/Loader";
import Experience from "@/components/canvas/Experience";
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import HeroTypography from "@/components/ui/HeroTypography";
import ScrollNarrative from "@/components/ui/ScrollNarrative";
import StaticFallback from "@/components/ui/StaticFallback";

export default function Home() {
  useLenis();

  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

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
          <Experience reduced={reduced} />
        </div>
        <HeroTypography play={ready} />
        <ScrollNarrative ready={ready} />
      </CanvasErrorBoundary>

      <Navigation play={ready} />
      <CustomCursor />
    </main>
  );
}
