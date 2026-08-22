"use client";

import { Canvas } from "@react-three/fiber";
import SceneLighting from "@/components/canvas/SceneLighting";
import FinalSculpture from "@/components/canvas/FinalSculpture";
import FinalParticles from "@/components/canvas/FinalParticles";
import FinalCameraRig from "@/components/canvas/FinalCameraRig";
import CinematicPost from "@/components/canvas/CinematicPost";

export default function FinalExperience({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.4], fov: 30, near: 0.05, far: 30 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fogExp2 attach="fog" args={["#000000", 0.05]} />
      <SceneLighting />
      <FinalSculpture />
      <FinalParticles count={reduced ? 300 : 850} />
      <FinalCameraRig reduced={reduced} />
      {!reduced && <CinematicPost />}
    </Canvas>
  );
}
