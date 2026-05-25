import React, { useState } from 'react';
import { SelectionEvent, PageNode } from '../types';
import { Copy, Trash2, Check } from 'lucide-react';

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
  onDeleteBranch
}) => {
  const [prompt, setPrompt] = useState('');
  const [view, setView] = useState<'existing' | 'new'>(existingBranches.length > 0 ? 'existing' : 'new');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#2a2a35] bg-[#121217] text-[#e2e8f0] shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a35] bg-[#1a1a24] p-5">
          <h3 className="font-semibold text-[#e2e8f0]">
            {view === 'existing' ? 'Previous Explorations' : 'Deep Dive'}
          </h3>
          <button onClick={onClose} className="text-[#94a3b8] transition-colors hover:text-[#e2e8f0]">x</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          <div className="mb-6 rounded-xl border border-[#00e599]/20 bg-[#00e599]/5 p-4 text-sm text-[#cbd5e1]">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e599]">
              {selection.componentId}
            </span>
            <div className="line-clamp-3 italic">"{selection.textSummary}"</div>
          </div>

          {view === 'existing' && (
            <div className="space-y-4">
              <p className="text-sm text-[#94a3b8]">This component already has branches. Choose a generation or create another.</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existingBranches.map(branch => (
                  <div key={branch.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => onNavigateToBranch(branch.id)}
                      className="flex-1 min-w-0 rounded-xl border border-[#2a2a35] bg-[#1a1a24] p-3 text-left text-sm transition-all hover:border-[#00e599]/40 hover:bg-[#00e599]/5"
                    >
                      <div className="truncate font-medium text-[#e2e8f0]">{branch.topic}</div>
                      <div className="mt-1 font-mono text-[11px] text-[#94a3b8]">{branch.id.toUpperCase()} / {new Date(branch.timestamp).toLocaleTimeString()}</div>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={(e) => handleCopy(e, branch.topic, branch.id)}
                        className="rounded-full p-2 text-[#64748b] transition-colors hover:bg-[#00e599]/10 hover:text-[#00e599]"
                        title="Copy Prompt"
                      >
                        {copiedId === branch.id ? <Check size={14} className="text-[#00e599]" /> : <Copy size={14} />}
                      </button>
                      <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteBranch(branch.id); }}
                          className="rounded-full p-2 text-[#64748b] transition-colors hover:bg-[#ff3366]/10 hover:text-[#ff3366]"
                          title="Delete this branch"
                      >
                          <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#2a2a35] pt-4">
                <button 
                  onClick={() => setView('new')}
                  className="w-full rounded-lg border border-[#00e599]/25 bg-[#00e599]/10 px-4 py-2.5 text-sm font-medium text-[#00e599] transition-colors hover:bg-[#00e599]/20"
                >
                  Start New Exploration
                </button>
              </div>
            </div>
          )}

          {view === 'new' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#cbd5e1]">
                  What would you like to know about this?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Explain this diagram in more detail..."
                  className="min-h-[100px] w-full resize-none rounded-lg border border-[#2a2a35] bg-[#1a1a24] p-3 text-[#e2e8f0] outline-none placeholder:text-[#64748b] focus:border-[#00e599]/60 focus:ring-1 focus:ring-[#00e599]/30"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                {existingBranches.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setView('existing')}
                        className="flex-1 rounded-lg border border-[#2a2a35] bg-[#1a1a24] px-4 py-2.5 text-sm font-medium text-[#cbd5e1] transition-colors hover:border-[#3f3f4e]"
                    >
                        Back to List
                    </button>
                )}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="flex-1 rounded-lg bg-[#00e599] px-4 py-2.5 text-sm font-medium text-[#0a0a0c] transition-colors hover:bg-[#4dffc1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Generate Content
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
