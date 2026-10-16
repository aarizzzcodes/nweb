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

import { ColorMode, ThemeColors } from '../types';

interface OrganicAmberOrbProps {
  className?: string;
  customColor?: string;
  customRoughness?: number;
  customMetalness?: number;
  colorMode?: ColorMode;
  themeColors?: ThemeColors;
}

export const OrganicAmberOrb: React.FC<OrganicAmberOrbProps> = ({
  className = '',
  customColor,
  customRoughness,
  customMetalness,
  colorMode = 'dark',
  themeColors,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLight = colorMode === 'light';

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
    renderer.toneMappingExposure = isLight ? 1.25 : 1.15;
    container.appendChild(renderer.domElement);

    // --- Lighting Rig (Adaptive per Dark/Light Theme) ---
    const { lights } = ORB_CONFIG;

    const ambientColor = themeColors ? themeColors.orbAmbientLight : (isLight ? '#cbd5e1' : lights.ambientColor);
    const ambientIntensity = isLight ? 2.2 : lights.ambientIntensity;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // Front-Right Key Light
    const keyColor = themeColors ? themeColors.orbKeyLight : (isLight ? '#ffffff' : lights.keyLightColor);
    const keyLight = new THREE.PointLight(keyColor, isLight ? 4.6 : lights.keyLightIntensity, 40);
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);

    // Behind Cavity Rim Light (creates the contour glow through the inner hole)
    const rimColor = themeColors ? themeColors.orbRimLight : (isLight ? '#93c5fd' : lights.rimLightColor);
    const rimLight = new THREE.PointLight(rimColor, isLight ? 4.2 : lights.rimLightIntensity, 35);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Left Bottom Fill Light
    const fillColor = themeColors ? themeColors.orbFillLight : (isLight ? '#60a5fa' : lights.fillLightColor);
    const fillLight = new THREE.PointLight(fillColor, isLight ? 3.0 : lights.fillLightIntensity, 30);
    fillLight.position.set(-7, -5, 5);
    scene.add(fillLight);

    // Top Back Cool Rim Light (accents edge curvature)
    const coolRim = new THREE.PointLight(
      isLight ? '#e2e8f0' : lights.coolFillColor,
      isLight ? 2.0 : lights.coolFillIntensity,
      25
    );
    coolRim.position.set(2, 8, -4);
    scene.add(coolRim);

    // --- Organic Hollow Orb Geometry (Sculptured Plump Torus with Inner Cavity) ---
    const geometry = new THREE.TorusGeometry(2.35, 1.45, 72, 128);

    // Save original position & normal arrays for fluid organic morphing
    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;
    const originalPositions = new Float32Array(posAttr.array);
    const normals = geometry.attributes.normal.array as Float32Array;

    // --- Metallic / Physical Material ---
    const orbBaseColor = customColor || (themeColors ? themeColors.orbColor : ORB_CONFIG.color);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(orbBaseColor),
      metalness: customMetalness !== undefined ? customMetalness : (isLight ? 0.88 : ORB_CONFIG.metalness),
      roughness: customRoughness !== undefined ? customRoughness : (isLight ? 0.16 : ORB_CONFIG.roughness),
      clearcoat: ORB_CONFIG.clearcoat,
      clearcoatRoughness: ORB_CONFIG.clearcoatRoughness,
      reflectivity: 0.98,
      sheen: isLight ? 0.95 : 0.85,
      sheenColor: new THREE.Color(isLight ? (themeColors?.accentCyan || '#93c5fd') : '#ffe2a8'),
      sheenRoughness: 0.22,
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
    const startTime = performance.now();

    const currentPositions = posAttr.array as Float32Array;

    const animate = (timestamp: number) => {
      animId = requestAnimationFrame(animate);
      const currentTime = timestamp || performance.now();
      const elapsedTime = ((currentTime - startTime) * 0.001) * ORB_CONFIG.morphSpeed;

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

    animate(performance.now());

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
