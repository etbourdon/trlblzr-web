'use client';

import { useEffect, useRef } from 'react';

// Animated topographic contour lines with a winding trail path, adapted from a standalone demo
// (Tour du Mont Blanc elevation matrix) for use as a Refuge background. Recolored to the trail
// palette (dust contour lines, ember trail) instead of the original blue/orange tech-dashboard
// look. Pauses on prefers-reduced-motion and when the tab is hidden, to avoid burning battery
// behind static text nobody's looking at.
export default function TopoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let paused = document.hidden;

    const LOOP_DURATION = 45;

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function getElevation(x: number, z: number, phase: number) {
      const normX = x * 0.002;
      const normZ = z * 0.002;

      const massifAnchor = -450;
      const distFromMassif = Math.abs(x - massifAnchor);
      const montBlancMassif = Math.max(0, 1 - distFromMassif * 0.001) * 260;

      const ridges =
        Math.sin(normX * 3.0 + normZ * 2.0 + phase) * 45 +
        Math.cos(normX * 5.0 - normZ * 1.5) * 25;

      const valley = Math.sin(normZ * 2.0 + phase) * 50;

      return montBlancMassif + ridges + valley - 40;
    }

    function draw(progress: number) {
      if (!ctx) return;
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, width, height);

      const phase = progress * Math.PI * 2;
      const lateralShift = Math.sin(phase) * 300;

      const horizonY = height * 0.45;
      const numLines = 50;
      const lineSegments = 85;

      for (let i = numLines - 1; i >= 0; i--) {
        let zDepth = i * 32 - (progress * 32) % 32;
        if (zDepth < 2) zDepth += numLines * 32;

        const scale = 280 / (zDepth + 40);

        ctx.beginPath();
        let firstPoint = true;

        for (let j = 0; j <= lineSegments; j++) {
          const normalizedX = j / lineSegments - 0.5;
          const xWorld = normalizedX * 2200 - lateralShift;
          const yWorld = getElevation(xWorld, zDepth, phase);

          const screenX = width / 2 + normalizedX * 2200 * scale;
          const screenY = horizonY + (yWorld + zDepth * 0.4) * scale;

          if (firstPoint) {
            ctx.moveTo(screenX, screenY);
            firstPoint = false;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        const proximity = 1 - zDepth / (numLines * 32);
        // Dust ramp (#B8B0A2) instead of the original sky blue.
        const r = Math.floor(120 + proximity * 64);
        const g = Math.floor(112 + proximity * 64);
        const b = Math.floor(100 + proximity * 62);
        const alpha = Math.min(0.5, proximity * 0.7);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, proximity * 1.6);

        if (i <= 3) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#B8B0A2';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      let trailFirst = true;
      const trailSegments = 60;

      for (let k = 0; k <= trailSegments; k++) {
        const tNorm = k / trailSegments;
        const zDepth = tNorm * (numLines * 32);

        const xWorld = Math.sin(zDepth * 0.003 - phase * 2) * 280 - lateralShift;
        const yWorld = getElevation(xWorld, zDepth, phase);

        const scale = 280 / (zDepth + 40);

        const screenX = width / 2 + (xWorld + lateralShift) * scale;
        const screenY = horizonY + (yWorld + zDepth * 0.4) * scale;

        if (trailFirst) {
          ctx.moveTo(screenX, screenY);
          trailFirst = false;
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }

      ctx.strokeStyle = '#FFA378';
      ctx.lineWidth = 4.5;
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#FF7A47';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function animate() {
      if (!paused) {
        const progress = ((performance.now() / 1000) % LOOP_DURATION) / LOOP_DURATION;
        draw(progress);
      }
      frameId = requestAnimationFrame(animate);
    }

    const onVisibility = () => {
      paused = document.hidden || reduceMotion;
    };

    resize();
    draw(0);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    if (!reduceMotion) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-40"
    />
  );
}
