import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export const CosmicAuctionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
      'rgba(245, 158, 11,',  // gold
      'rgba(139, 92, 246,',  // purple
      'rgba(6, 182, 212,',   // teal
      'rgba(252, 211, 77,',  // light gold
    ];

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    // Initialize particles
    for (let i = 0; i < 180; i++) {
      particlesRef.current.push(spawnParticle());
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    let tick = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(6, 8, 13, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tick++;

      // Draw grid
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      const offsetX = (mouseRef.current.x * 0.02) % gridSize;
      const offsetY = (mouseRef.current.y * 0.02) % gridSize;
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update & draw particles
      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Mouse attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00005;
          p.vy += dy * 0.00005;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2
          ? lifeRatio / 0.2
          : lifeRatio > 0.8
          ? (1 - lifeRatio) / 0.2
          : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha * 0.8})`;
        ctx.fill();

        // Connect nearby particles
        particlesRef.current.slice(i + 1, i + 4).forEach(p2 => {
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - d / 80) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        if (p.life >= p.maxLife) {
          particlesRef.current[i] = spawnParticle();
        }
      });

      // Pulsing core glow
      const pulse = Math.sin(tick * 0.02) * 0.5 + 0.5;
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.4;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
      grd.addColorStop(0, `rgba(245, 158, 11, ${0.04 * pulse})`);
      grd.addColorStop(0.5, `rgba(139, 92, 246, ${0.02 * pulse})`);
      grd.addColorStop(1, 'rgba(6, 8, 13, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};