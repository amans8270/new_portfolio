import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';

const FloatingBadge = React.memo(function FloatingBadge() {
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48">
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00f3ff" />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <MeshDistortMaterial
              color="#00f3ff"
              speed={2}
              distort={0.3}
              radius={1}
              emissive="#00f3ff"
              emissiveIntensity={0.3}
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
          >
            30-DAY AI CHALLENGER
          </Text>
        </Float>
      </Canvas>
    </div>
  );
});

export default FloatingBadge;
