"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import MSculpture from "@/components/canvas/MSculpture";
import SceneLighting from "@/components/canvas/SceneLighting";
import Particles from "@/components/canvas/Particles";
import CameraRig from "@/components/canvas/CameraRig";
import FogController from "@/components/canvas/FogController";

export default function Experience({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 6.4], fov: 32, near: 0.05, far: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <fogExp2 attach="fog" args={["#050505", 0.045]} />
      <FogController />
      <SceneLighting />
      <MSculpture />
      <Particles count={reduced ? 500 : 1800} />
      <CameraRig reduced={reduced} />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.28} darkness={0.62} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
