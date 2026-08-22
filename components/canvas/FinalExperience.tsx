"use client";

import { Canvas } from "@react-three/fiber";
import SceneLighting from "@/components/canvas/SceneLighting";
import FinalSculpture from "@/components/canvas/FinalSculpture";
import FinalCameraRig from "@/components/canvas/FinalCameraRig";
import CinematicPost from "@/components/canvas/CinematicPost";

export default function FinalExperience({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.4], fov: 30, near: 0.05, far: 30 }}
      // opaque warm clear, not transparent-over-black-body: this is the
      // closing act's actual background paint, matching the DOM layer's
      // warm-white/champagne gradient (V7: never return to black here)
      onCreated={({ gl }) => gl.setClearColor(0xeee5d3, 1)}
    >
      {/* warm, not black — the closing act settles on champagne/warm-white,
          never the deep-black fog earlier acts use */}
      <fogExp2 attach="fog" args={["#e9e2d1", 0.045]} />
      <SceneLighting />
      <FinalSculpture />
      <FinalCameraRig reduced={reduced} />
      {!reduced && <CinematicPost />}
    </Canvas>
  );
}
