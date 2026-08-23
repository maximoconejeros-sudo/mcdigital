// Mutable, ref-like shared state for scroll + pointer.
// Deliberately NOT React state — read every frame inside useFrame/rAF loops
// without triggering component re-renders.

export const scrollState = {
  /** 0..1 progress through the pinned Act I sequence */
  progress: 0,
  /** 0..1 progress through the Act IX final CTA (monogram reveal) */
  act9Progress: 0,
  /** 0..1 progress through the closing brand moment — MC recentering,
   * camera pulling back — after the CTA content has cleared */
  act9BrandT: 0,
  /** 0..1 — after the brand moment holds, the monogram lifts and settles
   * smaller (scale 1 -> 0.72) to make room for the closing copy that
   * appears below it, never over it */
  act9CollapseT: 0,
  /** 0..1 — final handoff fade to the footer; 1 means the whole Act IX
   * Canvas + DOM layer should be fully invisible (footer showing through) */
  act9FadeT: 0,
  /** whether the intro choreography has finished */
  introComplete: false,
  /** which color environment is currently on screen, for the nav to match:
   * white+gold on black, graphite+gold on warm white, white+champagne on
   * graphite. Each act's own onUpdate sets this while it's active. */
  navTheme: "dark" as "dark" | "light" | "graphite",
};

export const pointerState = {
  /** normalized device coords, -1..1, raw (unsmoothed) */
  x: 0,
  y: 0,
  /** whether the pointer is currently over the MC sculpture mesh — set by
   * MSculpture's own R3F pointer events, read by CustomCursor to swap in
   * the gold-outline hover state */
  overMC: false,
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
}
