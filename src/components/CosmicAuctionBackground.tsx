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

interface Glyph {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
}

export const CosmicAuctionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particlesRef = useRef<Particle[]>([]);
  const glyphsRef = useRef<Glyph[]>([]);
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
      'rgba(245, 158, 11,',  // Gold
      'rgba(139, 92, 246,',  // Purple
      'rgba(6, 182, 212,',   // Teal
      'rgba(252, 211, 77,',  // Light gold
    ];

    const GLYPH_CHARS = ['0', '1', 'π', 'λ', 'Ω', 'ZK', '0x', '7F', 'C', 'B', 'µ', 'Ξ'];

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: Math.random() * 320 + 200,
    });

    const spawnGlyph = (): Glyph => ({
      x: Math.random() * canvas.width,
      y: -20,
      speed: Math.random() * 0.8 + 0.4,
      char: GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)],
      opacity: Math.random() * 0.35 + 0.1,
    });

    // Seed particles & falling glyphs
    for (let i = 0; i < 150; i++) {
      particlesRef.current.push(spawnParticle());
    }
    for (let i = 0; i < 28; i++) {
      glyphsRef.current.push({
        ...spawnGlyph(),
        y: Math.random() * canvas.height,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    let tick = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Deep dark trail fade
      ctx.fillStyle = 'rgba(6, 8, 13, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tick++;

      // ── Dynamic Cyber Grid with Mouse Warping ────────────────────────
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.035)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Vertical lines with subtle warp
      for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height; y += 40) {
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = dist < 220 ? ((220 - dist) / 220) * 8 * (dx > 0 ? 1 : -1) : 0;
          if (y === 0) ctx.moveTo(x + warp, y);
          else ctx.lineTo(x + warp, y);
        }
        ctx.stroke();
      }

      // Horizontal lines with subtle warp
      for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 40) {
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = dist < 220 ? ((220 - dist) / 220) * 8 * (dy > 0 ? 1 : -1) : 0;
          if (x === 0) ctx.moveTo(x, y + warp);
          else ctx.lineTo(x, y + warp);
        }
        ctx.stroke();
      }

      // ── Radar Beam Sweep ───────────────────────────────────────────
      const sweepY = (tick * 1.5) % (canvas.height + 200) - 100;
      const sweepGrd = ctx.createLinearGradient(0, sweepY - 40, 0, sweepY + 40);
      sweepGrd.addColorStop(0, 'rgba(245, 158, 11, 0)');
      sweepGrd.addColorStop(0.5, 'rgba(245, 158, 11, 0.03)');
      sweepGrd.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sweepGrd;
      ctx.fillRect(0, sweepY - 40, canvas.width, 80);

      // ── Falling Matrix Glyphs ──────────────────────────────────────
      ctx.font = '10px monospace';
      glyphsRef.current.forEach((g, idx) => {
        g.y += g.speed;
        ctx.fillStyle = `rgba(6, 182, 212, ${g.opacity})`;
        ctx.fillText(g.char, g.x, g.y);

        if (g.y > canvas.height + 20) {
          glyphsRef.current[idx] = spawnGlyph();
        }
      });

      // ── Interactive Particles & Constellation Links ─────────────────
      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Subtle mouse gravity attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 10) {
          p.vx += (dx / dist) * 0.025;
          p.vy += (dy / dist) * 0.025;
        }

        // Limit velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2
          ? lifeRatio / 0.2
          : lifeRatio > 0.8
          ? (1 - lifeRatio) / 0.2
          : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha * 0.85})`;
        ctx.fill();

        // Connect nearby particles
        particlesRef.current.slice(i + 1, i + 4).forEach(p2 => {
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - d / 85) * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        if (p.life >= p.maxLife) {
          particlesRef.current[i] = spawnParticle();
        }
      });

      // ── Central Nebula Glow ─────────────────────────────────────────
      const pulse = Math.sin(tick * 0.02) * 0.5 + 0.5;
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.45;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
      grd.addColorStop(0, `rgba(245, 158, 11, ${0.035 * pulse})`);
      grd.addColorStop(0.45, `rgba(139, 92, 246, ${0.02 * pulse})`);
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