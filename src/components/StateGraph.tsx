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
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  const lineGeometries = useMemo(() => {
    return skills.map((skill, i) => {
      const nextSkill = skills[(i + 1) % skills.length];
      const points = [
        new THREE.Vector3(...skill.pos),
        new THREE.Vector3(...nextSkill.pos)
      ];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: "#00f3ff", 
    transparent: true, 
    opacity: 0.1 
  }), []);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.08, 12, 12), []);
  const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#00f3ff", 
    emissive: "#00f3ff", 
    emissiveIntensity: 1.5 
  }), []);

  return (
    <group ref={ref}>
      {skills.map((skill, i) => (
        <group key={i} position={skill.pos as [number, number, number]}>
          <mesh geometry={sphereGeometry} material={sphereMaterial} />
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.15}
            color="#00f3ff"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        </group>
      ))}
      {lineGeometries.map((geometry, i) => (
        <primitive 
          key={`line-${i}`} 
          object={new THREE.Line(geometry, lineMaterial)} 
        />
      ))}
    </group>
  );
}

function ParticleField() {
  const count = 800; // Reduced from 2000
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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

const StateGraph = React.memo(function StateGraph() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <GraphNodes />
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] opacity-80" />
    </div>
  );
});

export default StateGraph;
