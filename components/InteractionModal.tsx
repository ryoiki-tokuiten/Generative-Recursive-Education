import React, { useState } from 'react';
import { SelectionEvent, PageNode } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">
            {view === 'existing' ? 'Previous Explorations' : 'Deep Dive'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
            <span className="font-bold block mb-1 text-xs uppercase tracking-wide text-blue-500">Selected Context</span>
            <div className="line-clamp-3 italic">"{selection.textSummary}"</div>
          </div>

          {view === 'existing' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">You have already explored this section. Choose a path:</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existingBranches.map(branch => (
                  <div key={branch.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => onNavigateToBranch(branch.id)}
                      className="flex-1 text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm"
                    >
                      <div className="font-medium text-slate-800 truncate">{branch.topic}</div>
                      <div className="text-xs text-slate-500 mt-1">Created: {new Date(branch.timestamp).toLocaleTimeString()}</div>
                    </button>
                    <button 
                        onClick={() => onDeleteBranch(branch.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete this branch"
                    >
                        ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setView('new')}
                  className="w-full py-2.5 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium text-sm"
                >
                  Start New Exploration
                </button>
              </div>
            </div>
          )}

          {view === 'new' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What would you like to know about this?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Explain this diagram in more detail..."
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none text-slate-800"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                {existingBranches.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setView('existing')}
                        className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                    >
                        Back to List
                    </button>
                )}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
