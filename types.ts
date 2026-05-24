export interface PageNode {
  id: string;
  parentId: string | null;
  topic: string; // The user prompt or topic title
  htmlContent: string; // The generated HTML
  triggerContext?: string; // The HTML snippet of the div that was clicked to spawn this
  triggerSummary?: string; // A short readable description of the clicked component
  parentComponentId?: string; // Stable component ID that owns this recursive branch
  childrenIds: string[]; // IDs of pages spawned from this page
  timestamp: number;
}

export interface NodeMap {
  [id: string]: PageNode;
}

export type AppMode = 'browse' | 'interactive';

export interface SelectionEvent {
  componentId: string;
  htmlSnippet: string;
  textSummary: string;
}
