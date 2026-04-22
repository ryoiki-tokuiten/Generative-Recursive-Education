import React, { useRef, useState, useMemo, useCallback } from 'react';
import { WindowState, AppSession, AppMode, SelectionEvent, PageNode } from '../../types';
import { getAppById } from '../../desktop/apps/index';
import { AppCanvas } from './AppCanvas';
import { WindowControls } from './WindowControls';
import { InteractionModal } from '../InteractionModal';

const MIN_W = 480;
const MIN_H = 340;
const TASKBAR_H = 48;

interface AppWindowProps {
  windowState: WindowState;
  session: AppSession;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRaise: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  onSetMode: (mode: AppMode) => void;
  onElementSelect: (sel: SelectionEvent) => void;
  onLearnTopicSubmit: (topic: string) => void;
  onInteractionSubmit: (prompt: string) => void;
  onDismissInteraction: () => void;
  onBack: () => void;
  onNavigateToBranch: (nodeId: string) => void;
  onDeleteBranch: (nodeId: string) => void;
  onExport: () => void;
  onResetSession: () => void;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  windowState,
  session,
  onClose,
  onMinimize,
  onMaximize,
  onRaise,
  onMove,
  onResize,
  onSetMode,
  onElementSelect,
  onLearnTopicSubmit,
  onInteractionSubmit,
  onDismissInteraction,
  onBack,
  onNavigateToBranch,
  onDeleteBranch,
  onExport,
  onResetSession,
}) => {
  const { windowId, x, y, width, height, minimized, maximized, zIndex, isLoading } = windowState;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const app = getAppById(windowState.appId);
  const currentNode = session.nodeMap[session.currentNodeId];
  const canGoBack = !!(currentNode?.parentId);

  // Existing branches for the pending selection
  const existingBranches = useMemo((): PageNode[] => {
    if (!session.pendingSelection || !currentNode) return [];
    return currentNode.childrenIds
      .map(id => session.nodeMap[id])
      .filter((n): n is PageNode => !!n && n.triggerContext === session.pendingSelection!.htmlSnippet);
  }, [session, currentNode]);

  // ── Dragging ──────────────────────────────────────────────────────────────
  const handleTitleBarDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.win-btn')) return; // don't drag on buttons
    if (maximized) return;
    e.preventDefault();
    onRaise();

    const startX = e.clientX - x;
    const startY = e.clientY - y;
    setIsDragging(true);

    const onMov = (ev: MouseEvent) => {
      const nx = Math.max(0, ev.clientX - startX);
      const ny = Math.max(0, Math.min(ev.clientY - startY, window.innerHeight - TASKBAR_H - 40));
      onMove(nx, ny);
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMov);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMov);
    document.addEventListener('mouseup', onUp);
  }, [x, y, maximized, onRaise, onMove]);

  // ── Resizing ──────────────────────────────────────────────────────────────
  const handleResizeDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    onRaise();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = width;
    const startH = height;
    setIsResizing(true);

    const onMov = (ev: MouseEvent) => {
      onResize(
        Math.max(MIN_W, startW + (ev.clientX - startX)),
        Math.max(MIN_H, startH + (ev.clientY - startY))
      );
    };
    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMov);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMov);
    document.addEventListener('mouseup', onUp);
  }, [maximized, width, height, onRaise, onResize]);

  if (minimized) return null;

  // Window geometry
  const style: React.CSSProperties = maximized
    ? { position: 'absolute', inset: 0, zIndex }
    : { position: 'absolute', left: x, top: y, width, height, zIndex };

  const accentColor = app?.accentColor ?? '#388bfd';

  return (
    <>
      <div
        style={style}
        className="flex flex-col overflow-hidden shadow-2xl rounded-lg border border-[#30363d]"
        onMouseDown={onRaise}
      >
        {/* Drag blocker — sits over the iframe during drag/resize to prevent event capture */}
        {(isDragging || isResizing) && (
          <div className="absolute inset-0 z-50 cursor-auto" style={{ cursor: isDragging ? 'grabbing' : 'nwse-resize' }} />
        )}

        {/* ── Title Bar ── */}
        <div
          className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-b border-[#21262d] flex-shrink-0 select-none"
          style={{ cursor: maximized ? 'default' : 'grab' }}
          onMouseDown={handleTitleBarDown}
          onDoubleClick={onMaximize}
        >
          {/* Traffic-light buttons */}
          <div className="flex items-center gap-1.5 win-btn cursor-default">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3 h-3 rounded-full bg-[#f47067] hover:brightness-110 transition-all border border-black/10 flex-shrink-0 cursor-default"
              title="Close"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-3 h-3 rounded-full bg-[#e3b341] hover:brightness-110 transition-all border border-black/10 flex-shrink-0 cursor-default"
              title="Minimize"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-3 h-3 rounded-full bg-[#57ab5a] hover:brightness-110 transition-all border border-black/10 flex-shrink-0 cursor-default"
              title="Maximize"
            />
          </div>

          {/* App icon + title */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={app?.iconPath || 'M3 12h18'} />
              {app?.iconPath2 && <path d={app.iconPath2} />}
            </svg>
            <span className="text-[#8b949e] text-xs font-medium truncate">{windowState.title}</span>
          </div>

          {/* Loading spinner */}
          {isLoading && (
            <div className="w-3 h-3 border border-[#30363d] border-t-[#388bfd] rounded-full animate-spin flex-shrink-0" />
          )}
        </div>

        {/* ── App Content ── */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          {currentNode && (
            <AppCanvas
              htmlContent={currentNode.htmlContent}
              mode={session.mode}
              onElementSelect={onElementSelect}
              onLearnTopicSubmit={onLearnTopicSubmit}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* ── Window Controls Bar at bottom ── */}
        <WindowControls
          mode={session.mode}
          setMode={onSetMode}
          canGoBack={canGoBack}
          onBack={onBack}
          title={currentNode?.topic ?? windowState.title}
          onReset={onResetSession}
          onExport={onExport}
        />

        {/* ── Resize Handle ── */}
        {!maximized && (
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-10"
            onMouseDown={handleResizeDown}
            style={{
              background: 'linear-gradient(135deg, transparent 60%, #30363d 60%)',
              borderBottomRightRadius: '6px',
            }}
          />
        )}
      </div>

      {/* ── Interaction Modal (global, fixed overlay) ── */}
      {session.pendingSelection && (
        <InteractionModal
          selection={session.pendingSelection}
          onClose={onDismissInteraction}
          onSubmit={onInteractionSubmit}
          existingBranches={existingBranches}
          onNavigateToBranch={onNavigateToBranch}
          onDeleteBranch={onDeleteBranch}
        />
      )}
    </>
  );
};
