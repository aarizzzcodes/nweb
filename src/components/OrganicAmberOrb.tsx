import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * =========================================================================
 * 3D ORGANIC AMBER ORB CUSTOMIZATION SETTINGS
 * Edit the values below to customize the orb's metallic color,
 * surface roughness, metalness, clearcoat, lighting, and animation speeds.
 * =========================================================================
 */
export const ORB_CONFIG = {
  // Primary base color of the metallic/glass orb (warm amber/golden bronze)
  color: '#c98a3b', // Try: '#d4af37' (rich gold), '#e59a3c' (amber), '#8c6239' (deep bronze)

  // Surface finish properties
  metalness: 0.82,       // 0.0 (dielectric) to 1.0 (pure liquid chrome/metal)
  roughness: 0.19,       // 0.0 (mirror glossy) to 1.0 (matte)
  clearcoat: 0.9,        // Glossy lacquer layer on top
  clearcoatRoughness: 0.12,

  // Lighting Colors and Intensities
  lights: {
    keyLightColor: '#ffb347',       // Warm amber front-top key light
    keyLightIntensity: 3.8,
    rimLightColor: '#ffd79a',       // Glowing golden rim light behind cavity
    rimLightIntensity: 4.5,
    fillLightColor: '#cc7000',      // Deep warm amber fill
    fillLightIntensity: 2.4,
    coolFillColor: '#4d698c',       // Subtle cool back rim for cinematic depth
    coolFillIntensity: 1.2,
    ambientColor: '#2b1a0a',        // Soft warm ambient base
    ambientIntensity: 1.8,
  },

  // Motion & Organic Distortion Dynamics
  selfRotationSpeedX: 0.0025,
  selfRotationSpeedY: 0.0045,
  selfRotationSpeedZ: 0.002,
  morphStrength: 0.18,             // Amplitude of organic breathing shape distortion
  morphSpeed: 1.2,                 // Speed of organic liquid undulating
  parallaxStrength: 0.45,          // How much the orb tilts towards the mouse
};

interface OrganicAmberOrbProps {
  className?: string;
  customColor?: string;
  customRoughness?: number;
  customMetalness?: number;
}

export const OrganicAmberOrb: React.FC<OrganicAmberOrbProps> = ({
  className = '',
  customColor,
  customRoughness,
  customMetalness,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Lighting Rig (Warm Amber, Golden Rim, and Depth Highlights) ---
    const { lights } = ORB_CONFIG;

    const ambientLight = new THREE.AmbientLight(
      lights.ambientColor,
      lights.ambientIntensity
    );
    scene.add(ambientLight);

    // Front-Right Warm Key Light
    const keyLight = new THREE.PointLight(
      lights.keyLightColor,
      lights.keyLightIntensity,
      35
    );
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);

    // Behind Cavity Rim Light (creates the glowing contour through the inner hole)
    const rimLight = new THREE.PointLight(
      lights.rimLightColor,
      lights.rimLightIntensity,
      30
    );
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Left Bottom Warm Fill Light
    const fillLight = new THREE.PointLight(
      lights.fillLightColor,
      lights.fillLightIntensity,
      25
    );
    fillLight.position.set(-7, -5, 5);
    scene.add(fillLight);

    // Top Back Cool Rim Light (accents the metallic edge curves)
    const coolRim = new THREE.PointLight(
      lights.coolFillColor,
      lights.coolFillIntensity,
      25
    );
    coolRim.position.set(2, 8, -4);
    scene.add(coolRim);

    // --- Organic Hollow Orb Geometry (Sculptured Plump Torus with Inner Cavity) ---
    // A plump torus creates the iconic hollowed-cavity organic sphere seen in the video
    const geometry = new THREE.TorusGeometry(2.35, 1.45, 72, 128);

    // Save original position & normal arrays for fluid organic morphing
    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;
    const originalPositions = new Float32Array(posAttr.array);
    const normals = geometry.attributes.normal.array as Float32Array;

    // --- Metallic / Amber Physical Material ---
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(customColor || ORB_CONFIG.color),
      metalness: customMetalness !== undefined ? customMetalness : ORB_CONFIG.metalness,
      roughness: customRoughness !== undefined ? customRoughness : ORB_CONFIG.roughness,
      clearcoat: ORB_CONFIG.clearcoat,
      clearcoatRoughness: ORB_CONFIG.clearcoatRoughness,
      reflectivity: 0.95,
      sheen: 0.85,
      sheenColor: new THREE.Color('#ffe2a8'),
      sheenRoughness: 0.25,
    });

    const orbMesh = new THREE.Mesh(geometry, material);
    // Initial aesthetic tilt matching the reference video
    orbMesh.rotation.set(0.4, 0.25, 0.15);
    scene.add(orbMesh);

    // --- Interactive Mouse Parallax Listener ---
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.x = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation & Morph Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const currentPositions = posAttr.array as Float32Array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * ORB_CONFIG.morphSpeed;

      // 1. Organic Harmonic Vertex Morphing (creates undulating liquid-metal surface)
      const morphStrength = ORB_CONFIG.morphStrength;
      for (let i = 0; i < vertexCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        // Multi-frequency harmonic wave displacement
        const wave1 = Math.sin(ox * 1.1 + elapsedTime * 1.2) * Math.cos(oy * 1.2 + elapsedTime * 0.9);
        const wave2 = Math.sin(oz * 1.3 + elapsedTime * 1.4) * 0.5;
        const wave3 = Math.cos((ox + oz) * 0.8 + elapsedTime) * 0.4;
        const totalDisplacement = (wave1 + wave2 + wave3) * morphStrength;

        // Displace along normal
        const nx = normals[i3];
        const ny = normals[i3 + 1];
        const nz = normals[i3 + 2];

        currentPositions[i3] = ox + nx * totalDisplacement;
        currentPositions[i3 + 1] = oy + ny * totalDisplacement;
        currentPositions[i3 + 2] = oz + nz * totalDisplacement;
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // 2. Continuous Fluid Self-Rotation
      orbMesh.rotation.x += ORB_CONFIG.selfRotationSpeedX;
      orbMesh.rotation.y += ORB_CONFIG.selfRotationSpeedY;
      orbMesh.rotation.z += ORB_CONFIG.selfRotationSpeedZ;

      // 3. Smooth Mouse Parallax Tilt
      const targetTiltX = mouseRef.current.y * ORB_CONFIG.parallaxStrength;
      const targetTiltY = mouseRef.current.x * ORB_CONFIG.parallaxStrength;
      
      // Gentle damping towards mouse tilt
      orbMesh.position.x += (targetTiltY * 0.8 - orbMesh.position.x) * 0.04;
      orbMesh.position.y += (-targetTiltX * 0.6 - orbMesh.position.y) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [customColor, customRoughness, customMetalness]);

  return (
    <div
      ref={containerRef}
      className={`organic-amber-orb-canvas-container ${className}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '850px',
        height: '750px',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
