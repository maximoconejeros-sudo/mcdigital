// Mutable, ref-like shared state for scroll + pointer.
// Deliberately NOT React state — read every frame inside useFrame/rAF loops
// without triggering component re-renders.

export const scrollState = {
  /** 0..1 progress through the pinned Act I sequence */
  progress: 0,
  /** 0..1 progress through the Act II services sequence */
  act2Progress: 0,
  /** 0..1 progress through the Act III ecosystem sequence */
  act3Progress: 0,
  /** 0..1 progress through the Act V process journey */
  act5Progress: 0,
  /** whether the intro choreography has finished */
  introComplete: false,
};

export const pointerState = {
  /** normalized device coords, -1..1, raw (unsmoothed) */
  x: 0,
  y: 0,
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
