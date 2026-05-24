import React, { useState, useEffect } from 'react';
import { getRuns, deleteRun, DbRun } from '../services/dbService';
import { Trash2, Search, Calendar, GitBranch, ArrowLeft, Plus, Database, Loader } from 'lucide-react';

interface DatabaseViewProps {
  currentRunId: string | null;
  onSelectRun: (runId: string) => void;
  onClose: () => void;
  onStartNewSession: () => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  currentRunId,
  onSelectRun,
  onClose,
  onStartNewSession
}) => {
  const [runs, setRuns] = useState<DbRun[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load runs on mount
  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRuns = await getRuns();
      setRuns(fetchedRuns);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch runs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, runId: string, title: string) => {
    e.stopPropagation(); // Avoid selecting the run when clicking delete
    if (!confirm(`Are you sure you want to delete "${title}" and all its saved pages?`)) {
      return;
    }

    try {
      await deleteRun(runId);
      // Remove from list
      setRuns(prev => prev.filter(r => r.id !== runId));
    } catch (err: any) {
      alert(`Failed to delete run: ${err.message}`);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Filter runs based on search query
  const filteredRuns = runs.filter(run =>
    run.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] p-6 text-[#e2e8f0]">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_10%,rgba(0,229,153,0.06),transparent_40%)]" />

      <div className="relative mx-auto w-full space-y-8 px-4 sm:px-8">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#2a2a35] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00e599]/30 bg-[#00e599]/10 text-[#00e599]">
                <Database size={20} />
              </div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em]">Saved Sessions</h1>
            </div>
            <p className="text-sm text-[#94a3b8]">Browse and continue your generated recursive education journeys</p>
          </div>

          <div className="flex items-center gap-3">
            {currentRunId && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 rounded-full border border-[#2a2a35] bg-[#121217]/80 px-4 py-2 text-sm font-medium text-[#94a3b8] backdrop-blur-md transition-colors hover:border-[#00e599]/40 hover:text-[#00e599]"
              >
                <ArrowLeft size={15} />
                Back to Session
              </button>
            )}
            <button
              onClick={onStartNewSession}
              className="flex items-center gap-2 rounded-full bg-[#00e599] px-4 py-2 text-sm font-medium text-[#0a0a0c] transition-all hover:bg-[#4dffc1]"
            >
              <Plus size={15} />
              New Session
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#64748b]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic prompt..."
            className="w-full rounded-full border border-[#2a2a35] bg-[#121217] py-3.5 pl-11 pr-5 text-sm text-[#e2e8f0] outline-none placeholder:text-[#64748b] focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/30"
          />
        </div>

        {/* Runs List Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#94a3b8] gap-3">
            <Loader className="animate-spin text-[#00e599]" size={36} />
            <p className="text-sm font-medium">Loading sessions from database...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-[#ff3366]">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={loadRuns}
              className="mt-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs hover:bg-red-500/20"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2a2a35] bg-[#121217]/20 py-16 text-center text-[#94a3b8]">
            <p className="text-base font-medium">
              {searchQuery ? `No sessions matching "${searchQuery}"` : 'No saved sessions found'}
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              {searchQuery ? 'Try searching for something else' : 'Start by generating a new session above!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredRuns.map((run) => {
              const isActive = run.id === currentRunId;
              return (
                <div
                  key={run.id}
                  onClick={() => onSelectRun(run.id)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border bg-[#121217]/80 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${
                    isActive
                      ? 'border-[#00e599] shadow-[0_0_15px_rgba(0,229,153,0.15)]'
                      : 'border-[#2a2a35] hover:border-[#00e599]/40'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Title (Prompt) */}
                    <div className="space-y-1">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-[#e2e8f0] group-hover:text-white">
                        {run.title}
                      </h3>
                      {isActive && (
                        <span className="inline-block rounded-full bg-[#00e599]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#00e599] uppercase">
                          Active Session
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                      <div className="flex items-center gap-1.5">
                        <GitBranch size={13} className="text-[#00e599]" />
                        <span>
                          {run.node_count} {run.node_count === 1 ? 'topic' : 'topics'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>{formatDate(run.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Delete */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#2a2a35]/60 pt-3">
                    <span className="text-[11px] font-medium text-[#64748b] group-hover:text-[#94a3b8]">
                      Click to load session
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, run.id, run.title)}
                      className="rounded-full p-2 text-[#64748b] hover:bg-[#ff3366]/10 hover:text-[#ff3366] transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
