import React, { useRef, useCallback } from 'react';
import { OSExportData } from './types';
import { DesktopShell } from './components/desktop/DesktopShell';
import { useOSState } from './state/useOSState';

const App: React.FC = () => {
  const {
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
  } = useOSState();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Import handler ────────────────────────────────────────────────────
  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as OSExportData;
        if (confirm('Importing will replace your current state. Continue?')) {
          handleImport(data);
        }
      } catch (err) {
        alert('Failed to import: ' + (err as Error).message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  }, [handleImport]);

  // ── Reset session: recreate from initial HTML ─────────────────────────
  const handleResetSession = useCallback((windowId: string, appId: string) => {
    if (!confirm('Reset this app to its initial state? All branches will be lost.')) return;
    // Close and re-open is the simplest full-reset approach
    closeApp(windowId);
    // Small delay so the window unmounts before re-opening
    requestAnimationFrame(() => openApp(appId));
  }, [closeApp, openApp]);

  return (
    <>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".json"
      />

      <DesktopShell
        windows={windows}
        sessions={sessions}
        onAppOpen={openApp}
        onWindowRaise={raiseWindow}
        onWindowMinimize={minimizeApp}
        onClose={closeApp}
        onMaximize={maximizeApp}
        onMove={moveWindow}
        onResize={resizeWindow}
        onSetMode={setWindowMode}
        onElementSelect={handleElementSelect}
        onLearnTopicSubmit={handleLearnTopicSubmit}
        onInteractionSubmit={handleInteractionSubmit}
        onDismissInteraction={dismissInteraction}
        onBack={handleBack}
        onNavigateToBranch={navigateToBranch}
        onDeleteBranch={handleDeleteBranch}
        onExport={handleExport}
        onImport={triggerImport}
        onResetSession={handleResetSession}
      />
    </>
  );
};

export default App;
