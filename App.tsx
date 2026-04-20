import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PageNode, NodeMap, AppMode, SelectionEvent } from './types';
import { generateInitialLesson, generateFollowUpLesson } from './services/geminiService';
import { GenerativeCanvas } from './components/GenerativeCanvas';
import { FloatingControls } from './components/FloatingControls';
import { InteractionModal } from './components/InteractionModal';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [nodeMap, setNodeMap] = useState<NodeMap>({});
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('browse');
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
      const html = await generateInitialLesson(initialTopic);
      const newId = uuidv4();
      const newNode: PageNode = {
        id: newId,
        parentId: null,
        topic: initialTopic,
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
      const newId = uuidv4();
      const newNode: PageNode = {
        id: newId,
        parentId: currentNode.id,
        topic: prompt,
        htmlContent: newHtml,
        triggerContext: selection.htmlSnippet, // Store for similarity check later
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
  };

  const handleDeleteBranch = (nodeId: string) => {
    if (!currentNodeId) return;

    setNodeMap(prev => {
      const updated = { ...prev };

      // Remove from parent's children list
      const nodeToDelete = updated[nodeId];
      if (nodeToDelete && nodeToDelete.parentId && updated[nodeToDelete.parentId]) {
        const parent = updated[nodeToDelete.parentId];
        updated[parent.id] = {
          ...parent,
          childrenIds: parent.childrenIds.filter(id => id !== nodeId)
        };
      }

      // Note: Ideally we should recursively delete children of the deleted node,
      // but for this PoC, leaving orphaned nodes in memory is acceptable as they become unreachable.
      // A simple recursive cleanup could be added here.

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


  // Helper to find existing branches for a specific selection
  const getExistingBranchesForSelection = useCallback(() => {
    if (!currentNode || !pendingSelection) return [];

    // Simple heuristic: If the stored triggerContext is very similar to the current selection
    // In a real app, use IDs or fuzzy matching. Here we do exact or substring match.
    // Since generated HTML is static unless re-generated, strict equality might work if selection logic is consistent.
    // We'll use a loose includes check or exact match.

    return currentNode.childrenIds
      .map(id => nodeMap[id])
      .filter(child => child.triggerContext === pendingSelection.htmlSnippet);
  }, [currentNode, pendingSelection, nodeMap]);

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
        {fileInput}

        <div className="absolute top-4 right-4">
          <button
            onClick={handleImport}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm"
          >
            <span className="underline">Import Session</span>
          </button>
        </div>

        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">GenLearn</h1>
            <p className="text-slate-500 text-lg">
              Recursive, generative learning powered by Gemini. <br />
              Enter a topic to generate a personalized interactive lesson.
            </p>
          </div>

          <form onSubmit={handleInitialSubmit} className="relative">
            <input
              type="text"
              value={initialTopic}
              onChange={(e) => setInitialTopic(e.target.value)}
              placeholder="e.g. Quantum Entanglement, French Revolution, React Hooks..."
              className="w-full p-4 pl-6 pr-14 rounded-full shadow-lg border-2 border-transparent focus:border-indigo-500 outline-none text-lg transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !initialTopic.trim()}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : '→'}
            </button>
          </form>

          <div className="text-xs text-slate-400">
            Powered by Google Gemini 3 Flash Preview
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {fileInput}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <h2 className="text-xl font-medium text-slate-700 animate-pulse">Generative AI is creating your lesson...</h2>
          <p className="text-slate-500 mt-2">Designing layout, writing content, and styling elements.</p>
        </div>
      )}

      {/* Main Content Area */}
      <GenerativeCanvas
        htmlContent={currentNode.htmlContent}
        mode={mode}
        onElementSelect={handleElementSelect}
      />

      {/* Controls */}
      <FloatingControls
        mode={mode}
        setMode={setMode}
        canGoBack={!!currentNode.parentId}
        onBack={handleBack}
        title={currentNode.topic}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Interactive Modal */}
      {pendingSelection && (
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
