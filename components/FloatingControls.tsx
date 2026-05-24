import React from 'react';
import { AppMode } from '../types';
import { ArrowLeft, GitBranch, Spline, MousePointer2, Trash2, Database } from 'lucide-react';

interface FloatingControlsProps {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  workspaceView: 'lesson' | 'graph' | 'db';
  onToggleGraph: () => void;
  canGoBack: boolean;
  onBack: () => void;
  title: string;
  onReset: () => void;
  onOpenDatabase: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  mode,
  setMode,
  workspaceView,
  onToggleGraph,
  canGoBack,
  onBack,
  title,
  onReset,
  onOpenDatabase
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 overflow-x-auto rounded-full border border-[#2a2a35] bg-[#121217]/90 px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl">

      {canGoBack && (
        <button
          onClick={onBack}
          className="rounded-full p-2 text-[#94a3b8] transition-colors hover:bg-[#1a1a24] hover:text-[#e2e8f0]"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {canGoBack && <div className="mx-1 h-6 border-l border-[#2a2a35]" />}

      <div className="max-w-[170px] truncate px-1 text-sm font-medium text-[#e2e8f0]">
        {title}
      </div>

      <div className="mx-1 h-6 border-l border-[#2a2a35]" />

      <div className="flex rounded-full bg-[#1a1a24] p-1">
        <button
          onClick={() => setMode('browse')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'browse'
            && workspaceView === 'lesson'
            ? 'bg-[#00e599]/15 text-[#00e599]'
            : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
        >
          <MousePointer2 size={14} />
          Browse
        </button>
        <button
          onClick={() => setMode('interactive')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'interactive'
            && workspaceView === 'lesson'
            ? 'bg-[#00e599]/15 text-[#00e599]'
            : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
        >
          <Spline size={14} />
          Interact
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleGraph}
        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors ${
          workspaceView === 'graph'
            ? 'bg-[#00e599]/15 text-[#00e599]'
            : 'text-[#94a3b8] hover:bg-[#1a1a24] hover:text-[#e2e8f0]'
        }`}
        title="Graph View"
      >
        <GitBranch size={15} />
        Graph View
      </button>

      <button
        type="button"
        onClick={onOpenDatabase}
        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors ${
          workspaceView === 'db'
            ? 'bg-[#00e599]/15 text-[#00e599]'
            : 'text-[#94a3b8] hover:bg-[#1a1a24] hover:text-[#e2e8f0]'
        }`}
        title="Database Sessions"
      >
        <Database size={15} />
        Database
      </button>

      <div className="mx-1 h-6 border-l border-[#2a2a35]" />

      <button
        onClick={onReset}
        className="rounded-full p-2 text-[#ff3366]/70 transition-colors hover:bg-[#ff3366]/10 hover:text-[#ff3366]"
        title="Start Over"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
};
