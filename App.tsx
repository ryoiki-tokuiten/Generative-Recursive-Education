import React, { useState, useCallback } from 'react';
import { PageNode, NodeMap, AppMode, SelectionEvent } from './types';
import { generateInitialLesson, generateFollowUpLesson } from './services/geminiService';
import { GenerativeCanvas } from './components/GenerativeCanvas';
import { FloatingControls } from './components/FloatingControls';
import { InteractionModal } from './components/InteractionModal';
import { GenerationOverlay } from './components/GenerationOverlay';
import { GraphView } from './components/GraphView';
import { ArrowRight, Upload } from 'lucide-react';
import {
  collectBranchIds,
  createGenerationId,
  isBranchForSelection
} from './utils/sessionGraph';

const App: React.FC = () => {
  // --- State ---
  const [nodeMap, setNodeMap] = useState<NodeMap>({});
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('browse');
  const [workspaceView, setWorkspaceView] = useState<'lesson' | 'graph'>('lesson');
  const [isLoading, setIsLoading] = useState(false);
  const [initialTopic, setInitialTopic] = useState('');

  // Interaction State
  const [pendingSelection, setPendingSelection] = useState<SelectionEvent | null>(null);

  // Computed
  const currentNode = currentNodeId ? nodeMap[currentNodeId] : null;

  // --- Handlers ---

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialTopic.trim()) return;

    setIsLoading(true);
    try {
      const topic = initialTopic.trim();
      const html = await generateInitialLesson(topic);
      const newId = createGenerationId({});
      const newNode: PageNode = {
        id: newId,
        parentId: null,
        topic,
        htmlContent: html,
        childrenIds: [],
        timestamp: Date.now()
      };

      setNodeMap({ [newId]: newNode });
      setCurrentNodeId(newId);
    } catch (err) {
      alert("Failed to generate lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementSelect = (selection: SelectionEvent) => {
    setPendingSelection(selection);
  };

  const handleInteractionSubmit = async (prompt: string) => {
    if (!currentNode || !pendingSelection) return;

    setIsLoading(true);
    // Close modal immediately to show loader on main screen
    const selection = pendingSelection;
    setPendingSelection(null);
    setMode('browse'); // Reset mode while loading

    try {
      const newHtml = await generateFollowUpLesson(currentNode.topic, selection.htmlSnippet, prompt);
      const newId = createGenerationId(nodeMap);
      const newNode: PageNode = {
        id: newId,
        parentId: currentNode.id,
        topic: prompt,
        htmlContent: newHtml,
        triggerContext: selection.htmlSnippet,
        triggerSummary: selection.textSummary,
        parentComponentId: selection.componentId,
        childrenIds: [],
        timestamp: Date.now()
      };

      // Update State
      setNodeMap(prev => {
        const parent = prev[currentNode.id];
        return {
          ...prev,
          [currentNode.id]: {
            ...parent,
            childrenIds: [...parent.childrenIds, newId]
          },
          [newId]: newNode
        };
      });
      setCurrentNodeId(newId);

    } catch (err) {
      alert("Failed to generate follow-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToBranch = (nodeId: string) => {
    setCurrentNodeId(nodeId);
    setPendingSelection(null);
    setMode('browse');
    setWorkspaceView('lesson');
  };

  const handleDeleteBranch = (nodeId: string) => {
    if (!currentNodeId) return;

    setNodeMap(prev => {
      const updated = { ...prev };
      const nodeToDelete = updated[nodeId];
      if (nodeToDelete && nodeToDelete.parentId && updated[nodeToDelete.parentId]) {
        const parent = updated[nodeToDelete.parentId];
        updated[parent.id] = {
          ...parent,
          childrenIds: parent.childrenIds.filter(id => id !== nodeId)
        };
      }

      collectBranchIds(prev, nodeId).forEach(id => {
        delete updated[id];
      });

      return updated;
    });
  };

  const handleBack = () => {
    if (currentNode?.parentId) {
      setCurrentNodeId(currentNode.parentId);
      setMode('browse');
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to start over? All generated content will be lost.")) {
      setNodeMap({});
      setCurrentNodeId(null);
      setInitialTopic('');
      setMode('browse');
      setWorkspaceView('lesson');
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!currentNodeId && Object.keys(nodeMap).length === 0) return;

    const data = {
      nodeMap,
      currentNodeId,
      initialTopic,
      version: 1,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genlearn-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation
        if (!data.nodeMap || typeof data.nodeMap !== 'object') {
          throw new Error("Invalid export file: missing nodeMap");
        }

        if (confirm("Importing will overwrite your current session. Continue?")) {
          setNodeMap(data.nodeMap);
          setCurrentNodeId(data.currentNodeId || null);
          setInitialTopic(data.initialTopic || '');
          setMode('browse');
          setWorkspaceView('lesson');
        }
      } catch (err) {
        alert("Failed to import file: " + (err as Error).message);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };


  const getExistingBranchesForSelection = useCallback(() => {
    if (!currentNode || !pendingSelection) return [];

    return currentNode.childrenIds
      .map(id => nodeMap[id])
      .filter((child): child is PageNode => !!child && isBranchForSelection(child, pendingSelection));
  }, [currentNode, pendingSelection, nodeMap]);

  const handleLessonMode = (nextMode: AppMode) => {
    setMode(nextMode);
    setWorkspaceView('lesson');
  };

  const handleToggleGraph = () => {
    setPendingSelection(null);
    setWorkspaceView(view => view === 'graph' ? 'lesson' : 'graph');
  };

  // --- Render ---

  // Single persistent file input - lives outside conditional branches
  // to avoid unmounting during view transitions
  const fileInput = (
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileChange}
      className="hidden"
      accept=".json"
    />
  );

  // Guard: if no session OR if currentNode doesn't exist in map, show landing page
  if (!currentNodeId || !currentNode) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] p-4 text-[#e2e8f0]">
        {fileInput}
        {isLoading && <GenerationOverlay title="Generating your first lesson" />}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,229,153,0.08),transparent_38%)]" />
        <div className="absolute right-6 top-6">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 rounded-full border border-[#2a2a35] bg-[#121217]/80 px-4 py-2.5 text-xs font-medium text-[#94a3b8] backdrop-blur-md transition-colors hover:border-[#00e599]/40 hover:text-[#00e599]"
          >
            <Upload size={14} />
            Import Session
          </button>
        </div>

        <div className="relative w-full max-w-xl space-y-10 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-[-0.05em] text-[#e2e8f0] sm:text-6xl">
              GenLearn
            </h1>
          </div>

          <form onSubmit={handleInitialSubmit} className="relative rounded-full border border-[#2a2a35] bg-[#121217] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.38)] focus-within:border-[#00e599]/50">
            <input
              type="text"
              value={initialTopic}
              onChange={(e) => setInitialTopic(e.target.value)}
              placeholder="e.g. Quantum Entanglement, French Revolution, React Hooks..."
              className="w-full rounded-full bg-transparent py-3.5 pl-5 pr-16 text-base text-[#e2e8f0] outline-none placeholder:text-[#64748b]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#00e599] text-[#0a0a0c] transition-all hover:bg-[#4dffc1] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isLoading || !initialTopic.trim()}
            >
              <ArrowRight size={19} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e8f0] font-sans">
      {fileInput}

      {isLoading && <GenerationOverlay title="Generating recursive lesson" />}

      {workspaceView === 'graph' ? (
        <GraphView
          nodeMap={nodeMap}
          currentNodeId={currentNode.id}
          onOpenGeneration={navigateToBranch}
        />
      ) : (
        <GenerativeCanvas
          htmlContent={currentNode.htmlContent}
          mode={mode}
          onElementSelect={handleElementSelect}
        />
      )}

      <FloatingControls
        mode={mode}
        setMode={handleLessonMode}
        workspaceView={workspaceView}
        onToggleGraph={handleToggleGraph}
        canGoBack={!!currentNode.parentId}
        onBack={handleBack}
        title={currentNode.topic}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
      />

      {workspaceView === 'lesson' && pendingSelection && (
        <InteractionModal
          selection={pendingSelection}
          onClose={() => setPendingSelection(null)}
          onSubmit={handleInteractionSubmit}
          existingBranches={getExistingBranchesForSelection()}
          onNavigateToBranch={navigateToBranch}
          onDeleteBranch={handleDeleteBranch}
        />
      )}
    </div>
  );
};

export default App;
