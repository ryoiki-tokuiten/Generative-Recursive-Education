import React, { useState } from 'react';
import { SelectionEvent, PageNode } from '../types';
import { X, GitBranch, Plus, Trash2 } from 'lucide-react';

interface InteractionModalProps {
  selection: SelectionEvent;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  existingBranches: PageNode[];
  onNavigateToBranch: (nodeId: string) => void;
  onDeleteBranch: (nodeId: string) => void;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  selection,
  onClose,
  onSubmit,
  existingBranches,
  onNavigateToBranch,
  onDeleteBranch,
}) => {
  const [prompt, setPrompt] = useState('');
  const [view, setView] = useState<'existing' | 'new'>(
    existingBranches.length > 0 ? 'existing' : 'new'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md flex flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <GitBranch size={15} className="text-[#388bfd]" />
            <h3 className="text-[#e6edf3] font-semibold text-sm">
              {view === 'existing' ? 'Existing Branches' : 'Branch from Selection'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#636e7b] hover:text-[#c9d1d9] hover:bg-[#21262d] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Selected context snippet */}
        <div className="mx-5 mt-4 mb-3 p-3 rounded-lg border border-[#21262d] bg-[#0d1117]">
          <span className="text-[10px] uppercase tracking-widest text-[#388bfd] font-mono block mb-1.5">
            Selected Context
          </span>
          <p className="text-[#8b949e] text-xs italic line-clamp-3 leading-relaxed">
            "{selection.textSummary || 'No text content'}"
          </p>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 overflow-y-auto flex-1">

          {/* ── Existing branches view ── */}
          {view === 'existing' && (
            <div className="flex flex-col gap-3">
              <p className="text-[#8b949e] text-xs">
                You've already explored this section. Continue an existing branch or create a new one:
              </p>

              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {existingBranches.map(branch => (
                  <div key={branch.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => onNavigateToBranch(branch.id)}
                      className="flex-1 text-left p-3 rounded-lg border border-[#21262d] hover:border-[#388bfd] hover:bg-[#1f2a3a] transition-all"
                    >
                      <div className="text-[#c9d1d9] text-xs font-medium truncate">{branch.topic}</div>
                      <div className="text-[#636e7b] text-[10px] mt-0.5 font-mono">
                        {new Date(branch.timestamp).toLocaleTimeString()}
                        {branch.childrenIds.length > 0 && ` · ${branch.childrenIds.length} branch${branch.childrenIds.length !== 1 ? 'es' : ''}`}
                      </div>
                    </button>
                    <button
                      onClick={() => onDeleteBranch(branch.id)}
                      className="p-2 rounded-md text-[#484f58] hover:text-[#f47067] hover:bg-[#1c1a1a] transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete branch"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setView('new')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#30363d] text-[#636e7b] hover:border-[#388bfd] hover:text-[#388bfd] hover:bg-[#1f2a3a] transition-all text-xs font-medium mt-1"
              >
                <Plus size={13} />
                New Exploration
              </button>
            </div>
          )}

          {/* ── New prompt view ── */}
          {view === 'new' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[#8b949e] text-xs mb-2">
                  What should the AI generate next from this element?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Show a detailed settings panel… / Expand this into a full screen…"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg text-[#c9d1d9] text-sm resize-none min-h-[100px] outline-none transition-all"
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#388bfd'; e.target.style.boxShadow = '0 0 0 3px rgba(56,139,253,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#30363d'; e.target.style.boxShadow = 'none'; }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e as any); }}
                />
                <div className="text-[10px] text-[#484f58] mt-1.5 text-right">⌘↵ to submit</div>
              </div>

              <div className="flex gap-2.5">
                {existingBranches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView('existing')}
                    className="flex-1 py-2.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-[#c9d1d9] transition-colors border border-[#30363d] hover:border-[#484f58]"
                  >
                    ← Back to branches
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#1f6feb' }}
                  onMouseEnter={(e) => { if (prompt.trim()) (e.target as HTMLElement).style.background = '#388bfd'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#1f6feb'; }}
                >
                  Generate Branch
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
