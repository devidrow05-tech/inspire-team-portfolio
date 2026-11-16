import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { shouldEnable3DScene, useDeviceMotionPrefs } from '../../frontend/lib/animations';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const Hero3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { viewportWidth, prefersReduced } = useDeviceMotionPrefs();
  const enabled = shouldEnable3DScene(viewportWidth, prefersReduced);

  useEffect(() => {
    const container = mountRef.current;
    if (!enabled || !container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 5.2);

    // Studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Warm/Cool 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0xc7d2fe, 0x0f766e, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.2);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Composite multi-part procedural assembly (Gyroscopic Academy Emblem)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // 1. Primary Core Polyhedron
    const coreGeo = new THREE.IcosahedronGeometry(0.92, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x172554,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);
    geometries.push(coreGeo);
    materials.push(coreMat);

    // 2. Wireframe Accent Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(1.12, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      metalness: 0.4,
      roughness: 0.5,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    heroGroup.add(latticeMesh);
    geometries.push(latticeGeo);
    materials.push(latticeMat);

    // 3. Inner Gimbal Ring
    const innerRingGeo = new THREE.TorusGeometry(1.42, 0.045, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      metalness: 0.88,
      roughness: 0.18,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 3;
    heroGroup.add(innerRing);
    geometries.push(innerRingGeo);
    materials.push(innerRingMat);

    // 4. Outer Orbital Ring
    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.032, 16, 72);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      metalness: 0.65,
      roughness: 0.35,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.y = Math.PI / 4;
    heroGroup.add(outerRing);
    geometries.push(outerRingGeo);
    materials.push(outerRingMat);

    // 5. Three Orbital Accent Nodes
    const nodeGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
      metalness: 0.3,
      roughness: 0.2,
    });
    geometries.push(nodeGeo);
    materials.push(nodeMat);

    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i * Math.PI * 2) / 3;
      node.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
      outerRing.add(node);
      nodes.push(node);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let pointerTargetX = 0;
    let pointerTargetY = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerTargetX = ((e.clientX / window.innerWidth) - 0.5) * 0.45;
      pointerTargetY = ((e.clientY / window.innerHeight) - 0.5) * 0.35;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const startTime = performance.now();
    let lastTime = startTime;
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      coreMesh.rotation.y += delta * 0.42;
      coreMesh.rotation.x += delta * 0.24;
      latticeMesh.rotation.y -= delta * 0.2;
      innerRing.rotation.z += delta * 0.55;
      outerRing.rotation.z -= delta * 0.35;
      outerRing.rotation.x = Math.sin(elapsed * 0.5) * 0.25;

      heroGroup.position.y = Math.sin(elapsed * 1.1) * 0.12;
      heroGroup.rotation.y = THREE.MathUtils.damp(heroGroup.rotation.y, pointerTargetX, 3.5, delta);
      heroGroup.rotation.x = THREE.MathUtils.damp(heroGroup.rotation.x, pointerTargetY, 3.5, delta);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      aria-hidden="true"
      className="pointer-events-none absolute left-2 lg:left-10 top-8 w-56 h-56 lg:w-72 lg:h-72 opacity-85 dark:opacity-90 z-0 hidden sm:block"
    />
  );
};
