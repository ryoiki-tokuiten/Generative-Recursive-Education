import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dagre from '@dagrejs/dagre';
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import { Code2, ExternalLink, Eye, GitBranch, Layers3 } from 'lucide-react';
import { NodeMap, PageNode } from '../types';
import {
  getChildComponentId,
  getComponentGraphId,
  getGenerationLabels
} from '../utils/sessionGraph';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GraphViewProps {
  nodeMap: NodeMap;
  currentNodeId: string;
  onOpenGeneration: (nodeId: string) => void;
}

type DetailKind = 'generation' | 'component';

interface GraphDetail {
  graphNodeId: string;
  kind: DetailKind;
  label: string;
  title: string;
  subtitle: string;
  htmlContent: string;
  generationId?: string;
}

interface FlowData extends Record<string, unknown> {
  kind: DetailKind;
  label: string;
  title: string;
  subtitle: string;
  current?: boolean;
  root?: boolean;
}

type FlowNode = Node<FlowData>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GEN_W = 276;
const GEN_H = 104;
const CMP_W = 264;
const CMP_H = 96;

const getGenerationGraphId = (id: string) => `generation::${id}`;

// ---------------------------------------------------------------------------
// Custom nodes – defined OUTSIDE the component so React never re‑creates them
// ---------------------------------------------------------------------------

const GenerationCard: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => (
  <div
    style={{ width: GEN_W, height: GEN_H }}
    className={[
      'flex flex-col justify-center overflow-hidden rounded-xl border px-4 py-3 shadow-lg transition-colors',
      data.root
        ? 'border-[#00e599]/60 bg-[#121f1d] shadow-[0_0_28px_rgba(0,229,153,0.08)]'
        : selected || data.current
        ? 'border-[#00e599]/60 bg-[#062a25] shadow-[0_0_28px_rgba(0,229,153,0.12)]'
        : 'border-[#2a2a35] bg-[#121217] hover:border-[#3f3f4e]',
    ].join(' ')}
  >
    <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#2a2a35] !border-[#0a0a0c] !border-2" />
    <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#2a2a35] !border-[#0a0a0c] !border-2" />

    <div className="mb-2 flex h-4 shrink-0 items-center justify-between font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-[#00e599]">
      <span className="flex items-center gap-2">
        <Layers3 size={12} />
        {data.label}
      </span>
      {data.root && (
        <span className="rounded bg-[#00e599]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#00e599]">
          ROOT
        </span>
      )}
    </div>
    <div className="h-5 truncate text-sm font-medium leading-5 text-[#e2e8f0]">{data.title}</div>
    <div className="mt-1 h-4 truncate text-xs leading-4 text-[#94a3b8]">{data.subtitle}</div>
  </div>
);

const ComponentCard: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => (
  <div
    style={{ width: CMP_W, height: CMP_H }}
    className={[
      'flex flex-col justify-center overflow-hidden rounded-xl border border-dashed px-4 py-3 transition-colors',
      selected
        ? 'border-[#00e599] bg-[#1a1a24]'
        : 'border-[#3f3f4e] bg-[#121217]/90 hover:border-[#00e599]/50',
    ].join(' ')}
  >
    <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#2a2a35] !border-[#0a0a0c] !border-2" />
    <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#2a2a35] !border-[#0a0a0c] !border-2" />

    <div className="mb-2 flex h-4 shrink-0 items-center gap-2 font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-[#94a3b8]">
      <GitBranch size={12} className="text-[#00e599]" />
      Component
    </div>
    <div className="h-4 truncate font-mono text-xs leading-4 text-[#e2e8f0]">{data.label}</div>
    <div className="mt-1 h-4 truncate text-xs leading-4 text-[#94a3b8]">{data.subtitle}</div>
  </div>
);

// Stable reference – never changes between renders
const NODE_TYPES = { generation: GenerationCard, component: ComponentCard };

// ---------------------------------------------------------------------------
// Dagre layout helper
// ---------------------------------------------------------------------------

