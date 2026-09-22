import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  isSpecial?: boolean;
}

export const CryptographicBackground: React.FC = () => {
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
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Generate cryptographic nodes
    const nodeCount = Math.floor(Math.min(width, 1920) / 28);
    let nodes: Node[] = [];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 1,
          baseAlpha: Math.random() * 0.4 + 0.15,
          pulsePhase: Math.random() * Math.PI * 2,
          isSpecial: Math.random() > 0.85,
        });
      }
    };

    initNodes();

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep gradient fill
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGradient.addColorStop(0, '#090E1D');
      bgGradient.addColorStop(0.5, '#05070D');
      bgGradient.addColorStop(1, '#020307');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle ZK / lattice watermark lines in background
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.018)';
      ctx.lineWidth = 1;
      const gridSize = 120;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw nodes
      const maxDistance = 140;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = node.isSpecial
              ? `rgba(6, 182, 212, ${alpha * 1.5})`
              : `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Occasional light packet traversing line
            if (node.isSpecial && (i + j) % 3 === 0) {
              const t = (Math.sin(time * 1.2 + i) + 1) / 2;
              const px = node.x + dx * t;
              const py = node.y + dy * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
              ctx.fill();
            }
          }
        }

        // Draw node
        const pulse = Math.sin(time + node.pulsePhase) * 0.15;
        const currentAlpha = Math.max(0.05, node.baseAlpha + pulse);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.isSpecial) {
          ctx.fillStyle = `rgba(34, 211, 238, ${currentAlpha * 1.3})`;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(167, 139, 250, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.25)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
