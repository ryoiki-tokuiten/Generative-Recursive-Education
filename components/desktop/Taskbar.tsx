import React, { useEffect, useRef, useState } from 'react';
import { WindowState, AppSession } from '../../types';
import { APP_REGISTRY } from '../../desktop/apps/index';

interface TaskbarProps {
  windows: WindowState[];
  sessions: Record<string, AppSession>;
  onAppOpen: (appId: string) => void;
  onWindowRaise: (windowId: string) => void;
  onWindowMinimize: (windowId: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows, sessions, onAppOpen, onWindowRaise, onWindowMinimize, onExport, onImport,
}) => {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [showApps, setShowApps] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(formatTime(now));
      setDate(formatDate(now));
    }, 1000);
    return () => clearInterval(t);
  }, []);


  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-12 flex items-center gap-1 px-3 z-[9000] select-none"
      style={{
        background: 'rgba(10,14,26,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Left: OS Logo + App Launcher ──────────────────────────────── */}
      <button
        onClick={() => setShowApps(v => !v)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${showApps ? 'bg-[#388bfd]' : 'bg-[#161b22] hover:bg-[#21262d]'}`}
        title="App Launcher"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-[#30363d] mx-1 flex-shrink-0" />

      {/* ── App Dock Icons ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {APP_REGISTRY.map(app => {
          const hasWindow = windows.some(w => w.appId === app.id);
          return (
            <button
              key={app.id}
              onClick={() => onAppOpen(app.id)}
              title={app.name}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#21262d] transition-all group"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: app.accentColor + '22', border: `1px solid ${app.accentColor}33` }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={app.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={app.iconPath} />
                  {app.iconPath2 && <path d={app.iconPath2} />}
                </svg>
              </div>
              {/* Active indicator dot */}
              {hasWindow && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#388bfd]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-[#30363d] mx-1 flex-shrink-0" />

      {/* ── Open / Minimized Windows ────────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto min-w-0">
        {windows.map(win => {
          const app = APP_REGISTRY.find(a => a.id === win.appId);
          const session = sessions[win.windowId];
          const currentNode = session ? session.nodeMap[session.currentNodeId] : null;
          const label = currentNode?.topic ?? win.title;
          return (
            <button
              key={win.windowId}
              onClick={() => win.minimized ? onWindowRaise(win.windowId) : onWindowMinimize(win.windowId)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex-shrink-0 max-w-[160px] ${
                win.minimized
                  ? 'bg-[#1c2128] text-[#636e7b] hover:text-[#c9d1d9] border border-[#30363d]'
                  : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#2d333b] border border-[#30363d]'
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={app?.accentColor ?? '#636e7b'} strokeWidth="2.5" strokeLinecap="round">
                <path d={app?.iconPath || 'M3 12h18'} />
              </svg>
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-[#30363d] mx-1 flex-shrink-0" />

      {/* ── System Tray ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Import / Export */}
        <button
          onClick={onExport}
          className="p-1.5 rounded-md hover:bg-[#21262d] text-[#636e7b] hover:text-[#c9d1d9] transition-colors"
          title="Export all sessions"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button
          onClick={onImport}
          className="p-1.5 rounded-md hover:bg-[#21262d] text-[#636e7b] hover:text-[#c9d1d9] transition-colors"
          title="Import session"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </button>

        {/* Network indicator */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636e7b" strokeWidth="2" strokeLinecap="round">
          <path d="M1.42 9a16 16 0 0 1 21.16 0M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
        </svg>

        {/* Volume indicator */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#636e7b" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>

        <div className="w-px h-4 bg-[#30363d]" />

        {/* Clock */}
        <div className="text-right">
          <div className="text-[#c9d1d9] text-[11px] font-semibold font-mono leading-tight">{time}</div>
          <div className="text-[#636e7b] text-[10px] leading-tight">{date}</div>
        </div>
      </div>

      {/* ── App Launcher Popup ─────────────────────────────────────────── */}
      {showApps && (
        <>
          <div className="fixed inset-0 z-[8999]" onClick={() => setShowApps(false)} />
          <div
            className="fixed bottom-14 left-3 z-[9001] p-3 rounded-xl border border-[#30363d] shadow-2xl"
            style={{ background: 'rgba(22,27,34,0.96)', backdropFilter: 'blur(24px)', width: 320 }}
          >
            <div className="text-[10px] text-[#484f58] uppercase tracking-widest mb-2 px-1 font-mono">Applications</div>
            <div className="grid grid-cols-3 gap-1.5">
              {APP_REGISTRY.map(app => (
                <button
                  key={app.id}
                  onClick={() => { onAppOpen(app.id); setShowApps(false); }}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg hover:bg-[#21262d] transition-all group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ background: app.accentColor + '33', border: `1px solid ${app.accentColor}44` }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={app.accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={app.iconPath} />
                      {app.iconPath2 && <path d={app.iconPath2} />}
                    </svg>
                  </div>
                  <span className="text-[11px] text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(d: Date) {
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
