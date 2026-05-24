import { NodeMap, PageNode, SelectionEvent } from '../types';

const ID_PADDING = 3;

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash).toString(36).padStart(5, '0').slice(0, 5);
};

export const createGenerationId = (nodeMap: NodeMap) => {
  const largestSequence = Object.keys(nodeMap).reduce((largest, id) => {
    const match = /^gen-(\d+)$/.exec(id);
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, Object.keys(nodeMap).length);

  let sequence = largestSequence + 1;
  let candidate = `gen-${String(sequence).padStart(ID_PADDING, '0')}`;

  while (nodeMap[candidate]) {
    sequence += 1;
    candidate = `gen-${String(sequence).padStart(ID_PADDING, '0')}`;
  }

  return candidate;
};

export const getChildComponentId = (node: PageNode) => {
  if (node.parentComponentId) return node.parentComponentId;

  return `cmp-legacy-${hashString(node.triggerContext || node.id)}`;
};

export const getComponentGraphId = (generationId: string, componentId: string) =>
  `component::${generationId}::${componentId}`;

export const isBranchForSelection = (node: PageNode, selection: SelectionEvent) =>
  node.parentComponentId
    ? node.parentComponentId === selection.componentId
    : node.triggerContext === selection.htmlSnippet;

export const getReachableNodes = (nodeMap: NodeMap) => {
  const roots = Object.values(nodeMap)
    .filter(node => !node.parentId || !nodeMap[node.parentId])
    .sort((first, second) => first.timestamp - second.timestamp);
  const reachable: PageNode[] = [];
  const visited = new Set<string>();

  const visit = (node: PageNode) => {
    if (visited.has(node.id)) return;

    visited.add(node.id);
    reachable.push(node);
    node.childrenIds.forEach(childId => {
      const child = nodeMap[childId];
      if (child) visit(child);
    });
  };

  roots.forEach(visit);
  return reachable;
};

export const getGenerationLabels = (nodes: PageNode[]) =>
  new Map(
    nodes.map((node, index) => [
      node.id,
      /^gen-\d+$/.test(node.id)
        ? node.id.toUpperCase()
        : `GEN-${String(index + 1).padStart(ID_PADDING, '0')}`
    ])
  );

export const collectBranchIds = (nodeMap: NodeMap, branchId: string) => {
  const ids = new Set<string>();

  const visit = (nodeId: string) => {
    if (ids.has(nodeId)) return;

    ids.add(nodeId);
    nodeMap[nodeId]?.childrenIds.forEach(visit);
  };

  visit(branchId);
  return ids;
};
