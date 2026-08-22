"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/** The bloom + vignette combo shared by every act's Canvas — subtle gold
 * glints bloom, deep corners stay dark. Skipped on reduced/mobile. */
export default function CinematicPost() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.28} darkness={0.62} />
    </EffectComposer>
  );
}
