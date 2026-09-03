import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Cpu, EyeOff, Radio, Key, Fingerprint } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeroVisualProps {
  theme: ThemeMode;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for connected network
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = theme === 'dark' 
      ? ['#818cf8', '#c084fc', '#f472b6', '#38bdf8', '#34d399']
      : ['#4f46e5', '#9333ea', '#db2777', '#0284c7', '#059669'];
    const count = 42;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.2 + 1.2,
        alpha: theme === 'dark' ? Math.random() * 0.5 + 0.4 : Math.random() * 0.4 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle network
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme === 'dark' ? '#818cf8' : '#6366f1';
            ctx.globalAlpha = (1 - dist / 110) * (theme === 'dark' ? 0.25 : 0.35);
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      angle += 0.008;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="relative w-full max-w-full h-[360px] sm:h-[480px] lg:h-[560px] flex items-center justify-center select-none overflow-hidden">
      {/* Background ambient glowing gradient orbs */}
      <div className="absolute w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-pink-500/25 blur-3xl -z-10 animate-pulse" />
      <div className="absolute w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-blue-500/15 blur-2xl -z-10 translate-x-8 sm:translate-x-20 -translate-y-8 sm:-translate-y-12" />

      {/* Interactive particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cyber Rotating Ring Container */}
      <div className="relative w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
        {/* Outer orbital ring 1 */}
        <div className="absolute inset-0 rounded-full border border-dashed border-indigo-400/25 animate-[spin_26s_linear_infinite]" />

        {/* Outer orbital ring 2 */}
        <div className="absolute inset-2 sm:inset-4 rounded-full border border-purple-500/20 animate-[spin_18s_linear_infinite_reverse]">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,1)]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,1)]" />
        </div>

        {/* Middle geometric radar ring */}
        <div className="absolute inset-6 sm:inset-10 rounded-full border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-purple-950/20 backdrop-blur-sm flex items-center justify-center">
          {/* Inner ring */}
          <div className="w-36 h-36 sm:w-52 sm:h-52 lg:w-56 lg:h-56 rounded-full border border-pink-500/30 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/20 via-transparent to-pink-600/20 animate-pulse" />

            {/* Central Holographic Shield Core */}
            <div className="relative z-10 w-22 h-22 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 p-[2px] shadow-[0_0_40px_rgba(129,140,248,0.4)] transform hover:scale-105 transition-transform duration-500">
              <div
                className={`w-full h-full rounded-[14px] flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
                  theme === 'dark' ? 'bg-[#090d18]/90' : 'bg-white/95'
                }`}
              >
                <div className="relative">
                  <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-400 animate-pulse" />
                  <Lock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-pink-400 absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5" />
                </div>
                <span className={`text-[9px] sm:text-[11px] font-mono-code font-bold tracking-wider uppercase ${
                  theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
                }`}>
                  Protected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Futuristic Nodes with Micro-Telemetry */}
        {/* Node 1: Encryption */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg border flex items-center gap-1.5 sm:gap-2 animate-bounce [animation-duration:3.8s] z-20 ${
          theme === 'dark'
            ? 'glass-panel border-indigo-500/40 text-white shadow-indigo-500/10'
            : 'bg-white/95 border-indigo-200 shadow-md shadow-indigo-100 text-slate-800'
        }`}>
          <div className="p-1 sm:p-1.5 rounded-lg bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
            <Key className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] font-mono-code text-indigo-600 dark:text-indigo-300 font-bold leading-tight whitespace-nowrap">
              Cryptographic Transit
            </p>
            <p className="text-[8px] sm:text-[9px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">TLS 1.3 Strict</p>
          </div>
        </div>

        {/* Node 2: User Control */}
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg border flex items-center gap-1.5 sm:gap-2 animate-bounce [animation-duration:4.2s] z-20 ${
          theme === 'dark'
            ? 'glass-panel border-pink-500/40 text-white shadow-pink-500/10'
            : 'bg-white/95 border-pink-200 shadow-md shadow-pink-100 text-slate-800'
        }`}>
          <div className="p-1 sm:p-1.5 rounded-lg bg-pink-500/20 text-pink-500 dark:text-pink-400">
            <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] font-mono-code text-pink-600 dark:text-pink-300 font-bold leading-tight whitespace-nowrap">
              Privacy Mode
            </p>
            <p className="text-[8px] sm:text-[9px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">Restricted Access</p>
          </div>
        </div>

        {/* Node 3: Secure Auth */}
        <div className={`absolute top-1/2 left-0 sm:-left-8 -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg border flex items-center gap-1.5 sm:gap-2 z-20 ${
          theme === 'dark'
            ? 'glass-panel border-purple-500/40 text-white shadow-purple-500/10'
            : 'bg-white/95 border-purple-200 shadow-md shadow-purple-100 text-slate-800'
        }`}>
          <div className="p-1 sm:p-1.5 rounded-lg bg-purple-500/20 text-purple-500 dark:text-purple-400">
            <Fingerprint className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-mono-code text-purple-600 dark:text-purple-300 font-bold leading-tight">
              Zero Plaintext
            </p>
            <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Salted Hashing</p>
          </div>
        </div>

        {/* Node 4: Communication Node */}
        <div className={`absolute top-1/2 right-0 sm:-right-8 -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg border flex items-center gap-1.5 sm:gap-2 z-20 ${
          theme === 'dark'
            ? 'glass-panel border-cyan-500/40 text-white shadow-cyan-500/10'
            : 'bg-white/95 border-cyan-200 shadow-md shadow-cyan-100 text-slate-800'
        }`}>
          <div className="p-1 sm:p-1.5 rounded-lg bg-cyan-500/20 text-cyan-500 dark:text-cyan-400">
            <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-mono-code text-cyan-600 dark:text-cyan-300 font-bold leading-tight">
              Active Shield
            </p>
            <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">24/7 Monitored</p>
          </div>
        </div>
      </div>
    </div>
  );
};
