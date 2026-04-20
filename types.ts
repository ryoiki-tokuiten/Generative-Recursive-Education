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
