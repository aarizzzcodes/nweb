import React, { useRef, useEffect, useState } from 'react';

interface DotMatrixBrandProps {
  text?: string;
  className?: string;
  watermark?: boolean;
}

export const DotMatrixBrand: React.FC<DotMatrixBrandProps> = ({
  text = 'AARIZ',
  className = '',
  watermark = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 380 });
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Resize observer to keep canvas perfectly synced with the parent container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(300, Math.floor(rect.width));
      const h = Math.max(160, Math.floor(rect.height));
      setDimensions({ width: w, height: h });
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Canvas rasterization loop: draws muted, low-contrast dot-matrix watermark
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Create an offscreen canvas to render vector text and sample dot positions
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    // Wide spaced text e.g. "A A R I Z"
    const spacedText = text.split('').join(' ');

    // Calculate font size to fill the card nicely across the background
    let fontSize = Math.floor(height * 0.72);
    offCtx.font = `900 ${fontSize}px "Space Grotesk", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    let measured = offCtx.measureText(spacedText).width;
    if (measured > width * 0.92) {
      fontSize = Math.floor(fontSize * ((width * 0.92) / measured));
      offCtx.font = `900 ${fontSize}px "Space Grotesk", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    }

    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(spacedText, width / 2, height / 2);

    // Read pixel data
    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Grid spacing for the dot matrix
    const dotSpacing = width < 600 ? 5 : width < 1000 ? 6 : 7;
    const baseRadius = width < 600 ? 1.4 : width < 1000 ? 1.8 : 2.2;

    interface MatrixDot {
      x: number;
      y: number;
      alpha: number;
      originalAlpha: number;
    }

    const dots: MatrixDot[] = [];

    for (let y = Math.floor(dotSpacing / 2); y < height; y += dotSpacing) {
      for (let x = Math.floor(dotSpacing / 2); x < width; x += dotSpacing) {
        const pixelIdx = (y * width + x) * 4;
        const alpha = data[pixelIdx + 3];
        if (alpha > 40) {
          dots.push({
            x,
            y,
            alpha: alpha / 255,
            originalAlpha: alpha / 255,
          });
        }
      }
    }

    // Animation loop
    let animFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const mouse = mousePosRef.current;

      // Draw all matrix dots as subtle, low-contrast slate/gray watermark dots (matching Wafer reference)
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Gentle breathing shimmer factor (extremely low amplitude)
        const wave = Math.sin(time * 1.2 + d.x * 0.012 + d.y * 0.015) * 0.02;

        // Base opacity: muted dark grayish / slate tone (0.05 to 0.08)
        let opacity = watermark ? 0.065 + wave : 0.45;
        let scale = 1.0;

        // Subtle mouse proximity interaction (gently highlights dots near cursor up to 0.16)
        if (mouse) {
          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            scale += factor * 0.35;
            opacity += factor * (watermark ? 0.09 : 0.3);
          }
        }

        const r = baseRadius * scale;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);

        // Check current color mode
        const isLight = document.documentElement.getAttribute('data-color-mode') === 'light';

        // Muted low-contrast tone:
        // Dark mode: rgba(226, 232, 240, opacity)
        // Light mode: rgba(15, 23, 42, opacity)
        if (isLight) {
          ctx.fillStyle = `rgba(15, 23, 42, ${Math.min(0.18, opacity * d.originalAlpha * 1.1)})`;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${Math.min(0.25, opacity * d.originalAlpha)})`;
        }
        ctx.fill();
      }

      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [dimensions, text, watermark]);

  // Track mouse coordinates on parent
  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = null;
    };

    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`dot-matrix-watermark-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
};
