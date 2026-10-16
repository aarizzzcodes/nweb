import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BackgroundAnimationMode, ThemeConfig, ColorMode } from '../types';

interface ThreeBackgroundProps {
  mode: BackgroundAnimationMode;
  theme: ThemeConfig;
  colorMode?: ColorMode;
}

interface TrailParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  decay: number;
  baseSize: number;
  hueShift: number;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ mode, theme, colorMode = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resolved = theme[colorMode] || theme.dark;
    const isLight = colorMode === 'light';

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(resolved.threeFog, isLight ? 0.0012 : 0.0016);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1600);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // --- Procedural Glowing Particle Texture ---
    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d')!;
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      if (isLight) {
        // High-contrast clean crystalline particle texture for light atmosphere
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(240, 246, 255, 0.95)');
        grad.addColorStop(0.6, 'rgba(210, 230, 255, 0.5)');
        grad.addColorStop(0.85, 'rgba(180, 210, 255, 0.15)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
        grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.08)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();

    // --- Theme Color Parsing for 3D Atmosphere ---
    const themeColor = new THREE.Color(resolved.threeParticlePrimary);
    const accentSecondary = new THREE.Color(resolved.threeParticleSecondary);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.75 : 0.45);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(themeColor, isLight ? 4.2 : 3.2, 500);
    pointLight.position.set(0, 0, 110);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(accentSecondary, isLight ? 3.0 : 2.2, 500);
    secondaryLight.position.set(-160, 130, -40);
    scene.add(secondaryLight);

    // Master Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // =========================================================================
    // 1. STARFIELD / PARTICLE GALAXY
    // =========================================================================
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 1300;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1300;
      starVelocities[i] = Math.random() * 0.4 + 0.15;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: themeColor,
      size: isLight ? 3.8 : 3.2,
      map: particleTexture,
      transparent: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      opacity: isLight ? 0.7 : 0.8,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    rootGroup.add(starPoints);

    // Warp Mode Speedstreaks
    const warpStreakCount = 200;
    const warpStreakGeo = new THREE.BufferGeometry();
    const warpStreakPositions = new Float32Array(warpStreakCount * 6); // 2 vertices per line
    warpStreakGeo.setAttribute('position', new THREE.BufferAttribute(warpStreakPositions, 3));
    const warpStreakMat = new THREE.LineBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: isLight ? 0.6 : 0.4,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const warpStreaks = new THREE.LineSegments(warpStreakGeo, warpStreakMat);
    warpStreaks.visible = mode === 'warp';
    rootGroup.add(warpStreaks);

    // =========================================================================
    // 2. 3D HOLOGRAPHIC QUANTUM CORE (Lattice + Dual Gimbal Rings)
    // =========================================================================
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    // Geodesic / Icosahedron core wireframe
    const coreGeo = new THREE.IcosahedronGeometry(36, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreWireMat);
    coreGroup.add(coreMesh);

    // Inner glowing faceted core
    const innerCoreGeo = new THREE.IcosahedronGeometry(22, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: themeColor,
      roughness: 0.2,
      metalness: 0.85,
      emissive: themeColor,
      emissiveIntensity: 0.4,
      wireframe: true,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    // Orbital Holographic Rings
    const ringGeometries: THREE.BufferGeometry[] = [];
    const ringMaterials: THREE.Material[] = [];
    const ringMeshes: THREE.LineLoop[] = [];

    const ringRadii = [56, 76, 96];
    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 100;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(points);
      ringGeometries.push(ringGeo);

      const ringMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? themeColor : accentSecondary,
        transparent: true,
        opacity: 0.48 - idx * 0.1,
      });
      ringMaterials.push(ringMat);

      const ringMesh = new THREE.LineLoop(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI * 0.25 * (idx + 1);
      ringMesh.rotation.y = Math.PI * 0.35 * idx;
      coreGroup.add(ringMesh);
      ringMeshes.push(ringMesh);
    });

    // Outer orbital telemetry satellite nodes
    const nodeCount = 12;
    const nodeGeometry = new THREE.SphereGeometry(1.6, 10, 10);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: isLight ? 0x1e293b : 0xffffff });
    const nodesGroup = new THREE.Group();
    for (let n = 0; n < nodeCount; n++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const angle = (n / nodeCount) * Math.PI * 2;
      const r = 84;
      node.position.set(Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(angle * 3) * 18);
      nodesGroup.add(node);
    }
    coreGroup.add(nodesGroup);

    // =========================================================================
    // 3. ORBITAL PARTICLE COMET STREAMS (Continuous Energy Trails Around Core)
    // =========================================================================
    // 3 luminous comet heads, each leaving an orbiting particle trail
    const COMETS_COUNT = 3;
    const TRAIL_PER_COMET = 24;
    const TOTAL_COMET_PARTICLES = COMETS_COUNT * TRAIL_PER_COMET;

    const cometGeo = new THREE.BufferGeometry();
    const cometPositions = new Float32Array(TOTAL_COMET_PARTICLES * 3);
    const cometColors = new Float32Array(TOTAL_COMET_PARTICLES * 3);
    cometGeo.setAttribute('position', new THREE.BufferAttribute(cometPositions, 3));
    cometGeo.setAttribute('color', new THREE.BufferAttribute(cometColors, 3));

    const cometMat = new THREE.PointsMaterial({
      size: 5.5,
      map: particleTexture,
      transparent: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const cometPoints = new THREE.Points(cometGeo, cometMat);
    coreGroup.add(cometPoints);

    // History of past positions for each comet
    const cometHistories: Array<Array<{ x: number; y: number; z: number }>> = Array.from(
      { length: COMETS_COUNT },
      () => []
    );

    // =========================================================================
    // 4. INTERACTIVE MOUSE CURSOR PARTICLE TRAIL (Dynamic Cyber Wake)
    // =========================================================================
    // When the user moves the cursor across the screen, a dynamic 3D wake of glowing
    // particles erupts, floats, and disperses in world space!
    const MAX_TRAIL_PARTICLES = 160;
    const trailPool: TrailParticle[] = [];
    for (let i = 0; i < MAX_TRAIL_PARTICLES; i++) {
      trailPool.push({
        x: 0,
        y: 0,
        z: -9999, // Offscreen initially
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        decay: 0.025,
        baseSize: 6.0,
        hueShift: 0,
      });
    }

    const mouseTrailGeo = new THREE.BufferGeometry();
    const mouseTrailPositions = new Float32Array(MAX_TRAIL_PARTICLES * 3);
    const mouseTrailColors = new Float32Array(MAX_TRAIL_PARTICLES * 3);
    mouseTrailGeo.setAttribute('position', new THREE.BufferAttribute(mouseTrailPositions, 3));
    mouseTrailGeo.setAttribute('color', new THREE.BufferAttribute(mouseTrailColors, 3));

    const mouseTrailMat = new THREE.PointsMaterial({
      size: 7.0,
      map: particleTexture,
      transparent: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const mouseTrailPoints = new THREE.Points(mouseTrailGeo, mouseTrailMat);
    scene.add(mouseTrailPoints);

    // Mouse Tracking in 3D Frustum Space
    let worldMouse = { x: 0, y: 0, z: 120, hasMoved: false };
    let lastWorldMouse = { x: 0, y: 0, z: 120 };
    const mouseDamped = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseDamped.targetX = (e.clientX - width / 2) * 0.0012;
      mouseDamped.targetY = (e.clientY - height / 2) * 0.0012;

      // Project cursor into 3D plane at z = 120
      const ndcX = (e.clientX / width) * 2 - 1;
      const ndcY = -(e.clientY / height) * 2 + 1;
      const halfFovRad = ((camera.fov / 2) * Math.PI) / 180;
      const depthDist = camera.position.z - 120; // 240 - 120 = 120
      const planeHalfHeight = Math.tan(halfFovRad) * depthDist;
      const planeHalfWidth = planeHalfHeight * (width / height);

      worldMouse.x = ndcX * planeHalfWidth;
      worldMouse.y = ndcY * planeHalfHeight;
      worldMouse.z = 120;
      worldMouse.hasMoved = true;

      // Spawn trail particles upon motion
      const dist = Math.hypot(worldMouse.x - lastWorldMouse.x, worldMouse.y - lastWorldMouse.y);
      if (dist > 1.5) {
        const spawnCount = Math.min(Math.floor(dist * 0.8) + 1, 4);
        for (let s = 0; s < spawnCount; s++) {
          // Find first inactive particle
          const p = trailPool.find((part) => part.life <= 0);
          if (p) {
            const lerpFactor = s / spawnCount;
            p.x = lastWorldMouse.x + (worldMouse.x - lastWorldMouse.x) * lerpFactor;
            p.y = lastWorldMouse.y + (worldMouse.y - lastWorldMouse.y) * lerpFactor;
            p.z = 120 + (Math.random() - 0.5) * 15;
            p.vx = (Math.random() - 0.5) * 0.6 + (worldMouse.x - lastWorldMouse.x) * 0.04;
            p.vy = (Math.random() - 0.5) * 0.6 + (worldMouse.y - lastWorldMouse.y) * 0.04;
            p.vz = (Math.random() - 0.5) * 0.8;
            p.life = 1.0;
            p.decay = 0.018 + Math.random() * 0.016;
            p.baseSize = Math.random() * 4.5 + 4.5;
            p.hueShift = (Math.random() - 0.5) * 0.2;
          }
        }
        lastWorldMouse.x = worldMouse.x;
        lastWorldMouse.y = worldMouse.y;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 5. 3D CYBER GRID (Perspective Horizon Grid)
    // =========================================================================
    const gridHelper = new THREE.GridHelper(840, 32, themeColor, new THREE.Color(isLight ? 0xd0dbe5 : 0x131d2a));
    gridHelper.position.y = -95;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = isLight ? 0.28 : 0.35;
    rootGroup.add(gridHelper);

    // Mode Adjustments
    if (mode === 'circuit') {
      coreGroup.visible = true;
      gridHelper.visible = true;
      warpStreaks.visible = false;
      starMaterial.size = 3.2;
    } else if (mode === 'warp') {
      coreGroup.visible = false;
      gridHelper.visible = false;
      warpStreaks.visible = true;
      starMaterial.size = 4.8;
    } else if (mode === 'constellation') {
      coreGroup.visible = false;
      gridHelper.visible = true;
      warpStreaks.visible = false;
      starMaterial.size = 3.6;
    } else {
      // 'waves' or default
      coreGroup.visible = true;
      gridHelper.visible = true;
      warpStreaks.visible = false;
      starMaterial.size = 3.2;
    }

    // =========================================================================
    // 6. 60FPS ANIMATION LOOP WITH DYNAMIC PARTICLE PHYSICS
    // =========================================================================
    const startTime = performance.now();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTime = timestamp || performance.now();
      const elapsedTime = (currentTime - startTime) * 0.001;

      // Smooth mouse camera parallax
      mouseDamped.x += (mouseDamped.targetX - mouseDamped.x) * 0.05;
      mouseDamped.y += (mouseDamped.targetY - mouseDamped.y) * 0.05;

      camera.position.x = mouseDamped.x * 65;
      camera.position.y = -mouseDamped.y * 55;
      camera.lookAt(0, 0, 0);

      // --- Core Rotations & Visuals ---
      if (coreGroup.visible) {
        coreMesh.rotation.x = elapsedTime * 0.22;
        coreMesh.rotation.y = elapsedTime * 0.32;

        innerCoreMesh.rotation.x = -elapsedTime * 0.38;
        innerCoreMesh.rotation.z = elapsedTime * 0.28;

        ringMeshes.forEach((ring, idx) => {
          ring.rotation.z += 0.0035 * (idx % 2 === 0 ? 1 : -1) * (idx + 1);
          ring.rotation.x += 0.002 * (idx + 1);
        });

        nodesGroup.rotation.z = elapsedTime * 0.14;
        nodesGroup.rotation.y = elapsedTime * 0.1;

        // --- Orbiting Comet Trails around Quantum Core ---
        const cometPosArr = cometGeo.attributes.position.array as Float32Array;
        const cometColArr = cometGeo.attributes.color.array as Float32Array;

        // Calculate current 3D positions for 3 comets
        const cometCurrent = [
          {
            x: Math.cos(elapsedTime * 1.8) * 72,
            y: Math.sin(elapsedTime * 1.8) * 72,
            z: Math.sin(elapsedTime * 3.6) * 16,
          },
          {
            x: Math.cos(elapsedTime * 2.2 + 2.1) * 92,
            y: Math.sin(elapsedTime * 1.1 + 1.0) * 45,
            z: Math.sin(elapsedTime * 2.2 + 2.1) * 92,
          },
          {
            x: Math.sin(elapsedTime * 1.4 + 4.2) * 58,
            y: Math.cos(elapsedTime * 1.4 + 4.2) * 105,
            z: Math.cos(elapsedTime * 2.8) * 25,
          },
        ];

        // Push current positions to history
        for (let c = 0; c < COMETS_COUNT; c++) {
          const hist = cometHistories[c];
          hist.unshift({ ...cometCurrent[c] });
          if (hist.length > TRAIL_PER_COMET) hist.pop();

          const baseColor = c === 1 ? accentSecondary : themeColor;

          for (let t = 0; t < TRAIL_PER_COMET; t++) {
            const idx = (c * TRAIL_PER_COMET + t) * 3;
            if (t < hist.length) {
              const pos = hist[t];
              cometPosArr[idx] = pos.x;
              cometPosArr[idx + 1] = pos.y;
              cometPosArr[idx + 2] = pos.z;

              // Glowing intensity decay down trail
              const trailRatio = 1 - t / TRAIL_PER_COMET;
              const intensity = Math.pow(trailRatio, 1.8);
              cometColArr[idx] = (t === 0 ? 1.0 : baseColor.r) * intensity;
              cometColArr[idx + 1] = (t === 0 ? 1.0 : baseColor.g) * intensity;
              cometColArr[idx + 2] = (t === 0 ? 1.0 : baseColor.b) * intensity;
            } else {
              cometPosArr[idx + 2] = -9999;
            }
          }
        }
        cometGeo.attributes.position.needsUpdate = true;
        cometGeo.attributes.color.needsUpdate = true;
      }

      // --- Interactive Cursor Particle Trail Physics ---
      const trailPosArr = mouseTrailGeo.attributes.position.array as Float32Array;
      const trailColArr = mouseTrailGeo.attributes.color.array as Float32Array;

      for (let i = 0; i < MAX_TRAIL_PARTICLES; i++) {
        const p = trailPool[i];
        const idx = i * 3;

        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.vz *= 0.95;
          p.life -= p.decay;

          trailPosArr[idx] = p.x;
          trailPosArr[idx + 1] = p.y;
          trailPosArr[idx + 2] = p.z;

          // Glowing color decay from white electric core to vibrant theme neon
          const lifeCurve = Math.max(0, p.life);
          const flash = Math.pow(lifeCurve, 3) * 0.7; // Initial bright flash
          const r = Math.min(1, themeColor.r * lifeCurve + flash);
          const g = Math.min(1, themeColor.g * lifeCurve + flash);
          const b = Math.min(1, themeColor.b * lifeCurve + flash);

          trailColArr[idx] = r;
          trailColArr[idx + 1] = g;
          trailColArr[idx + 2] = b;
        } else {
          trailPosArr[idx + 2] = -9999; // Move inactive offscreen
          trailColArr[idx] = 0;
          trailColArr[idx + 1] = 0;
          trailColArr[idx + 2] = 0;
        }
      }
      mouseTrailGeo.attributes.position.needsUpdate = true;
      mouseTrailGeo.attributes.color.needsUpdate = true;

      // --- Starfield Physics & Warp Streaks ---
      const starPosArr = starGeometry.attributes.position.array as Float32Array;
      const isWarp = mode === 'warp';
      const warpSpeed = isWarp ? 9.5 : 0.38;

      for (let i = 0; i < starCount; i++) {
        const zIndex = i * 3 + 2;
        starPosArr[zIndex] += starVelocities[i] * warpSpeed;

        if (starPosArr[zIndex] > 400) {
          starPosArr[zIndex] = -850;
          starPosArr[i * 3] = (Math.random() - 0.5) * 1300;
          starPosArr[i * 3 + 1] = (Math.random() - 0.5) * 1100;
        }
      }
      starGeometry.attributes.position.needsUpdate = true;

      // Update warp speed streaks if in warp mode
      if (warpStreaks.visible) {
        const streakArr = warpStreakGeo.attributes.position.array as Float32Array;
        for (let w = 0; w < warpStreakCount; w++) {
          const sIdx = w * 6;
          const starX = starPosArr[w * 3];
          const starY = starPosArr[w * 3 + 1];
          const starZ = starPosArr[w * 3 + 2];

          streakArr[sIdx] = starX;
          streakArr[sIdx + 1] = starY;
          streakArr[sIdx + 2] = starZ;

          // Trailing line behind the star
          streakArr[sIdx + 3] = starX;
          streakArr[sIdx + 4] = starY;
          streakArr[sIdx + 5] = starZ - 38;
        }
        warpStreakGeo.attributes.position.needsUpdate = true;
      }

      // Grid oscillation
      if (gridHelper.visible) {
        gridHelper.position.z = (elapsedTime * 24) % (840 / 32);
      }

      // Breathing ambient light pulse
      pointLight.intensity = 2.6 + Math.sin(elapsedTime * 2) * 0.7;

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // =========================================================================
    // 7. RESIZE HANDLER & SYSTEM CLEANUP
    // =========================================================================
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      // Clean disposal of WebGL geometries & materials
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      warpStreakGeo.dispose();
      warpStreakMat.dispose();
      particleTexture.dispose();
      coreGeo.dispose();
      coreWireMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      gridHelper.dispose();
      cometGeo.dispose();
      cometMat.dispose();
      mouseTrailGeo.dispose();
      mouseTrailMat.dispose();
      ringGeometries.forEach((g) => g.dispose());
      ringMaterials.forEach((m) => m.dispose());

      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, theme]);

  return (
    <div
      ref={containerRef}
      className="three-background-canvas-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};
