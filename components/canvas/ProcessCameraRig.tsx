"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleProcessCamera } from "@/lib/webgl/act5-layout";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

export default function ProcessCameraRig() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    sampleProcessCamera(scrollState.act5Progress, desiredPos, desiredLook);
    desiredLook.x += pointerState.x * 0.3;
    desiredLook.y += pointerState.y * -0.15;

    camera.position.lerp(desiredPos, 1 - Math.pow(0.002, delta));
    camera.lookAt(desiredLook);
  });

  return null;
}
