import React from 'react';
import { AppWindow } from './AppWindow';
import { WindowState, AppSession, AppMode, SelectionEvent } from '../../types';

interface WindowManagerProps {
  windows: WindowState[];
  sessions: Record<string, AppSession>;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onRaise: (windowId: string) => void;
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
  onResetSession: (windowId: string, appId: string) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  sessions,
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
  return (
    <div className="absolute inset-0 overflow-hidden">
      {windows.map(win => {
        const session = sessions[win.windowId];
        if (!session) return null;
        return (
          <AppWindow
            key={win.windowId}
            windowState={win}
            session={session}
            onClose={() => onClose(win.windowId)}
            onMinimize={() => onMinimize(win.windowId)}
            onMaximize={() => onMaximize(win.windowId)}
            onRaise={() => onRaise(win.windowId)}
            onMove={(x, y) => onMove(win.windowId, x, y)}
            onResize={(w, h) => onResize(win.windowId, w, h)}
            onSetMode={(mode) => onSetMode(win.windowId, mode)}
            onElementSelect={(sel) => onElementSelect(win.windowId, sel)}
            onLearnTopicSubmit={(topic) => onLearnTopicSubmit(win.windowId, topic)}
            onInteractionSubmit={(prompt) => onInteractionSubmit(win.windowId, prompt)}
            onDismissInteraction={() => onDismissInteraction(win.windowId)}
            onBack={() => onBack(win.windowId)}
            onNavigateToBranch={(nodeId) => onNavigateToBranch(win.windowId, nodeId)}
            onDeleteBranch={(nodeId) => onDeleteBranch(win.windowId, nodeId)}
            onExport={onExport}
            onResetSession={() => onResetSession(win.windowId, win.appId)}
          />
        );
      })}
    </div>
  );
};
