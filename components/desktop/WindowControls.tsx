import React from 'react';
import { AppMode } from '../../types';
import { ArrowLeft, MousePointer2, Spline, Download, Trash2 } from 'lucide-react';

interface WindowControlsProps {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  canGoBack: boolean;
  onBack: () => void;
  title: string;
  onReset: () => void;
  onExport: () => void;
}

export const WindowControls: React.FC<WindowControlsProps> = ({
  mode, setMode, canGoBack, onBack, title, onReset, onExport,
}) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117]/95 backdrop-blur-md border-t border-[#21262d] flex-shrink-0 select-none">

      {canGoBack && (
        <button
          onClick={onBack}
          className="p-1.5 rounded-md hover:bg-[#21262d] text-[#636e7b] hover:text-[#c9d1d9] transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={15} />
        </button>
      )}

      <div className="text-[#8b949e] text-xs font-mono truncate max-w-[160px]" title={title}>
        {title}
      </div>

      <div className="flex-1" />

      {/* Browse / Interact toggle */}
      <div className="flex bg-[#161b22] rounded-full p-[3px] border border-[#21262d]">
        <button
          onClick={() => setMode('browse')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
            mode === 'browse'
              ? 'bg-[#21262d] text-[#c9d1d9] shadow-sm'
              : 'text-[#636e7b] hover:text-[#8b949e]'
          }`}
        >
          <MousePointer2 size={11} />
          Browse
        </button>
        <button
          onClick={() => setMode('interactive')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
            mode === 'interactive'
              ? 'bg-[#388bfd] text-white shadow-sm'
              : 'text-[#636e7b] hover:text-[#8b949e]'
          }`}
          title="Click elements to branch into AI-generated follow-ups"
        >
          <Spline size={11} />
          Interact
        </button>
      </div>

      <div className="w-px h-4 bg-[#30363d]" />

      <button
        onClick={onExport}
        className="p-1.5 rounded-md hover:bg-[#21262d] text-[#636e7b] hover:text-[#388bfd] transition-colors"
        title="Export this session"
      >
        <Download size={14} />
      </button>

      <button
        onClick={onReset}
        className="p-1.5 rounded-md hover:bg-[#21262d] text-[#636e7b] hover:text-[#f47067] transition-colors"
        title="Reset app to initial state"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