function applyDagreLayout(nodes: FlowNode[], edges: Edge[]): FlowNode[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 72, marginx: 40, marginy: 40 });

  for (const n of nodes) {
    const w = n.type === 'component' ? CMP_W : GEN_W;
    const h = n.type === 'component' ? CMP_H : GEN_H;
    g.setNode(n.id, { width: w, height: h });
  }
  for (const e of edges) g.setEdge(e.source, e.target);

  dagre.layout(g);

  return nodes.map(n => {
    const pos = g.node(n.id);
    const w = n.type === 'component' ? CMP_W : GEN_W;
    const h = n.type === 'component' ? CMP_H : GEN_H;
    return {
      ...n,
      // Setting width & height directly tells React Flow the node's dimensions
      // BEFORE DOM measurement, which makes fitView work instantly.
      width: w,
      height: h,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
    };
  });
}

// ---------------------------------------------------------------------------
// Graph builder – pure function from NodeMap → { nodes, edges, details }
// ---------------------------------------------------------------------------

function buildGraph(nodeMap: NodeMap, currentNodeId: string) {
  const pages: PageNode[] = Object.values(nodeMap).sort(
    (a, b) => a.timestamp - b.timestamp
  );
  const labels = getGenerationLabels(pages);
  const nodes: FlowNode[] = [];
  const edges: Edge[] = [];
  const details = new Map<string, GraphDetail>();

  // --- Build authoritative parent lookup from parentId ---
  // Fall back to childrenIds only for legacy imports where parentId is missing
  const parentIdFallback = new Map<string, string>();
  for (const p of pages) {
    for (const cid of p.childrenIds) {
      if (nodeMap[cid] && (nodeMap[cid].parentId == null)) {
        parentIdFallback.set(cid, p.id);
      }
    }
  }

  const effectiveParent = (page: PageNode): string | null => {
    if (page.parentId != null && nodeMap[page.parentId]) return page.parentId;
    const fb = parentIdFallback.get(page.id);
    return fb && nodeMap[fb] ? fb : null;
  };

  // Group children by parent
  const childrenOf = new Map<string, PageNode[]>();
  for (const p of pages) {
    const pid = effectiveParent(p);
    if (pid) {
      const arr = childrenOf.get(pid) ?? [];
      arr.push(p);
      childrenOf.set(pid, arr);
    }
  }

  const visited = new Set<string>();

  const walk = (page: PageNode, isRoot: boolean) => {
    if (visited.has(page.id)) return;
    visited.add(page.id);

    const gid = getGenerationGraphId(page.id);
    const lbl = labels.get(page.id) ?? page.id;

    nodes.push({
      id: gid,
      type: 'generation',
      position: { x: 0, y: 0 },
      data: {
        kind: 'generation',
        label: lbl,
        title: page.topic,
        subtitle: isRoot ? 'Original Lesson' : 'Recursive generation',
        current: page.id === currentNodeId,
        root: isRoot,
      },
    });

    details.set(gid, {
      graphNodeId: gid,
      kind: 'generation',
      label: lbl,
      title: page.topic,
      subtitle: isRoot ? 'Original Lesson' : 'Recursive generation',
      htmlContent: page.htmlContent,
      generationId: page.id,
    });

    // Group direct children by component, reconciling legacy nodes
    const kids = (childrenOf.get(page.id) ?? []).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    // Pass 1: collect known component IDs from nodes that have parentComponentId,
    // and index them by triggerContext so legacy siblings can be matched.
    const contextToComponentId = new Map<string, string>();
    for (const kid of kids) {
      if (kid.parentComponentId && kid.triggerContext) {
        contextToComponentId.set(kid.triggerContext, kid.parentComponentId);
      }
    }

    // Pass 2: resolve every child's effective component ID.
    // If parentComponentId is set, use it directly.
    // Otherwise, check if a sibling with the same triggerContext has one.
    // Last resort: fall back to the legacy hash.
    const resolvedCmpId = (kid: PageNode): string => {
      if (kid.parentComponentId) return kid.parentComponentId;
      if (kid.triggerContext && contextToComponentId.has(kid.triggerContext)) {
        return contextToComponentId.get(kid.triggerContext)!;
      }
      return getChildComponentId(kid);
    };

    const groups = new Map<string, PageNode[]>();
    for (const kid of kids) {
      const cmpId = resolvedCmpId(kid);
      const arr = groups.get(cmpId) ?? [];
      arr.push(kid);
      groups.set(cmpId, arr);
    }

    for (const [componentId, children] of groups) {
      const cmpGraphId = getComponentGraphId(page.id, componentId);
      const first = children[0];
      const branchCount = `${children.length} generation${children.length === 1 ? '' : 's'}`;

      nodes.push({
        id: cmpGraphId,
        type: 'component',
        position: { x: 0, y: 0 },
        data: {
          kind: 'component',
          label: componentId,
          title: first.triggerSummary || componentId,
          subtitle: branchCount,
        },
      });

      details.set(cmpGraphId, {
        graphNodeId: cmpGraphId,
        kind: 'component',
        label: componentId,
        title: first.triggerSummary || 'Selected component',
        subtitle: `${branchCount} from ${lbl}`,
        htmlContent:
          first.triggerContext ??
          '<section>Legacy component context unavailable.</section>',
      });

      // Edge: generation → component
      edges.push({
        id: `${gid}→${cmpGraphId}`,
        source: gid,
        target: cmpGraphId,
        type: 'straight',
        style: { stroke: '#00e599', strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#00e599',
          width: 14,
          height: 14,
        },
      });

      // For EACH child generation, recurse, then add edge component → child
      for (const child of children) {
        if (visited.has(child.id)) continue;
        walk(child, false);
        edges.push({
          id: `${cmpGraphId}→${getGenerationGraphId(child.id)}`,
          source: cmpGraphId,
          target: getGenerationGraphId(child.id),
          type: 'straight',
          style: { stroke: '#3f3f4e', strokeWidth: 1.4 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3f3f4e',
            width: 14,
            height: 14,
          },
        });
      }
    }
  };

  // Start from true roots
  const roots = pages
    .filter(p => effectiveParent(p) === null)
    .sort((a, b) => a.timestamp - b.timestamp);
  for (const r of roots) walk(r, true);

  // Catch any orphaned / detached imports
  for (const p of pages) {
    if (!visited.has(p.id)) walk(p, true);
  }

  const laid = applyDagreLayout(nodes, edges);
  return {
    nodes: laid,
    edges,
    details,
    topo: laid.map(n => n.id).sort().join('|'),
  };
}

