import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sphere } from '@react-three/drei';
import type * as THREE from 'three';
import { shouldEnable3DScene, useDeviceMotionPrefs } from '../../lib/animations';

function hasHardwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/SwiftShader|llvmpipe|softpipe/i.test(rendererStr);
  } catch {
    return false;
  }
}

const AnimatedSphere: React.FC = () => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.25;
    mesh.current.rotation.y = t * 0.18;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.45} floatIntensity={0.8}>
      <Sphere ref={mesh} args={[1.45, 64, 64]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.42}
          speed={1.8}
          roughness={0.22}
          metalness={0.78}
        />
      </Sphere>
    </Float>
  );
};

export const FloatingGeometry: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { viewportWidth, prefersReduced } = useDeviceMotionPrefs();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(shouldEnable3DScene(viewportWidth, prefersReduced) && hasHardwareWebGL());
  }, [viewportWidth, prefersReduced]);

  if (!supported) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-4 lg:left-10 top-12 w-48 h-48 lg:w-64 lg:h-64 opacity-35 dark:opacity-50 z-0 hidden lg:block ${className}`}
    >
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#a5b4fc', '#0f766e', 0.8]} />
        <directionalLight position={[10, 10, 5]} intensity={1.3} color="#6366f1" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#14b8a6" />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};
