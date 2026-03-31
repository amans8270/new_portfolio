import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';

export default function FloatingBadge() {
  return (
    <div className="w-32 h-32 md:w-48 md:h-48">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00f3ff" />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <MeshDistortMaterial
              color="#00f3ff"
              speed={3}
              distort={0.4}
              radius={1}
              emissive="#00f3ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          <Text
            position={[0, 0, 1.6]}
            fontSize={0.25}
            color="white"
            maxWidth={2}
            textAlign="center"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          >
            30-DAY AI CHALLENGER
          </Text>
        </Float>
      </Canvas>
    </div>
  );
}
