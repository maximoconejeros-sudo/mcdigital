"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleEcosystemCamera } from "@/lib/webgl/act3-layout";
import { scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

export default function EcosystemCameraRig() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    sampleEcosystemCamera(scrollState.act3Progress, desiredPos, desiredLook);
    camera.position.lerp(desiredPos, 1 - Math.pow(0.002, delta));
    camera.lookAt(desiredLook);
  });

  return null;
}
