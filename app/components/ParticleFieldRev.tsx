import { useMemo } from "react";

const count = 15000;

export default function ParticleField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = Math.random() * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="white" />
    </points>
  );
}
