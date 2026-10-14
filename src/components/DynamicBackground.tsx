import React, { useEffect, useRef } from 'react';
import { BackgroundAnimationMode, ThemeConfig } from '../types';

interface DynamicBackgroundProps {
  mode: BackgroundAnimationMode;
  theme: ThemeConfig;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ mode, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 170,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      rebuild();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==========================================
    // 1. Constellation Network Simulation
    // ==========================================
    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      baseAlpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.baseAlpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3.5;
            this.y -= (dy / dist) * force * 3.5;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.accentCyan;
        ctx.globalAlpha = this.baseAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    let particles: Particle[] = [];

    // ==========================================
    // 2. Circuit Matrix Simulation
    // ==========================================
    interface CircuitNode {
      x: number;
      y: number;
      connectedTo: number[];
      pulseProgress: number;
      pulseSpeed: number;
      activeTarget: number | null;
      pulseColor: string;
    }

    let circuitNodes: CircuitNode[] = [];

    const initCircuit = () => {
      circuitNodes = [];
      const cols = Math.floor(width / 130) + 1;
      const rows = Math.floor(height / 130) + 1;
      const xSpacing = width / cols;
      const ySpacing = height / rows;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const jitterX = (Math.random() - 0.5) * 20;
          const jitterY = (Math.random() - 0.5) * 20;
          circuitNodes.push({
            x: c * xSpacing + jitterX,
            y: r * ySpacing + jitterY,
            connectedTo: [],
            pulseProgress: Math.random(),
            pulseSpeed: 0.008 + Math.random() * 0.015,
            activeTarget: null,
            pulseColor: Math.random() > 0.4 ? theme.accentCyan : theme.accentViolet,
          });
        }
      }

      // Connect neighbor nodes in a circuit grid
      for (let i = 0; i < circuitNodes.length; i++) {
        for (let j = i + 1; j < circuitNodes.length; j++) {
          const dx = circuitNodes[i].x - circuitNodes[j].x;
          const dy = circuitNodes[i].y - circuitNodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < xSpacing * 1.5 && circuitNodes[i].connectedTo.length < 3) {
            circuitNodes[i].connectedTo.push(j);
          }
        }
        if (circuitNodes[i].connectedTo.length > 0) {
          circuitNodes[i].activeTarget =
            circuitNodes[i].connectedTo[
              Math.floor(Math.random() * circuitNodes[i].connectedTo.length)
            ];
        }
      }
    };

    // ==========================================
    // 3. Hyper-Warp Starfield Simulation
    // ==========================================
    class WarpStar {
      x: number;
      y: number;
      z: number;
      pz: number;

      constructor() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * width;
        this.pz = this.z;
      }

      update(speed: number) {
        this.z -= speed;
        if (this.z <= 0) {
          this.z = width;
          this.x = (Math.random() - 0.5) * width * 2;
          this.y = (Math.random() - 0.5) * height * 2;
          this.pz = this.z;
        }
      }

      draw() {
        if (!ctx) return;
        const cx = width / 2;
        const cy = height / 2;

        const k = 128 / this.z;
        const px = this.x * k + cx;
        const py = this.y * k + cy;

        const pk = 128 / this.pz;
        const prevX = this.x * pk + cx;
        const prevY = this.y * pk + cy;

        this.pz = this.z;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1 - this.z / width) * 1.5);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = theme.accentCyan;
          ctx.lineWidth = Math.max(0.5, (1 - this.z / width) * 3);
          ctx.globalAlpha = alpha;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }

    let warpStars: WarpStar[] = [];

    // ==========================================
    // 4. Cyber Harmonic Sine Waves Simulation
    // ==========================================
    let waveStep = 0;

    const rebuild = () => {
      // Constellation
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 12000), 95);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      // Circuit
      initCircuit();

      // Warp
      warpStars = [];
      const starCount = Math.min(Math.floor((width * height) / 4500), 280);
      for (let i = 0; i < starCount; i++) {
        warpStars.push(new WarpStar());
      }
    };

    rebuild();

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (mode === 'constellation') {
        // Render constellation
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = theme.accentCyan;
              ctx.globalAlpha = 0.18 * (1 - dist / 130);
              ctx.lineWidth = 0.9;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }
      } else if (mode === 'circuit') {
        // Render circuit lines and pulses
        for (let i = 0; i < circuitNodes.length; i++) {
          const node = circuitNodes[i];

          // Draw connections
          for (const targetIdx of node.connectedTo) {
            const target = circuitNodes[targetIdx];
            if (!target) continue;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = theme.accentCyan;
            ctx.globalAlpha = 0.08;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }

          // Draw node pads
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = theme.accentCyan;
          ctx.globalAlpha = 0.35;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Pulse along circuit trace
          if (node.activeTarget !== null && circuitNodes[node.activeTarget]) {
            node.pulseProgress += node.pulseSpeed;
            if (node.pulseProgress >= 1) {
              node.pulseProgress = 0;
              node.activeTarget =
                node.connectedTo[Math.floor(Math.random() * node.connectedTo.length)] ?? null;
            }

            const target = circuitNodes[node.activeTarget];
            if (target) {
              const px = node.x + (target.x - node.x) * node.pulseProgress;
              const py = node.y + (target.y - node.y) * node.pulseProgress;

              // Glowing signal packet
              const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 6);
              pulseGlow.addColorStop(0, node.pulseColor);
              pulseGlow.addColorStop(1, 'transparent');

              ctx.beginPath();
              ctx.arc(px, py, 4, 0, Math.PI * 2);
              ctx.fillStyle = pulseGlow;
              ctx.globalAlpha = 0.85;
              ctx.fill();
              ctx.globalAlpha = 1.0;
            }
          }
        }
      } else if (mode === 'warp') {
        // Warp stars
        let speed = 4;
        if (mouse.x !== null) {
          const distFromCenter = Math.hypot(mouse.x - width / 2, mouse.y! - height / 2);
          speed = 2 + (distFromCenter / (width / 2)) * 6;
        }
        for (let i = 0; i < warpStars.length; i++) {
          warpStars[i].update(speed);
          warpStars[i].draw();
        }
      } else if (mode === 'waves') {
        // Harmonic flowing sine waves
        waveStep += 0.015;
        const waveCount = 5;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const amp = 40 + w * 18;
          const freq = 0.0025 + w * 0.0008;
          const speed = waveStep * (1 + w * 0.25);
          const yOffset = height * (0.35 + w * 0.08);

          ctx.moveTo(0, yOffset);
          for (let x = 0; x <= width; x += 12) {
            let mouseInfluence = 0;
            if (mouse.x !== null && mouse.y !== null) {
              const dist = Math.hypot(x - mouse.x, yOffset - mouse.y);
              if (dist < 200) {
                mouseInfluence = (1 - dist / 200) * 35 * Math.sin(speed * 2);
              }
            }

            const y = yOffset + Math.sin(x * freq + speed) * amp + mouseInfluence;
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = w % 2 === 0 ? theme.accentCyan : theme.accentViolet;
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = 0.18 + w * 0.04;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [mode, theme]);

  return (
    <>
      <canvas id="bgCanvas" ref={canvasRef} />
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />
      {/* Dynamic scanline overlay for cyber texture */}
      <div className="cyber-ambient-grid" />
    </>
  );
};
