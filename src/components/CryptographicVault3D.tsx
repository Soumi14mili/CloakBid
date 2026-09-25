import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

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
  size: number;
}

export const CryptographicVault3D: React.FC<Props> = ({
  isProving = false,
  bidPlaced = false,
  myBidAmount = null,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Geometry: Chamfered Precision Cube Vertices
    const size = 76;
    const inset = 16;
    const s = size;
    const i = size - inset;

    // 24 vertices of a chamfered/beveled geometric vault
    const vertices: Point3D[] = [
      // Top cap (Y = -s)
      { x: -i, y: -s, z: -i }, { x: i, y: -s, z: -i }, { x: i, y: -s, z: i }, { x: -i, y: -s, z: i },
      // Bottom cap (Y = s)
      { x: -i, y: s, z: -i }, { x: i, y: s, z: -i }, { x: i, y: s, z: i }, { x: -i, y: s, z: i },
      // Middle upper perimeter (Y = -i)
      { x: -s, y: -i, z: -i }, { x: -s, y: -i, z: i },
      { x: s, y: -i, z: -i }, { x: s, y: -i, z: i },
      { x: -i, y: -i, z: -s }, { x: i, y: -i, z: -s },
      { x: -i, y: -i, z: s }, { x: i, y: -i, z: s },
      // Middle lower perimeter (Y = i)
      { x: -s, y: i, z: -i }, { x: -s, y: i, z: i },
      { x: s, y: i, z: -i }, { x: s, y: i, z: i },
      { x: -i, y: i, z: -s }, { x: i, y: i, z: -s },
      { x: -i, y: i, z: s }, { x: i, y: i, z: s },
    ];

    // Primary structural wire edges of the vault
    const edges: [number, number][] = [
      // Top ring
      [0, 1], [1, 2], [2, 3], [3, 0],
      // Bottom ring
      [4, 5], [5, 6], [6, 7], [7, 4],
      // Chamfer connects to caps
      [0, 12], [1, 13], [2, 15], [3, 14],
      [0, 8], [3, 9], [1, 10], [2, 11],
      [4, 20], [5, 21], [6, 23], [7, 22],
      [4, 16], [7, 17], [5, 18], [6, 19],
      // Vertical facets
      [8, 16], [9, 17], [10, 18], [11, 19],
      [12, 20], [13, 21], [14, 22], [15, 23],
      // Horizontal mid connects
      [12, 8], [13, 10], [14, 9], [15, 11],
      [20, 16], [21, 18], [22, 17], [23, 19],
    ];

    // Translucent facets (for subtle metallic/glass lighting)
    const facets = [
      { pts: [0, 1, 2, 3], norm: { x: 0, y: -1, z: 0 } },
      { pts: [4, 5, 6, 7], norm: { x: 0, y: 1, z: 0 } },
      { pts: [12, 13, 21, 20], norm: { x: 0, y: 0, z: -1 } },
      { pts: [14, 15, 23, 22], norm: { x: 0, y: 0, z: 1 } },
      { pts: [8, 9, 17, 16], norm: { x: -1, y: 0, z: 0 } },
      { pts: [10, 11, 19, 18], norm: { x: 1, y: 0, z: 0 } },
    ];

    // Restrained encrypted micro-particles
    const particles: Particle3D[] = [];
    const maxParticles = 24;

    const spawnParticle = () => {
      if (particles.length >= maxParticles) return;
      const angle = Math.random() * Math.PI * 2;
      const radius = 110 + Math.random() * 40;
      const height = (Math.random() - 0.5) * 60;
      particles.push({
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius,
        vx: -Math.cos(angle) * 0.35,
        vy: (Math.random() - 0.5) * 0.15,
        vz: -Math.sin(angle) * 0.35,
        life: 0,
        maxLife: Math.random() * 80 + 70,
        size: Math.random() * 1.2 + 0.8,
      });
    };

    let rotX = 0.28;
    let rotY = 0.45;
    let ringRot1 = 0;
    let ringRot2 = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const rotate = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      // Rotate around X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      // Rotate around Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      // Rotate around Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const project = (p: Point3D, w: number, h: number): { x: number; y: number; scale: number } => {
      const fov = 380;
      const distance = 420;
      const scale = fov / (distance + p.z);
      return {
        x: w * 0.5 + p.x * scale,
        y: h * 0.5 + p.y * scale,
        scale,
      };
    };

    let frame = 0;

    const render = () => {
      frame++;
      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect ? rect.width : 400;
      const h = rect ? rect.height : 400;

      ctx.clearRect(0, 0, w, h);

      // Smooth mouse follow
      targetTiltX += (mouseOffset.y * 0.4 - targetTiltX) * 0.05;
      targetTiltY += (mouseOffset.x * 0.5 - targetTiltY) * 0.05;

      // Base rotation rate (restrained, continuous)
      const currentRotX = rotX + targetTiltX;
      const currentRotY = rotY + (frame * 0.005) + targetTiltY;
      ringRot1 += 0.008;
      ringRot2 -= 0.006;

      // Spawn particles gently
      if (frame % 8 === 0) spawnParticle();

      // Soft ambient ground shadow
      const shadowGrad = ctx.createRadialGradient(w * 0.5, h * 0.5 + 110, 10, w * 0.5, h * 0.5 + 110, 130);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5 + 110, 110, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Outer Thin Gyroscopic Ring 1 (Latitude) ─────────────────────────
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      const ring1Radius = 124;
      const ring1Points = 48;
      ctx.beginPath();
      for (let j = 0; j <= ring1Points; j++) {
        const theta = (j / ring1Points) * Math.PI * 2;
        const pt = rotate({ x: Math.cos(theta) * ring1Radius, y: 0, z: Math.sin(theta) * ring1Radius }, currentRotX * 0.4, ringRot1, 0.1);
        const prj = project(pt, w, h);
        if (j === 0) ctx.moveTo(prj.x, prj.y);
        else ctx.lineTo(prj.x, prj.y);
      }
      ctx.stroke();

      // ── Thin Gyroscopic Ring 2 (Orbital Meridian) ────────────────────────
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.16)';
      ctx.beginPath();
      const ring2Radius = 108;
      for (let j = 0; j <= ring1Points; j++) {
        const theta = (j / ring1Points) * Math.PI * 2;
        const pt = rotate({ x: Math.cos(theta) * ring2Radius, y: Math.sin(theta) * ring2Radius, z: 0 }, 0.2, ringRot2, currentRotX * 0.5);
        const prj = project(pt, w, h);
        if (j === 0) ctx.moveTo(prj.x, prj.y);
        else ctx.lineTo(prj.x, prj.y);
      }
      ctx.stroke();
      ctx.restore();

      // ── Transform Vertices ────────────────────────────────────────────────
      const transformed = vertices.map(v => rotate(v, currentRotX, currentRotY, 0));
      const projected = transformed.map(v => project(v, w, h));

      // ── Render Facets (Dark Metallic with Specular Depth) ─────────────────
      facets.forEach(facet => {
        const normRot = rotate({ x: facet.norm.x, y: facet.norm.y, z: facet.norm.z }, currentRotX, currentRotY, 0);
        // Backface culling
        if (normRot.z < 0) {
          ctx.beginPath();
          const p0 = projected[facet.pts[0]];
          ctx.moveTo(p0.x, p0.y);
          for (let k = 1; k < facet.pts.length; k++) {
            const pk = projected[facet.pts[k]];
            ctx.lineTo(pk.x, pk.y);
          }
          ctx.closePath();

          // Lighting factor based on simulated top-left light
          const lightIntensity = Math.max(0.04, -normRot.y * 0.15 - normRot.x * 0.1 + 0.08);
          ctx.fillStyle = `rgba(18, 26, 44, ${lightIntensity + 0.35})`;
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // ── Render Inner Hidden Glowing Core (Concealed Sealed Bid) ───────────
      const centerProj = project({ x: 0, y: 0, z: 0 }, w, h);
      const corePulse = (Math.sin(frame * 0.04) + 1) * 0.5;

      // Soft purple/blue internal glow
      const coreGlow = ctx.createRadialGradient(
        centerProj.x, centerProj.y, 4,
        centerProj.x, centerProj.y, 45 + corePulse * 10
      );
      coreGlow.addColorStop(0, isProving ? 'rgba(6, 182, 212, 0.45)' : 'rgba(124, 58, 237, 0.35)');
      coreGlow.addColorStop(0.6, 'rgba(109, 40, 217, 0.12)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 55, 0, Math.PI * 2);
      ctx.fill();

      // Inner cryptographic core node
      ctx.fillStyle = isProving ? '#22D3EE' : '#A78BFA';
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Concealed Bid Label Floating in Vault Center
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelText = isProving
        ? 'PROVING...'
        : bidPlaced
        ? 'SEALED ✓'
        : 'BID: ••••••••';
      ctx.fillText(labelText, centerProj.x, centerProj.y + 14);

      // ── Render Structural Edges ──────────────────────────────────────────
      ctx.lineWidth = 1;
      edges.forEach(([i1, i2]) => {
        const p1 = projected[i1];
        const p2 = projected[i2];
        const avgZ = (transformed[i1].z + transformed[i2].z) * 0.5;
        const alpha = Math.max(0.08, Math.min(0.4, (1 - avgZ / 250) * 0.28));

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // ── Update and Draw Micro Encrypted Particles ────────────────────────
      for (let idx = particles.length - 1; idx >= 0; idx--) {
        const p = particles[idx];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(idx, 1);
          continue;
        }

        const pt = rotate({ x: p.x, y: p.y, z: p.z }, currentRotX, currentRotY, 0);
        const prj = project(pt, w, h);
        const pAlpha = (1 - p.life / p.maxLife) * 0.3;

        ctx.fillStyle = `rgba(147, 83, 211, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(prj.x, prj.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isProving, bidPlaced, mouseOffset]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Hardware Telemetry Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-midnight-950/80 border border-white/[0.08] backdrop-blur-md flex items-center gap-2 text-[10.5px] font-mono text-slate-300">
        <Lock className="w-3 h-3 text-vault-purple-light" />
        <span className="tracking-wide">CLOAK VAULT</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-emerald-400 font-semibold">ENCLAVE SECURED</span>
      </div>
    </div>
  );
};
