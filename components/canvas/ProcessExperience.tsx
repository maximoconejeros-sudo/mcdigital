"use client";

import { Canvas } from "@react-three/fiber";
import SceneLighting from "@/components/canvas/SceneLighting";
import ProcessCameraRig from "@/components/canvas/ProcessCameraRig";
import ProcessStations from "@/components/canvas/ProcessStations";
import CinematicPost from "@/components/canvas/CinematicPost";

export default function ProcessExperience({
  reduced = false,
}: {
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 5.4], fov: 36, near: 0.05, far: 40 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fogExp2 attach="fog" args={["#050505", 0.024]} />
      <SceneLighting />
      <ProcessCameraRig />
      <ProcessStations />
      {!reduced && <CinematicPost />}
    </Canvas>
  );
}
