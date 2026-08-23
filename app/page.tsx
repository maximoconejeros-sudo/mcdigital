"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/lib/animation/lenis";
import { scrollState } from "@/lib/animation/scroll-store";
import { hasWebGL } from "@/lib/webgl/detect";
import Loader from "@/components/scenes/Loader";
import Experience from "@/components/canvas/Experience";
import FinalExperience from "@/components/canvas/FinalExperience";
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import HeroTypography from "@/components/ui/HeroTypography";
import ScrollNarrative from "@/components/ui/ScrollNarrative";
import ExpertiseNarrative from "@/components/ui/ExpertiseNarrative";
import IntelligenceNarrative from "@/components/ui/IntelligenceNarrative";
import DigitalLabNarrative from "@/components/ui/DigitalLabNarrative";
import WhyItMattersNarrative from "@/components/ui/WhyItMattersNarrative";
import MethodNarrative from "@/components/ui/MethodNarrative";
import FinalNarrative from "@/components/ui/FinalNarrative";
import SiteFooter from "@/components/ui/SiteFooter";
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
  const [act9Active, setAct9Active] = useState(false);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  // the Act IX Canvas lives here, outside FinalNarrative's own DOM layer —
  // it polls act9FadeT itself so the 3D monogram actually fades out for
  // the footer handoff, not just the surrounding text (same rAF-polling
  // pattern as Navigation.tsx, to avoid a re-render every scroll frame)
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      if (canvasWrapRef.current && scrollState.act9FadeT !== last) {
        last = scrollState.act9FadeT;
        canvasWrapRef.current.style.opacity = String(1 - last);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

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
        <HeroBackdrop />
        <div ref={canvasWrapRef} style={{ position: "fixed", inset: 0, zIndex: 20 }}>
          {act1Active && <Experience reduced={reduced} play={ready} />}
          {act9Active && <FinalExperience reduced={reduced} />}
        </div>
        <HeroTypography play={ready} />
        <ScrollNarrative ready={ready} onActiveChange={setAct1Active} />
        <ExpertiseNarrative ready={ready} />
        <IntelligenceNarrative ready={ready} />
        <DigitalLabNarrative ready={ready} />
        <WhyItMattersNarrative ready={ready} />
        <MethodNarrative ready={ready} />
      </CanvasErrorBoundary>

      <FinalNarrative ready={ready} onActiveChange={setAct9Active} />
      <SiteFooter />

      <Navigation play={ready} />
      <CustomCursor />
    </main>
  );
}
