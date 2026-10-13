import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Proof Score Seal Component
function SealMesh({ mousePos }: { mousePos: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Subtle cursor parallax + gentle float
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetX = (mousePos.current[0] * 0.35);
    const targetY = (mousePos.current[1] * 0.25);
    
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX, 3, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetY, 3, delta);

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Golden Glow Light */}
      <pointLight position={[0, 0, 2.5]} intensity={1.8} color="#F9BE08" distance={6} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[-4, -3, 2]} intensity={0.6} color="#F9BE08" />

      {/* Main Matte Black Disc Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.28, 64]} />
        <meshStandardMaterial
          color="#1A1A19"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* Rim bevel edge */}
      <mesh position={[0, 0, 0.15]}>
        <ringGeometry args={[1.88, 1.98, 64]} />
        <meshStandardMaterial
          color="#F9BE08"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Rotating Accent Ring with Tick Marks */}
      <mesh ref={ringRef} position={[0, 0, 0.152]}>
        <ringGeometry args={[1.62, 1.74, 48]} />
        <meshStandardMaterial
          color="#F9BE08"
          roughness={0.3}
          metalness={0.85}
          wireframe
        />
      </mesh>

      {/* Inner Concentric Circle */}
      <mesh position={[0, 0, 0.151]}>
        <ringGeometry args={[1.35, 1.38, 64]} />
        <meshBasicMaterial color="#4A4A46" />
      </mesh>

      {/* Central Big Score Text "87" */}
      <Text
        position={[0, 0.22, 0.16]}
        fontSize={1.05}
        color="#F8F7F3"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad5365Db8-.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.04}
      >
        87
      </Text>

      {/* "/100" Subscript */}
      <Text
        position={[0, -0.42, 0.16]}
        fontSize={0.28}
        color="#F9BE08"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad5365Db8-.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        / 100
      </Text>

      {/* Small Verification Annotation Arc */}
      <Text
        position={[0, -0.78, 0.16]}
        fontSize={0.16}
        color="#A3A299"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad5365Db8-.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.22}
      >
        PX · PROOF VERIFIED
      </Text>

      {/* Top Annotation */}
      <Text
        position={[0, 0.95, 0.16]}
        fontSize={0.15}
        color="#F9BE08"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad5365Db8-.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        EXHIBIT SEAL 01
      </Text>
    </group>
  );
}

// Floating Evidence Cards orbiting in 3D
function OrbitingCard({
  position,
  rotation,
  title,
  subtitle,
  badge,
  speed = 1
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  subtitle: string;
  badge: string;
  speed?: number;
}) {
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={position} rotation={rotation}>
        {/* Card Canvas */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.5, 1.25]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.15}
            metalness={0.05}
          />
        </mesh>

        {/* 1px border simulation */}
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[2.54, 1.29]} />
          <meshBasicMaterial color="#E4E2DA" />
        </mesh>

        {/* Card Title */}
        <Text
          position={[-1.05, 0.35, 0.02]}
          fontSize={0.13}
          color="#1A1A19"
          anchorX="left"
          anchorY="middle"
          maxWidth={2.1}
        >
          {title}
        </Text>

        {/* Subtitle */}
        <Text
          position={[-1.05, 0.05, 0.02]}
          fontSize={0.11}
          color="#6B6A65"
          anchorX="left"
          anchorY="middle"
          maxWidth={2.1}
        >
          {subtitle}
        </Text>

        {/* Badge Pill */}
        <mesh position={[-0.45, -0.32, 0.015]}>
          <planeGeometry args={[1.2, 0.28]} />
          <meshBasicMaterial color="#1A1A19" />
        </mesh>
        <Text
          position={[-0.45, -0.32, 0.025]}
          fontSize={0.095}
          color="#F9BE08"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {badge}
        </Text>
      </group>
    </Float>
  );
}

export default function ProofSeal3D() {
  const mousePos = useRef<[number, number]>([0, 0]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current = [x, y];
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center select-none"
      style={{ touchAction: 'pan-y' }}
      aria-label="3D Interactive PitchX Proof Score verification seal and evidence badges"
    >
      {/* Subtle Yellow Atmospheric Glow behind seal */}
      <div 
        className="absolute w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-35"
        style={{ background: 'radial-gradient(circle, #F9BE08 0%, rgba(249,190,8,0) 70%)' }}
      />

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <SealMesh mousePos={mousePos} />
        </Float>

        {/* Orbiting Evidence Card 1: Top-Right (GitHub Artifact) */}
        <OrbitingCard
          position={[2.4, 1.25, -0.4]}
          rotation={[0.08, -0.22, 0.05]}
          title="repo: distributed-cache"
          subtitle="98% test cov · Rust · PR #42 merged"
          badge="CODE AUDITED ✓"
          speed={1.1}
        />

        {/* Orbiting Evidence Card 2: Bottom-Left (Live Benchmark) */}
        <OrbitingCard
          position={[-2.4, -1.0, 0.4]}
          rotation={[-0.05, 0.25, -0.04]}
          title="benchmark: 1.2ms p99"
          subtitle="Simulated 50k req/s · Verified logs"
          badge="PERF VERIFIED"
          speed={0.9}
        />

        {/* Orbiting Evidence Card 3: Top-Left (Algorithm Assessment) */}
        <OrbitingCard
          position={[-2.2, 1.35, -0.7]}
          rotation={[0.12, 0.18, -0.08]}
          title="assessment: Systems Architecture"
          subtitle="Score: 94/100 · Proctored"
          badge="TOP 3% RANK"
          speed={1.3}
        />
      </Canvas>
    </div>
  );
}
