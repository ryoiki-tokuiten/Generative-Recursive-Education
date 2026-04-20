import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  WindowState, AppSession, AppMode, SelectionEvent,
  PageNode, OSExportData
} from '../types';
import { APP_HTML_MAP, getAppById } from '../desktop/apps/index';
import { generateInitialLesson, generateFollowUpLesson } from '../services/geminiService';
import { generateOSFollowUp } from '../services/osAgentService';

const DEFAULT_W = 920;
const DEFAULT_H = 620;
const CASCADE = 30;

export function useOSState() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [sessions, setSessions] = useState<Record<string, AppSession>>({});
  // Use a ref for the z-counter so we never need it in useCallback deps
  // and avoid stale closure issues entirely.
  const zRef = useRef(10);
  const nextZ = () => { zRef.current += 1; return zRef.current; };
  const cascadeRef = useRef(0);

  // Stable refs so async callbacks always have latest values without re-creating
  const sessionsRef = useRef(sessions);
  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);

  // ── Window lifecycle ────────────────────────────────────────────────────

  const openApp = useCallback((appId: string) => {
    const appHtml = APP_HTML_MAP[appId];
    if (!appHtml) return;

    const windowId = uuidv4();
    const app = getAppById(appId);
    const offset = cascadeRef.current * CASCADE;
    cascadeRef.current = (cascadeRef.current + 1) % 12;

    const rootNodeId = uuidv4();
    const rootNode: PageNode = {
      id: rootNodeId,
      parentId: null,
      topic: app?.name || appId,
      htmlContent: appHtml,
      childrenIds: [],
      timestamp: Date.now(),
    };

    const z = nextZ();

    // Flat setState calls — never nest setters inside functional updaters.
    // React StrictMode double-invokes functional updaters in dev to detect
    // side-effects, which caused duplicate window IDs when setWindows/setSessions
    // were nested inside setZCounter's updater callback.
    setWindows(prev => [...prev, {
      windowId, appId,
      title: app?.name || appId,
      x: 80 + offset, y: 50 + offset,
      width: DEFAULT_W, height: DEFAULT_H,
      minimized: false, maximized: false,
      zIndex: z, isLoading: false,
    }]);

    setSessions(prev => ({
      ...prev,
      [windowId]: {
        windowId, appId,
        nodeMap: { [rootNodeId]: rootNode },
        currentNodeId: rootNodeId,
        mode: 'browse' as AppMode,
        pendingSelection: null,
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stable — all mutable state accessed via refs

  const closeApp = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.windowId !== windowId));
    setSessions(prev => {
      const next = { ...prev };
      delete next[windowId];
      return next;
    });
  }, []);

  const minimizeApp = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, minimized: !w.minimized } : w
    ));
  }, []);

  const maximizeApp = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, maximized: !w.maximized } : w
    ));
  }, []);

  const raiseWindow = useCallback((windowId: string) => {
    const newZ = nextZ();
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, zIndex: newZ, minimized: false } : w
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveWindow = useCallback((windowId: string, x: number, y: number) => {
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, x, y } : w
    ));
  }, []);

  const resizeWindow = useCallback((windowId: string, width: number, height: number) => {
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, width, height } : w
    ));
  }, []);

  // ── Session / interaction logic ─────────────────────────────────────────

  const setWindowMode = useCallback((windowId: string, mode: AppMode) => {
    setSessions(prev => prev[windowId] ? {
      ...prev,
      [windowId]: { ...prev[windowId], mode, pendingSelection: null }
    } : prev);
  }, []);

  const handleElementSelect = useCallback((windowId: string, selection: SelectionEvent) => {
    setSessions(prev => prev[windowId] ? {
      ...prev,
      [windowId]: { ...prev[windowId], pendingSelection: selection, mode: 'browse' }
    } : prev);
  }, []);

  const dismissInteraction = useCallback((windowId: string) => {
    setSessions(prev => prev[windowId] ? {
      ...prev,
      [windowId]: { ...prev[windowId], pendingSelection: null }
    } : prev);
  }, []);

  const setLoading = useCallback((windowId: string, loading: boolean) => {
    setWindows(prev => prev.map(w =>
      w.windowId === windowId ? { ...w, isLoading: loading } : w
    ));
  }, []);

  /** Append a new node to a session and navigate to it */
  const commitNode = useCallback((windowId: string, node: PageNode) => {
    setSessions(prev => {
      const session = prev[windowId];
      if (!session) return prev;
      const parent = node.parentId ? session.nodeMap[node.parentId] : null;
      return {
        ...prev,
        [windowId]: {
          ...session,
          nodeMap: {
            ...session.nodeMap,
            ...(parent ? {
              [parent.id]: { ...parent, childrenIds: [...parent.childrenIds, node.id] }
            } : {}),
            [node.id]: node,
          },
          currentNodeId: node.id,
          pendingSelection: null,
          mode: 'browse',
        },
      };
    });
  }, []);

  /** Handles element-select + user prompt for ALL apps */
  const handleInteractionSubmit = useCallback(async (windowId: string, prompt: string) => {
    const session = sessionsRef.current[windowId];
    if (!session?.pendingSelection) return;

    const currentNode = session.nodeMap[session.currentNodeId];
    if (!currentNode) return;

    const { pendingSelection, appId } = session;
    const app = getAppById(appId);

    // Clear modal immediately
    setSessions(prev => prev[windowId] ? {
      ...prev, [windowId]: { ...prev[windowId], pendingSelection: null, mode: 'browse' }
    } : prev);

    setLoading(windowId, true);
    try {
      const newHtml = appId === 'learn'
        ? await generateFollowUpLesson(currentNode.topic, pendingSelection.htmlSnippet, prompt)
        : await generateOSFollowUp(app?.name || appId, currentNode.htmlContent, pendingSelection.htmlSnippet, prompt);

      commitNode(windowId, {
        id: uuidv4(),
        parentId: currentNode.id,
        topic: prompt,
        htmlContent: newHtml,
        triggerContext: pendingSelection.htmlSnippet,
        childrenIds: [],
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Generation failed:', err);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(windowId, false);
    }
  }, [commitNode, setLoading]);

  /** Special handler for the Learn app topic form submission */
  const handleLearnTopicSubmit = useCallback(async (windowId: string, topic: string) => {
    const session = sessionsRef.current[windowId];
    if (!session) return;
    const currentNode = session.nodeMap[session.currentNodeId];
    if (!currentNode) return;

    setLoading(windowId, true);
    try {
      const newHtml = await generateInitialLesson(topic);
      commitNode(windowId, {
        id: uuidv4(),
        parentId: currentNode.id,
        topic,
        htmlContent: newHtml,
        childrenIds: [],
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Learn generation failed:', err);
      // Tell the learn iframe to reset
      // (The AppCanvas postMessage mechanism handles this)
      alert('Failed to generate lesson. Please try again.');
    } finally {
      setLoading(windowId, false);
    }
  }, [commitNode, setLoading]);

  const handleBack = useCallback((windowId: string) => {
    setSessions(prev => {
      const session = prev[windowId];
      if (!session) return prev;
      const current = session.nodeMap[session.currentNodeId];
      if (!current?.parentId) return prev;
      return { ...prev, [windowId]: { ...session, currentNodeId: current.parentId, mode: 'browse', pendingSelection: null } };
    });
  }, []);

  const navigateToBranch = useCallback((windowId: string, nodeId: string) => {
    setSessions(prev => {
      const session = prev[windowId];
      if (!session || !session.nodeMap[nodeId]) return prev;
      return { ...prev, [windowId]: { ...session, currentNodeId: nodeId, mode: 'browse', pendingSelection: null } };
    });
  }, []);

  const handleDeleteBranch = useCallback((windowId: string, nodeId: string) => {
    setSessions(prev => {
      const session = prev[windowId];
      if (!session) return prev;
      const node = session.nodeMap[nodeId];
      if (!node) return prev;
      const updatedMap = { ...session.nodeMap };
      if (node.parentId && updatedMap[node.parentId]) {
        const parent = updatedMap[node.parentId];
        updatedMap[parent.id] = { ...parent, childrenIds: parent.childrenIds.filter(id => id !== nodeId) };
      }
      delete updatedMap[nodeId];
      return { ...prev, [windowId]: { ...session, nodeMap: updatedMap } };
    });
  }, []);

  // ── Import / Export ─────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    const data: OSExportData = {
      windowStates: windows,
      sessions,
      version: 2,
      timestamp: Date.now(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genos-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [windows, sessions]);

  const handleImport = useCallback((data: OSExportData) => {
    if (data.version !== 2 || !data.sessions || !data.windowStates) {
      throw new Error('Invalid session file (expected version 2)');
    }
    setWindows(data.windowStates);
    setSessions(data.sessions);
  }, []);

  return {
    windows,
    sessions,
    openApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    raiseWindow,
    moveWindow,
    resizeWindow,
    setWindowMode,
    handleElementSelect,
    dismissInteraction,
    handleInteractionSubmit,
    handleLearnTopicSubmit,
    handleBack,
    navigateToBranch,
    handleDeleteBranch,
    handleExport,
    handleImport,
  };
}
