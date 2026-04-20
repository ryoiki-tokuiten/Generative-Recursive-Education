import React from 'react';
import { AppMode } from '../types';
import { ArrowLeft, Spline, MousePointer2, Trash2, Download, Upload } from 'lucide-react';

interface FloatingControlsProps {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  canGoBack: boolean;
  onBack: () => void;
  title: string;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  mode,
  setMode,
  canGoBack,
  onBack,
  title,
  onReset,
  onExport,
  onImport
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-2xl rounded-full px-6 py-3 border border-slate-200 z-50 flex items-center gap-4 transition-all hover:scale-105">

      {canGoBack && (
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="border-l border-slate-300 h-6 mx-1"></div>

      <div className="font-semibold text-slate-800 text-sm max-w-[200px] truncate">
        {title}
      </div>

      <div className="border-l border-slate-300 h-6 mx-1"></div>

      <div className="flex bg-slate-100 rounded-full p-1">
        <button
          onClick={() => setMode('browse')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'browse'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <MousePointer2 size={14} />
          Browse
        </button>
        <button
          onClick={() => setMode('interactive')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'interactive'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <Spline size={14} />
          Interact
        </button>
      </div>

      <div className="border-l border-slate-300 h-6 mx-1"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={onExport}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Export Session"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onImport}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Import Session"
        >
          <Upload size={18} />
        </button>
      </div>

      <div className="border-l border-slate-300 h-6 mx-1"></div>

      <button
        onClick={onReset}
        className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
        title="Start Over"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
};
