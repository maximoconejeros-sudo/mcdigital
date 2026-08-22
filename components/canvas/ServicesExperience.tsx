"use client";

import { Canvas } from "@react-three/fiber";
import SceneLighting from "@/components/canvas/SceneLighting";
import ServicesCameraRig from "@/components/canvas/ServicesCameraRig";
import BrowserAssembly from "@/components/canvas/services/BrowserAssembly";
import WebsitePlanes from "@/components/canvas/services/WebsitePlanes";
import NetworkNodes from "@/components/canvas/services/NetworkNodes";

export default function ServicesExperience({
  reduced = false,
}: {
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.4], fov: 32, near: 0.05, far: 40 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fogExp2 attach="fog" args={["#050505", 0.028]} />
      <SceneLighting />
      <ServicesCameraRig />
      <BrowserAssembly />
      <WebsitePlanes />
      <NetworkNodes />
    </Canvas>
  );
}
