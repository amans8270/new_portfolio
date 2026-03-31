import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function GraphNodes() {
  const ref = useRef<THREE.Group>(null);
  
  const skills = [
    { name: 'React', pos: [2, 1, 0] },
    { name: 'FastAPI', pos: [-2, -1, 0] },
    { name: 'LangGraph', pos: [0, 2, 1] },
    { name: 'Next.js', pos: [-1, 1, -1] },
    { name: 'Python', pos: [1, -2, 0] },
    { name: 'PostgreSQL', pos: [3, -1, -1] },
  ];

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {skills.map((skill, i) => (
        <group key={i} position={skill.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
          </mesh>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="#00f3ff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          >
            {skill.name}
          </Text>
        </group>
      ))}
      {/* Lines between nodes */}
      {skills.map((skill, i) => {
        const nextSkill = skills[(i + 1) % skills.length];
        const points = [
          new THREE.Vector3(...skill.pos),
          new THREE.Vector3(...nextSkill.pos)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive 
            key={`line-${i}`} 
            object={new THREE.Line(
              lineGeometry, 
              new THREE.LineBasicMaterial({ color: "#00f3ff", transparent: true, opacity: 0.2 })
            )} 
          />
        );
      })}
    </group>
  );
}

function ParticleField() {
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f3ff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function StateGraph() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <GraphNodes />
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] opacity-80" />
    </div>
  );
}
