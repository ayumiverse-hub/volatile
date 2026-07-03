"use client";

import { Canvas } from "@react-three/fiber";
import ParticleField from "./components/ParticleField";

export default function Home() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </main>
  );
}
