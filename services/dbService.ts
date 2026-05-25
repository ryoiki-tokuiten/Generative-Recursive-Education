import { NodeMap } from '../types';

export interface DbRun {
  id: string;
  title: string;
  root_node_id: string | null;
  current_node_id: string | null;
  created_at: string;
  updated_at: string;
  node_count: number;
}

export interface DetailedDbRun {
  id: string;
  title: string;
  rootNodeId: string | null;
  currentNodeId: string | null;
  createdAt: string;
  updatedAt: string;
  nodeMap: NodeMap;
}

// Fetch all runs from the database
export async function getRuns(): Promise<DbRun[]> {
  const response = await fetch('/api/runs');
  if (!response.ok) {
    throw new Error('Failed to fetch runs');
  }
  return response.json();
}

// Load a specific run and its nodeMap
export async function getRun(runId: string): Promise<DetailedDbRun> {
  const response = await fetch(`/api/runs/${runId}`);
  if (!response.ok) {
    throw new Error(`Failed to load run: ${response.statusText}`);
  }
  return response.json();
}

// Sync the active frontend state to the database
export async function syncRun(
  runId: string,
  title: string,
  rootNodeId: string | null,
  currentNodeId: string | null,
  nodeMap: NodeMap
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/runs/${runId}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      rootNodeId,
      currentNodeId,
      nodeMap,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync run with database');
  }
  return response.json();
}

// Delete a run from the database
export async function deleteRun(runId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/runs/${runId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete run');
  }
  return response.json();
}
