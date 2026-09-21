import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Tv, Radio, Sparkles, Terminal, Shield, Wifi, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

export type CyberTheme = 'gold' | 'matrix' | 'synthwave';

interface Props {
  onToggleTerminal: () => void;
  terminalOpen: boolean;
}

export const CyberHUDFrame: React.FC<Props> = ({ onToggleTerminal, terminalOpen }) => {
  const [theme, setTheme] = useState<CyberTheme>('gold');
  const [crtActive, setCrtActive] = useState<boolean>(false);
  const [droneActive, setDroneActive] = useState<boolean>(false);
  const [sfxMuted, setSfxMuted] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [epoch, setEpoch] = useState(49102);
  const [latency, setLatency] = useState(14);
  const eqCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync theme to document body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'gold') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Sync CRT class
  useEffect(() => {
    if (crtActive) {
      document.body.classList.add('crt-screen-active');
    } else {
      document.body.classList.remove('crt-screen-active');
    }
    return () => {
      document.body.classList.remove('crt-screen-active');
    };
  }, [crtActive]);

  // Mouse reticle tracking
  useEffect(() => {
    let animFrame: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Check if hovering clickable element
      const target = e.target as HTMLElement;
      if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.cursor-pointer'))) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const updateSmoothPos = () => {
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      animFrame = requestAnimationFrame(updateSmoothPos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrame = requestAnimationFrame(updateSmoothPos);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Equalizer canvas animation
  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 7;
      const barWidth = 3;
      const gap = 2;

      for (let i = 0; i < bars; i++) {
        let height = 3;
        if (droneActive) {
          height = 3 + Math.abs(Math.sin(step * 0.15 + i * 0.8)) * 14;
        } else {
          height = 2 + Math.abs(Math.sin(step * 0.05 + i)) * 3;
        }

        ctx.fillStyle = droneActive ? 'rgba(245, 158, 11, 0.9)' : 'rgba(148, 163, 184, 0.3)';
        ctx.fillRect(i * (barWidth + gap), canvas.height - height, barWidth, height);
      }

      frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [droneActive]);

  // Periodic network jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.min(28, Math.max(9, prev + Math.floor(Math.random() * 5) - 2)));
      setEpoch(e => e + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cycleTheme = () => {
    soundFx.playClick();
    if (theme === 'gold') setTheme('matrix');
    else if (theme === 'matrix') setTheme('synthwave');
    else setTheme('gold');
  };

  const toggleDrone = () => {
    soundFx.playClick();
    const state = soundFx.toggleAmbientDrone();
    setDroneActive(state);
  };

  const toggleCrt = () => {
    soundFx.playScan();
    setCrtActive(c => !c);
  };

  const toggleSfx = () => {
    soundFx.playClick();
    const next = !sfxMuted;
    setSfxMuted(next);
    soundFx.setMuted(next);
  };

  return (
    <>
      {/* ── Fixed Tactical Corner Brackets ────────────────────────── */}
      <div className="fixed top-2 left-2 z-50 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono text-slate-500/80">
        <span className="text-auction-gold font-bold">◤</span>
        <span className="hidden sm:inline">MIDNIGHT_PREPROD // EPOCH #{epoch}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cipher-green animate-pulse inline-block" />
      </div>

      <div className="fixed top-2 right-2 z-50 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono text-slate-500/80">
        <span className="hidden sm:inline">LATENCY: {latency}ms</span>
        <Wifi className="w-3 h-3 text-cipher-teal inline-block" />
        <span className="text-cipher-teal font-bold">◥</span>
      </div>

      <div className="fixed bottom-2 left-2 z-50 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono text-slate-500/80">
        <span className="text-vault-purple-light font-bold">◣</span>
        <span className="hidden sm:inline">ZK_SNARK: PLONK_KZG // COMPACT v0.23</span>
      </div>

      <div className="fixed bottom-2 right-2 z-50 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono text-slate-500/80">
        <span className="hidden sm:inline">DUAL-STATE WITNESS ACTIVE</span>
        <span className="text-auction-gold font-bold">◢</span>
      </div>

      {/* ── Top HUD Control Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-midnight-950/80 backdrop-blur-md border-b border-white/5 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-mono">
          {/* Left system telemetry */}
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-auction-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-auction-gold" />
              </span>
              <span className="text-[11px] font-semibold text-slate-300">CLOAKBID PROTOCOL</span>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
              <Zap className="w-3 h-3 text-auction-gold" />
              <span>CONSENSUS: 100% CONFIDENTIAL</span>
            </div>
          </div>

          {/* Right interactive HUD controls */}
          <div className="flex items-center gap-2">
            {/* Terminal Drawer Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleTerminal();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                terminalOpen
                  ? 'bg-auction-gold/20 border-auction-gold text-auction-gold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-auction-gold/40 hover:text-auction-gold'
              }`}
              title="Open Compact ZK Terminal (Ctrl+`)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SHELL</span>
              <span className="text-[9px] px-1 rounded bg-black/40 text-slate-400">`</span>
            </button>

            {/* Equalizer & Ambient Audio Drone */}
            <button
              onClick={toggleDrone}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                droneActive
                  ? 'bg-auction-gold/15 border-auction-gold/50 text-auction-gold'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Cyber Ambient Reactor Drone"
            >
              <canvas ref={eqCanvasRef} width={34} height={14} className="inline-block" />
              <span className="hidden sm:inline">DRONE</span>
            </button>

            {/* CRT Phosphor Scanlines Toggle */}
            <button
              onClick={toggleCrt}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                crtActive
                  ? 'bg-cipher-teal/20 border-cipher-teal text-cipher-teal shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Retro-Futuristic CRT Phosphor Monitor Effect"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CRT</span>
            </button>

            {/* Cyber Theme Selector */}
            <button
              onClick={cycleTheme}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:border-white/30 text-[11px] transition-all"
              title="Cycle Color Palette: Gold -> Matrix -> Synthwave"
            >
              <Sparkles className="w-3 h-3 text-auction-gold" />
              <span className="uppercase">{theme}</span>
            </button>

            {/* SFX Mute */}
            <button
              onClick={toggleSfx}
              className="p-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 text-[11px] transition-colors"
              title={sfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {sfxMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-auction-gold" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Tactical Reticle Cursor Follower (Desktop only) ─────────── */}
      <div
        className="pointer-events-none fixed z-[999] transition-transform duration-75 hidden lg:block"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          left: -16,
          top: -16,
        }}
      >
        <div
          className={`w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center ${
            isHoveringClickable
              ? 'scale-125 border-auction-gold bg-auction-gold/10 shadow-[0_0_14px_rgba(245,158,11,0.6)] rotate-45'
              : 'border-auction-gold/30 bg-transparent'
          }`}
        >
          <div className="w-1 h-1 rounded-full bg-auction-gold" />
        </div>
        {/* Real-time coordinate tag */}
        <span className="absolute top-8 left-8 text-[9px] font-mono text-slate-600 bg-midnight-950/80 px-1 py-0.5 rounded border border-white/5 whitespace-nowrap opacity-60">
          X:{mousePos.x} Y:{mousePos.y}
        </span>
      </div>
    </>
  );
};
