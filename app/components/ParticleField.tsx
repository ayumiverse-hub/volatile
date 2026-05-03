import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  warmth: number;
  density: number;
  speed: number;
  spread: "vertical" | "horizontal" | "diffuse";
  shape: {
    base_radius: number;
    top_radius: number;
    height: number;
    vertical_bias: number;
  };
  color_stops: number[][];
  motion: {
    base_stillness: number;
    top_drift: number;
    flow_intensity: number;
  };
}

const COUNT = 15000;

export default function ParticleField({
  warmth,
  density,
  speed,
  shape,
  color_stops,
  motion,
}: ParticleFieldProps) {
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const originsRef = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const yFracsRef = useRef<Float32Array>(new Float32Array(COUNT));

  function colorAt(yFrac: number) {
    let i = 0;
    while (i < color_stops.length - 1 && yFrac > color_stops[i + 1][0]) i++;
    if (i >= color_stops.length - 1)
      return color_stops[color_stops.length - 1].slice(1);
    const a = color_stops[i];
    const b = color_stops[i + 1];
    const k = (yFrac - a[0]) / (b[0] - a[0]);
    return [
      a[1] * (1 - k) + b[1] * k,
      a[2] * (1 - k) + b[2] * k,
      a[3] * (1 - k) + b[3] * k,
    ];
  }

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const origins = originsRef.current;
    const yFracs = yFracsRef.current;

    for (let i = 0; i < COUNT; i++) {
      const yFrac = Math.pow(Math.random(), shape.vertical_bias);
      const y = yFrac * shape.height;
      const maxR =
        shape.base_radius + (shape.top_radius - shape.base_radius) * yFrac;
      const r = Math.pow(Math.random(), 1.5) * maxR;

      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      origins[i * 3] = x;
      origins[i * 3 + 1] = y;
      origins[i * 3 + 2] = z;
      yFracs[i] = yFrac;

      const col = colorAt(yFrac);
      const intensity = 1 - yFrac * 0.18;
      const radialFade = 1 - Math.pow(r / Math.max(maxR, 0.01), 1.4) * 0.4;
      const noise = 0.85 + Math.random() * 0.2;

      colors[i * 3] = col[0] * intensity * radialFade * noise;
      colors[i * 3 + 1] = col[1] * intensity * radialFade * noise;
      colors[i * 3 + 2] = col[2] * intensity * radialFade * noise;
    }

    return { positions, colors };
  }, [shape, color_stops]);
}
