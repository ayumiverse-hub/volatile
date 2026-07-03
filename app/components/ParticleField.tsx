"use client";

import { useMemo } from "react";
import * as THREE from "three";

const count = 15000;

export default function ParticleField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const h = Math.random() * 4;
      const r = Math.random() * (0.5 + h * 0.375); // how far away from the centre
      const theta = Math.random() * Math.PI * 2; // angle

      arr[i * 3] = r * Math.cos(theta); // x
      arr[i * 3 + 1] = h; // y
      arr[i * 3 + 2] = r * Math.sin(theta); // z
    }

    return arr;
  }, []);

  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positions, 3);
  }, [positions]);

  return (
    <points>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttribute} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="white" />
    </points>
  );
}