// ---------------------------------------------------------------------------
// Preview HTML wrapper for component snippets
// ---------------------------------------------------------------------------

const wrapSnippet = (html: string) =>
  `<!DOCTYPE html>
<html class="dark"><head><meta charset="UTF-8"/>
<script src="https://cdn.tailwindcss.com"></script>
<style>body{margin:0;min-height:100vh;padding:32px;background:#0a0a0c;color:#e2e8f0;font-family:Inter,system-ui,sans-serif}</style>
</head><body>${html}</body></html>`;

// ---------------------------------------------------------------------------
// Inner component (needs ReactFlowProvider above it)
// ---------------------------------------------------------------------------

const GraphViewInner: React.FC<GraphViewProps> = ({
  nodeMap,
  currentNodeId,
  onOpenGeneration,
}) => {
  const { fitView } = useReactFlow();

  const graph = useMemo(
    () => buildGraph(nodeMap, currentNodeId),
    [nodeMap, currentNodeId]
  );

  const currentGid = getGenerationGraphId(currentNodeId);
  const [selectedId, setSelectedId] = useState(currentGid);
  const [mode, setMode] = useState<'preview' | 'code'>('preview');

  // Whenever topology changes, refit the entire tree into view
  useEffect(() => {
    // Small delay so React Flow has mounted the new nodes
    const t = setTimeout(() => fitView({ padding: 0.12, duration: 250 }), 80);
    return () => clearTimeout(t);
  }, [graph.topo, fitView]);

  // Track the currently‑active generation
  useEffect(() => setSelectedId(currentGid), [currentGid]);

  // Reset if selected node no longer exists
  useEffect(() => {
    if (!graph.details.has(selectedId)) setSelectedId(currentGid);
  }, [graph.details, selectedId, currentGid]);

  // Reset detail mode when selection changes
  useEffect(() => setMode('preview'), [selectedId]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => setSelectedId(node.id),
    []
  );

  const detail =
    graph.details.get(selectedId) ?? graph.details.get(currentGid);
  if (!detail) return null;

  const previewHtml =
    detail.kind === 'component'
      ? wrapSnippet(detail.htmlContent)
      : detail.htmlContent;

  return (
    <div className="flex h-screen w-full flex-col bg-[#0a0a0c] text-[#e2e8f0] lg:flex-row">
      {/* ---- LEFT: Graph canvas ---- */}
      <section className="flex h-[47vh] flex-col border-b border-[#2a2a35] bg-[#0d0d12] lg:h-full lg:w-[48%] lg:border-b-0 lg:border-r">
        <header className="shrink-0 border-b border-[#2a2a35]/60 px-6 pb-5 pt-6">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#00e599]">
            Recursive Map
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            Generation Graph
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Full session tree — pan &amp; zoom to explore.
          </p>
        </header>

        {/* ReactFlow needs a parent with known width & height */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ReactFlow
              nodes={graph.nodes}
              edges={graph.edges}
              nodeTypes={NODE_TYPES}
              onNodeClick={handleNodeClick}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable
              fitView
              fitViewOptions={{ padding: 0.12 }}
              minZoom={0.04}
              maxZoom={2}
              colorMode="dark"
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1.2}
                color="#2a2a35"
              />
              <Controls showInteractive={false} position="bottom-left" />
            </ReactFlow>
          </div>
        </div>
      </section>

      {/* ---- RIGHT: Detail panel ---- */}
      <section className="flex h-[53vh] min-w-0 flex-1 flex-col bg-[#0a0a0c] pb-24 lg:h-full">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a35] bg-[#121217]/75 px-6 py-5 backdrop-blur-md">
          <div className="min-w-0">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e599]">
              {detail.kind} / {detail.label}
            </div>
            <h3 className="max-w-xl truncate text-lg font-medium">
              {detail.title}
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8]">{detail.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-[#2a2a35] bg-[#1a1a24] p-1">
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors ${
                  mode === 'preview'
                    ? 'bg-[#00e599]/15 text-[#00e599]'
                    : 'text-[#94a3b8]'
                }`}
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                type="button"
                onClick={() => setMode('code')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors ${
                  mode === 'code'
                    ? 'bg-[#00e599]/15 text-[#00e599]'
                    : 'text-[#94a3b8]'
                }`}
              >
                <Code2 size={14} />
                HTML
              </button>
            </div>

            {detail.generationId && (
              <button
                type="button"
                onClick={() =>
                  onOpenGeneration(detail.generationId as string)
                }
                className="flex items-center gap-2 rounded-full border border-[#00e599]/30 bg-[#00e599]/10 px-4 py-2.5 text-xs font-medium text-[#00e599] transition-colors hover:bg-[#00e599]/20"
              >
                Open
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 p-5">
          {mode === 'preview' ? (
            <div className="h-full overflow-hidden rounded-xl border border-[#2a2a35] bg-[#121217]">
              <iframe
                srcDoc={previewHtml}
                title={`${detail.label} preview`}
                className="h-full w-full border-none"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          ) : (
            <pre className="h-full overflow-auto rounded-xl border border-[#2a2a35] bg-[#121217] p-5 font-mono text-xs leading-relaxed text-[#cbd5e1]">
              <code>{detail.htmlContent}</code>
            </pre>
          )}
        </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Public export – wraps inner in ReactFlowProvider
// ---------------------------------------------------------------------------

export const GraphView: React.FC<GraphViewProps> = props => (
  <ReactFlowProvider>
    <GraphViewInner {...props} />
  </ReactFlowProvider>
);
