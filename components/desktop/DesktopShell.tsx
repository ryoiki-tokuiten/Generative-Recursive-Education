import React, { useEffect, useRef } from 'react';
import { APP_REGISTRY } from '../../desktop/apps/index';
import { WindowState, AppSession } from '../../types';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppMode, SelectionEvent } from '../../types';

interface DesktopShellProps {
  windows: WindowState[];
  sessions: Record<string, AppSession>;
  onAppOpen: (appId: string) => void;
  onWindowRaise: (windowId: string) => void;
  onWindowMinimize: (windowId: string) => void;
  onClose: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onMove: (windowId: string, x: number, y: number) => void;
  onResize: (windowId: string, w: number, h: number) => void;
  onSetMode: (windowId: string, mode: AppMode) => void;
  onElementSelect: (windowId: string, sel: SelectionEvent) => void;
  onLearnTopicSubmit: (windowId: string, topic: string) => void;
  onInteractionSubmit: (windowId: string, prompt: string) => void;
  onDismissInteraction: (windowId: string) => void;
  onBack: (windowId: string) => void;
  onNavigateToBranch: (windowId: string, nodeId: string) => void;
  onDeleteBranch: (windowId: string, nodeId: string) => void;
  onExport: () => void;
  onImport: () => void;
  onResetSession: (windowId: string, appId: string) => void;
}

export const DesktopShell: React.FC<DesktopShellProps> = (props) => {
  const {
    windows, sessions, onAppOpen, onWindowRaise, onWindowMinimize,
    onClose, onMaximize, onMove, onResize, onSetMode, onElementSelect,
    onLearnTopicSubmit, onInteractionSubmit, onDismissInteraction,
    onBack, onNavigateToBranch, onDeleteBranch, onExport, onImport, onResetSession,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // ── Animated wallpaper ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Aurora orbs
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * 1200,
      y: Math.random() * 900,
      r: 300 + Math.random() * 200,
      hue: [220, 260, 200, 240, 210][i],
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 1200,
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.6 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
    }));

    let t = 0;
    const draw = () => {
      t += 0.003;
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, W, H);

      // Aurora orbs
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;

        const hShift = Math.sin(t * 0.5 + orb.hue) * 15;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue + hShift}, 70%, 40%, 0.07)`);
        grad.addColorStop(0.5, `hsla(${orb.hue + hShift}, 60%, 30%, 0.04)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      // Stars
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed;
        const flicker = s.a * (0.7 + 0.3 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 240, ${flicker})`;
        ctx.fill();
      });

      // Subtle horizontal scan line gradient
      const scanGrad = ctx.createLinearGradient(0, 0, 0, H);
      scanGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
      scanGrad.addColorStop(0.5, 'transparent');
      scanGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Animated wallpaper */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Desktop area (above taskbar height) */}
      <div className="absolute inset-0 overflow-hidden" style={{ bottom: 48 }}>
        {/* Desktop app icons — left column */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          {APP_REGISTRY.map(app => (
            <DesktopIcon key={app.id} app={app} onOpen={onAppOpen} />
          ))}
        </div>

        {/* Window layer */}
        <WindowManager
          windows={windows}
          sessions={sessions}
          onClose={onClose}
          onMinimize={onWindowMinimize}
          onMaximize={onMaximize}
          onRaise={onWindowRaise}
          onMove={onMove}
          onResize={onResize}
          onSetMode={onSetMode}
          onElementSelect={onElementSelect}
          onLearnTopicSubmit={onLearnTopicSubmit}
          onInteractionSubmit={onInteractionSubmit}
          onDismissInteraction={onDismissInteraction}
          onBack={onBack}
          onNavigateToBranch={onNavigateToBranch}
          onDeleteBranch={onDeleteBranch}
          onExport={onExport}
          onResetSession={onResetSession}
        />
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        sessions={sessions}
        onAppOpen={onAppOpen}
        onWindowRaise={onWindowRaise}
        onWindowMinimize={onWindowMinimize}
        onExport={onExport}
        onImport={onImport}
      />
    </div>
  );
};

// ── Desktop icon component ─────────────────────────────────────────────────
interface AppDef {
  id: string;
  name: string;
  iconPath: string;
  iconPath2?: string;
  accentColor: string;
}

const DesktopIcon: React.FC<{ app: AppDef; onOpen: (id: string) => void }> = ({ app, onOpen }) => {
  return (
    <button
      onClick={(e) => { if (e.detail === 2) onOpen(app.id); }}
      className="flex flex-col items-center gap-1 p-2 rounded-xl group transition-all hover:bg-white/5 w-[72px]"
      title={`Double-click to open ${app.name}`}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${app.accentColor}33, ${app.accentColor}15)`,
          border: `1px solid ${app.accentColor}44`,
          boxShadow: `0 4px 16px ${app.accentColor}20`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={app.accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={app.iconPath} />
          {app.iconPath2 && <path d={app.iconPath2} />}
        </svg>
      </div>
      <span
        className="text-[10px] text-center leading-tight text-white/70 group-hover:text-white/90 transition-colors"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
      >
        {app.name}
      </span>
    </button>
  );
};
