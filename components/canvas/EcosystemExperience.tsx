"use client";

import { Canvas } from "@react-three/fiber";
import SceneLighting from "@/components/canvas/SceneLighting";
import EcosystemCameraRig from "@/components/canvas/EcosystemCameraRig";
import EcosystemCore from "@/components/canvas/EcosystemCore";
import EcosystemNodes from "@/components/canvas/EcosystemNodes";
import CinematicPost from "@/components/canvas/CinematicPost";

export default function EcosystemExperience({
  reduced = false,
}: {
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [4.4, 2.6, -4.4], fov: 34, near: 0.05, far: 40 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fogExp2 attach="fog" args={["#050505", 0.02]} />
      <SceneLighting />
      <EcosystemCameraRig />
      <EcosystemCore />
      <EcosystemNodes />
      {!reduced && <CinematicPost />}
    </Canvas>
  );
}
