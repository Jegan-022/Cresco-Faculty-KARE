import React, { useEffect, useRef } from 'react';

interface LiquidLinesProps {
  color?: string;
  secondaryColor?: string;
  speed?: number;
  frequency?: number;
  opacity?: number;
}

export const LiquidLinesCanvas: React.FC<LiquidLinesProps> = ({
  color = '#06c8d9',
  secondaryColor = '#10b981',
  speed = 0.35,
  frequency = 46,
  opacity = 0.75,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let phase = 0;

    // Multi-layered harmonic wave simulation
    const waves = [
      { y: height * 0.45, length: 0.0035, amplitude: 55, speed: speed * 0.02, color: color, alpha: opacity * 0.85 },
      { y: height * 0.52, length: 0.0028, amplitude: 75, speed: -speed * 0.015, color: color, alpha: opacity * 0.6 },
      { y: height * 0.62, length: 0.0042, amplitude: 60, speed: speed * 0.025, color: secondaryColor, alpha: opacity * 0.5 },
      { y: height * 0.75, length: 0.0022, amplitude: 85, speed: -speed * 0.018, color: color, alpha: opacity * 0.4 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      phase += speed * 0.02;

      waves.forEach((w, index) => {
        ctx.beginPath();
        ctx.lineWidth = index === 0 ? 2.5 : 1.5;
        ctx.strokeStyle = w.color;
        ctx.globalAlpha = w.alpha;

        const baseOffset = Math.sin(phase * 0.5 + index) * 20;

        for (let x = 0; x < width; x += 3) {
          const wave1 = Math.sin(x * w.length + phase * (index % 2 === 0 ? 1 : -1) + (index * Math.PI) / 3);
          const wave2 = Math.cos(x * 0.0015 - phase * 0.8);
          const y = w.y + baseOffset + wave1 * w.amplitude + wave2 * (w.amplitude * 0.4);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Subtle gradient glow under main wave
        if (index === 0) {
          ctx.save();
          ctx.lineWidth = 6;
          ctx.globalAlpha = 0.12;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Digital network nodal particles
      const particleTime = phase * 2;
      for (let i = 0; i < 24; i++) {
        const px = ((i * 137.5 + particleTime * 18) % width);
        const py = ((i * 83.2 + Math.sin(particleTime + i) * 60 + height * 0.5) % height);
        ctx.fillStyle = i % 2 === 0 ? color : secondaryColor;
        ctx.globalAlpha = 0.25 + 0.2 * Math.sin(phase + i);
        ctx.beginPath();
        ctx.arc(px, py, (i % 3) + 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, secondaryColor, speed, frequency, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};
