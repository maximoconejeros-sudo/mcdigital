"use client";

import { Canvas } from "@react-three/fiber";
import MSculpture from "@/components/canvas/MSculpture";
import SceneLighting from "@/components/canvas/SceneLighting";
import PointerKeyLight from "@/components/canvas/PointerKeyLight";
import Particles from "@/components/canvas/Particles";
import CameraRig from "@/components/canvas/CameraRig";
import FogController from "@/components/canvas/FogController";
import CinematicPost from "@/components/canvas/CinematicPost";

export default function Experience({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{
        // context-level MSAA (antialias:true) reading into a custom
        // post-processing pipeline (CinematicPost's EffectComposer, only
        // mounted when !reduced below) is a known source of compositor
        // instability in Safari — the two AA passes fight over the same
        // multisampled backbuffer. Only disable it when the composer is
        // actually in the pipeline; reduced/mobile skips CinematicPost
        // entirely, so there's no conflict there and no reason to give up
        // antialiasing on it.
        antialias: reduced,
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
      <PointerKeyLight />
      <MSculpture />
      <Particles count={reduced ? 500 : 1800} />
      <CameraRig reduced={reduced} />
      {!reduced && <CinematicPost />}
    </Canvas>
  );
}
