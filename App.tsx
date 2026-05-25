import React, { useState, useCallback } from 'react';
import { PageNode, NodeMap, AppMode, SelectionEvent } from './types';
import { generateInitialLesson, generateFollowUpLesson } from './services/geminiService';
import { GenerativeCanvas } from './components/GenerativeCanvas';
import { FloatingControls } from './components/FloatingControls';
import { InteractionModal } from './components/InteractionModal';
import { GenerationOverlay } from './components/GenerationOverlay';
import { GraphView } from './components/GraphView';
import { DatabaseView } from './components/DatabaseView';
import { getRun, syncRun } from './services/dbService';
import { ArrowRight, Database } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  collectBranchIds,
  createGenerationId,
  isBranchForSelection
} from './utils/sessionGraph';

const App: React.FC = () => {
  // --- State ---
  const [nodeMap, setNodeMap] = useState<NodeMap>({});
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('browse');
  const [workspaceView, setWorkspaceView] = useState<'lesson' | 'graph' | 'db'>('lesson');
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

      const initialMap = { [newId]: newNode };
      const runId = uuidv4();

      // Save initial run and node to Database
      await syncRun(runId, topic, newId, newId, initialMap);

      setNodeMap(initialMap);
      setCurrentNodeId(newId);
      setActiveRunId(runId);
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

      const parent = nodeMap[currentNode.id];
      const updatedNodeMap = {
        ...nodeMap,
        [currentNode.id]: {
          ...parent,
          childrenIds: [...parent.childrenIds, newId]
        },
        [newId]: newNode
      };

      // Sync follow-up to DB if we have an active run
      if (activeRunId) {
        const rootId = Object.keys(updatedNodeMap).find(id => !updatedNodeMap[id].parentId) || null;
        await syncRun(activeRunId, initialTopic, rootId, newId, updatedNodeMap);
      }

      setNodeMap(updatedNodeMap);
      setCurrentNodeId(newId);
    } catch (err) {
      alert("Failed to generate follow-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToBranch = async (nodeId: string) => {
    setCurrentNodeId(nodeId);
    setPendingSelection(null);
    setMode('browse');
    setWorkspaceView('lesson');

    // Sync path navigation to DB
    if (activeRunId) {
      try {
        const rootId = Object.keys(nodeMap).find(id => !nodeMap[id].parentId) || null;
        await syncRun(activeRunId, initialTopic, rootId, nodeId, nodeMap);
      } catch (err) {
        console.error("Failed to sync navigation in DB:", err);
      }
    }
  };

  const handleDeleteBranch = async (nodeId: string) => {
    if (!currentNodeId) return;

    const updated = { ...nodeMap };
    const nodeToDelete = updated[nodeId];
    if (nodeToDelete && nodeToDelete.parentId && updated[nodeToDelete.parentId]) {
      const parent = updated[nodeToDelete.parentId];
      updated[parent.id] = {
        ...parent,
        childrenIds: parent.childrenIds.filter(id => id !== nodeId)
      };
    }

    const deletedIds = collectBranchIds(nodeMap, nodeId);
    deletedIds.forEach(id => {
      delete updated[id];
    });

    let nextNodeId = currentNodeId;
    if (currentNodeId && deletedIds.has(currentNodeId)) {
      nextNodeId = nodeToDelete?.parentId || Object.keys(updated)[0] || null;
    }

    setNodeMap(updated);
    setCurrentNodeId(nextNodeId);

    // Sync branch deletion to DB
    if (activeRunId && nextNodeId) {
      try {
        const rootId = Object.keys(updated).find(id => !updated[id].parentId) || null;
        await syncRun(activeRunId, initialTopic, rootId, nextNodeId, updated);
      } catch (err) {
        console.error("Failed to sync deletion to DB:", err);
      }
    }
  };

  const handleBack = () => {
    if (currentNode?.parentId) {
      navigateToBranch(currentNode.parentId);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to start over? Current session state in memory will be cleared.")) {
      setNodeMap({});
      setCurrentNodeId(null);
      setInitialTopic('');
      setActiveRunId(null);
      setMode('browse');
      setWorkspaceView('lesson');
    }
  };

  const handleSelectRun = async (runId: string) => {
    setIsLoading(true);
    try {
      const data = await getRun(runId);
      setNodeMap(data.nodeMap);
      setCurrentNodeId(data.currentNodeId);
      setInitialTopic(data.title);
      setActiveRunId(data.id);
      setWorkspaceView('lesson');
      setMode('browse');
    } catch (err: any) {
      alert("Failed to load run: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setNodeMap({});
    setCurrentNodeId(null);
    setInitialTopic('');
    setActiveRunId(null);
    setMode('browse');
    setWorkspaceView('lesson');
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

  const handleOpenDatabase = () => {
    setPendingSelection(null);
    setWorkspaceView('db');
  };

  // --- Render ---

  // Render Database View
  if (workspaceView === 'db') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-[#e2e8f0] font-sans">
        <DatabaseView
          currentRunId={activeRunId}
          onSelectRun={handleSelectRun}
          onClose={() => setWorkspaceView('lesson')}
          onStartNewSession={handleStartNewSession}
        />
      </div>
    );
  }

  // Guard: if no session OR if currentNode doesn't exist in map, show landing page
  if (!currentNodeId || !currentNode) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] p-4 text-[#e2e8f0]">
        {isLoading && <GenerationOverlay title="Generating your first lesson" />}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,229,153,0.08),transparent_38%)]" />
        
        {/* Top Right Navigation */}
        <div className="absolute right-6 top-6 flex items-center gap-3">
          <button
            onClick={handleOpenDatabase}
            className="flex items-center gap-2 rounded-full border border-[#2a2a35] bg-[#121217]/80 px-4 py-2.5 text-xs font-medium text-[#94a3b8] backdrop-blur-md transition-colors hover:border-[#00e599]/40 hover:text-[#00e599]"
          >
            <Database size={14} />
            Database
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
        onOpenDatabase={handleOpenDatabase}
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
