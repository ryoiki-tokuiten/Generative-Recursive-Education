export interface PageNode {
  id: string;
  parentId: string | null;
  topic: string; // The user prompt or topic title
  htmlContent: string; // The generated HTML
  triggerContext?: string; // The HTML snippet of the div that was clicked to spawn this
  childrenIds: string[]; // IDs of pages spawned from this page
  timestamp: number;
}

export interface NodeMap {
  [id: string]: PageNode;
}

export type AppMode = 'browse' | 'interactive';

export interface SelectionEvent {
  htmlSnippet: string;
  textSummary: string;
}

// ── Generative OS Types ────────────────────────────────────────────────────

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  /** SVG <path> d= attribute for the icon */
  iconPath: string;
  /** Second SVG path if the icon uses two paths */
  iconPath2?: string;
  category: 'system' | 'productivity' | 'utility' | 'media';
  /** Accent color hex for window header tint */
  accentColor: string;
}

export interface WindowState {
  windowId: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  isLoading: boolean;
}

export interface AppSession {
  windowId: string;
  appId: string;
  /** Independent node tree for this window instance */
  nodeMap: NodeMap;
  /** Currently viewed node id */
  currentNodeId: string;
  mode: AppMode;
  /** Pending element selection waiting for user prompt */
  pendingSelection: SelectionEvent | null;
}

export interface OSExportData {
  windowStates: WindowState[];
  /** Keyed by windowId */
  sessions: Record<string, AppSession>;
  version: 2;
  timestamp: number;
}
