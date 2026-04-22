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

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Static wallpaper */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/wallpaper.jpg')` }}
      />

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
