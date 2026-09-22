import React, { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  isProving?: boolean;
  bidPlaced?: boolean;
  myBidAmount?: number | null;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'incoming' | 'outgoing';
}

export const CryptographicVault3D: React.FC<Props> = ({
  isProving = false,
  bidPlaced = false,
  myBidAmount = null,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Cube Vertices (Normalized -1 to 1)
    const cubeSize = 85;
    const vertices: Point3D[] = [
      { x: -cubeSize, y: -cubeSize, z: -cubeSize },
      { x: cubeSize, y: -cubeSize, z: -cubeSize },
      { x: cubeSize, y: cubeSize, z: -cubeSize },
      { x: -cubeSize, y: cubeSize, z: -cubeSize },
      { x: -cubeSize, y: -cubeSize, z: cubeSize },
      { x: cubeSize, y: -cubeSize, z: cubeSize },
      { x: cubeSize, y: cubeSize, z: cubeSize },
      { x: -cubeSize, y: cubeSize, z: cubeSize },
    ];

    // Cube Edges
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back
      [4, 5], [5, 6], [6, 7], [7, 4], // front
      [0, 4], [1, 5], [2, 6], [3, 7], // connectors
    ];

    // Cube Faces for glass shading
    const faces = [
      [0, 1, 2, 3], // back
      [4, 5, 6, 7], // front
      [0, 1, 5, 4], // top
      [2, 3, 7, 6], // bottom
      [0, 3, 7, 4], // left
      [1, 2, 6, 5], // right
    ];

    // Cryptographic symbols for faces
    const symbols = ['λ', '⊕', '⨂', '⟁', '𝒵𝒦', '0x'];

    // Particles array
    const particles: Particle3D[] = [];
    const maxParticles = 60;

    const spawnParticle = () => {
      if (particles.length >= maxParticles) return;
      const isOutgoing = Math.random() > 0.45;

      if (isOutgoing) {
        // Emerging ZK proof particle from the core outwards
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = Math.random() * 1.8 + 0.8;
        particles.push({
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 15,
          z: (Math.random() - 0.5) * 15,
          vx: Math.cos(phi) * Math.cos(theta) * speed,
          vy: Math.sin(phi) * speed,
          vz: Math.cos(phi) * Math.sin(theta) * speed,
          life: 0,
          maxLife: Math.random() * 60 + 50,
          color: Math.random() > 0.4 ? 'rgba(6, 182, 212,' : 'rgba(16, 185, 129,',
          type: 'outgoing',
        });
      } else {
        // Encrypted incoming particle heading into the vault
        const dist = 180 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const startX = dist * Math.cos(phi) * Math.cos(theta);
        const startY = dist * Math.sin(phi);
        const startZ = dist * Math.cos(phi) * Math.sin(theta);
        const speed = 0.015 + Math.random() * 0.01;

        particles.push({
          x: startX,
          y: startY,
          z: startZ,
          vx: -startX * speed,
          vy: -startY * speed,
          vz: -startZ * speed,
          life: 0,
          maxLife: 80,
          color: 'rgba(139, 92, 246,',
          type: 'incoming',
        });
      }
    };

    let angleX = 0.2;
    let angleY = 0;
    let ringAngle1 = 0;
    let ringAngle2 = 0;
    let ringAngle3 = 0;

    // Rotation helper
    const rotatePoint = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      // Rotate around X
      let y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
      let z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);
      // Rotate around Y
      let x2 = p.x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -p.x * Math.sin(ry) + z1 * Math.cos(ry);
      // Rotate around Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
      return { x: x3, y: y3, z: z2 };
    };

    // Project 3D to 2D
    const project = (p: Point3D, w: number, h: number): { x: number; y: number; scale: number } => {
      const fov = 400;
      const distance = 340;
      const scale = fov / (distance + p.z);
      return {
        x: p.x * scale + w / 2,
        y: p.y * scale + h / 2,
        scale,
      };
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect ? rect.width : 400;
      const h = rect ? rect.height : 400;

      ctx.clearRect(0, 0, w, h);

      // Rotation speeds
      const speedMultiplier = isProving ? 2.5 : 1.0;
      angleY += 0.008 * speedMultiplier;
      angleX = 0.25 + mousePos.y * 0.15;
      const targetAngleY = angleY + mousePos.x * 0.2;

      ringAngle1 += 0.015 * speedMultiplier;
      ringAngle2 -= 0.012 * speedMultiplier;
      ringAngle3 += 0.02 * speedMultiplier;

      // Spawn particles periodically
      if (Math.random() > (isProving ? 0.2 : 0.6)) {
        spawnParticle();
      }

      // Draw subtle background radial glow behind vault
      const radialGlow = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 190);
      radialGlow.addColorStop(0, isProving ? 'rgba(124, 58, 237, 0.28)' : 'rgba(139, 92, 246, 0.14)');
      radialGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, w, h);

      // ── 1. Draw Concentric 3D Gyro Rings ──────────────────────
      const draw3DRing = (radius: number, rx: number, ry: number, rz: number, color: string, segments = 48) => {
        ctx.beginPath();
        let firstPt = true;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const pt: Point3D = {
            x: Math.cos(theta) * radius,
            y: Math.sin(theta) * radius,
            z: 0,
          };
          const rotated = rotatePoint(pt, rx, ry, rz);
          const proj = project(rotated, w, h);
          if (firstPt) {
            ctx.moveTo(proj.x, proj.y);
            firstPt = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      };

      draw3DRing(135, angleX + 0.4, targetAngleY + ringAngle1, ringAngle1 * 0.5, 'rgba(139, 92, 246, 0.25)');
      draw3DRing(155, angleX - 0.5, targetAngleY + ringAngle2, ringAngle2 * 0.7, 'rgba(6, 182, 212, 0.22)');
      draw3DRing(120, angleX + 1.2, targetAngleY + ringAngle3, ringAngle3, 'rgba(167, 139, 250, 0.18)');

      // ── 2. Project Cube Vertices ─────────────────────────────
      const projectedVerts = vertices.map(v => {
        const rotated = rotatePoint(v, angleX, targetAngleY, 0);
        return {
          ...project(rotated, w, h),
          z: rotated.z,
          origRotated: rotated,
        };
      });

      // ── 3. Render Faces (Back to Front for glass depth) ─────
      const sortedFaces = faces.map((faceIdxs, i) => {
        const avgZ = faceIdxs.reduce((sum, idx) => sum + projectedVerts[idx].z, 0) / 4;
        return { faceIdxs, avgZ, symbol: symbols[i] };
      }).sort((a, b) => a.avgZ - b.avgZ);

      sortedFaces.forEach(face => {
        const pts = face.faceIdxs.map(idx => projectedVerts[idx]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();

        // Glass translucency based on orientation
        const depthAlpha = ((face.avgZ + cubeSize) / (cubeSize * 2)) * 0.08 + 0.03;
        ctx.fillStyle = isProving
          ? `rgba(139, 92, 246, ${depthAlpha * 1.6})`
          : `rgba(14, 20, 36, ${depthAlpha * 1.2})`;
        ctx.fill();

        ctx.strokeStyle = isProving
          ? 'rgba(167, 139, 250, 0.4)'
          : 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Draw embedded cryptographic symbol on face center
        const centerX = pts.reduce((sum, p) => sum + p.x, 0) / 4;
        const centerY = pts.reduce((sum, p) => sum + p.y, 0) / 4;
        const avgScale = pts.reduce((sum, p) => sum + p.scale, 0) / 4;

        if (face.avgZ > -cubeSize * 0.5) {
          ctx.save();
          ctx.font = `${Math.round(14 * avgScale)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(face.symbol, centerX, centerY);
          ctx.restore();
        }
      });

      // ── 4. Render Edges (Metallic chamfer line) ──────────────
      ctx.lineWidth = 1.4;
      edges.forEach(([i1, i2]) => {
        const p1 = projectedVerts[i1];
        const p2 = projectedVerts[i2];
        const edgeAvgZ = (p1.z + p2.z) / 2;
        const edgeAlpha = ((edgeAvgZ + cubeSize) / (cubeSize * 2)) * 0.4 + 0.2;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isProving
          ? `rgba(192, 132, 252, ${edgeAlpha * 1.5})`
          : `rgba(139, 92, 246, ${edgeAlpha})`;
        ctx.stroke();
      });

      // ── 5. Render Glowing Inner Private Core ─────────────────
      const corePulse = Math.sin(time * 0.003) * 0.15 + 0.85;
      const coreRadius = (isProving ? 32 : 26) * corePulse;

      const coreGradient = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, coreRadius);
      if (isProving) {
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGradient.addColorStop(0.3, 'rgba(34, 211, 238, 0.8)');
        coreGradient.addColorStop(0.7, 'rgba(124, 58, 237, 0.5)');
        coreGradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
      } else {
        coreGradient.addColorStop(0, 'rgba(238, 242, 255, 0.9)');
        coreGradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.7)');
        coreGradient.addColorStop(0.8, 'rgba(124, 58, 237, 0.25)');
        coreGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      }

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // ── 6. Render Particles (Inflow & Outflow) ────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === 'outgoing') {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        } else {
          // Accelerate inward
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        }

        const rotated = rotatePoint(p, angleX, targetAngleY, 0);
        const proj = project(rotated, w, h);

        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        if (p.life >= p.maxLife || (p.type === 'incoming' && Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z) < 15)) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.8, 1.8 * proj.scale), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${alpha * 0.85})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isProving, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-square max-w-[440px] mx-auto flex items-center justify-center select-none ${className}`}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Holographic Cryptographic Bid HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] backdrop-blur-xl bg-midnight-950/80 border border-vault-purple/30 rounded-xl p-3.5 shadow-vault-subtle transition-all duration-300 pointer-events-none">
        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <div className="flex items-center gap-1.5 text-vault-purple-light">
            <Lock className="w-3.5 h-3.5 text-vault-purple animate-pulse" />
            <span className="font-semibold tracking-wide">SEALED BID CORE</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
            ZK ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between bg-midnight-900/90 rounded-lg px-3 py-2 border border-white/5">
          <div className="text-xs font-mono">
            <span className="text-slate-500">BID: </span>
            <span className="text-slate-300 font-semibold tracking-wider">
              {bidPlaced && myBidAmount ? `${myBidAmount.toLocaleString()} tDUST` : '███████████'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-medium tracking-tight flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            PRIVATE
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span>Midnight Dual-State ZK</span>
          <span className="text-slate-500">Halo2 / PLONK</span>
        </div>
      </div>
    </div>
  );
};
