import pg from 'pg';
import { PageNode } from '../types';

const { Pool } = pg;

// Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Set to true if required in production
});

// Helper functions to map local frontend node IDs to globally unique database IDs
function toDbId(runId: string, nodeId: string | null): string | null {
  if (!nodeId) return null;
  if (nodeId.startsWith(`${runId}::`)) return nodeId;
  return `${runId}::${nodeId}`;
}

function fromDbId(runId: string, nodeId: string | null): string | null {
  if (!nodeId) return null;
  const prefix = `${runId}::`;
  if (nodeId.startsWith(prefix)) {
    return nodeId.slice(prefix.length);
  }
  return nodeId;
}

// Initialize database tables
export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create runs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS runs (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        root_node_id VARCHAR(255),
        current_node_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create nodes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS nodes (
        id VARCHAR(255) PRIMARY KEY,
        run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
        parent_id VARCHAR(255),
        topic TEXT NOT NULL,
        html_content TEXT NOT NULL,
        trigger_context TEXT,
        trigger_summary TEXT,
        parent_component_id TEXT,
        children_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
        timestamp BIGINT NOT NULL
      );
    `);

    // Create performance index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_nodes_run_id ON nodes(run_id);
    `);

    await client.query('COMMIT');
    console.log('[Database] Tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Database] Failed to initialize tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Fetch all runs with count of nodes in them
export async function getAllRuns() {
  const queryText = `
    SELECT r.id, r.title, r.root_node_id, r.current_node_id, r.created_at, r.updated_at,
           COUNT(n.id)::int as node_count
    FROM runs r
    LEFT JOIN nodes n ON r.id = n.run_id
    GROUP BY r.id
    ORDER BY r.updated_at DESC;
  `;
  const res = await pool.query(queryText);
  return res.rows;
}

// Fetch a single run with all of its nodes built into a NodeMap
export async function getRun(runId: string) {
  const runRes = await pool.query('SELECT * FROM runs WHERE id = $1', [runId]);
  if (runRes.rows.length === 0) {
    return null;
  }

  const run = runRes.rows[0];
  const nodesRes = await pool.query('SELECT * FROM nodes WHERE run_id = $1', [runId]);
  
  const nodeMap: { [id: string]: PageNode } = {};
  for (const row of nodesRes.rows) {
    const localId = fromDbId(runId, row.id) as string;
    const localParentId = fromDbId(runId, row.parent_id);
    const localChildrenIds = Array.isArray(row.children_ids)
      ? row.children_ids.map((id: string) => fromDbId(runId, id) as string)
      : [];

    nodeMap[localId] = {
      id: localId,
      parentId: localParentId,
      topic: row.topic,
      htmlContent: row.html_content,
      triggerContext: row.trigger_context || undefined,
      triggerSummary: row.trigger_summary || undefined,
      parentComponentId: row.parent_component_id || undefined,
      childrenIds: localChildrenIds,
      timestamp: Number(row.timestamp)
    };
  }

  return {
    id: run.id,
    title: run.title,
    rootNodeId: fromDbId(runId, run.root_node_id),
    currentNodeId: fromDbId(runId, run.current_node_id),
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    nodeMap
  };
}

// Sync run metadata and all node elements in the graph
export async function syncRun(
  runId: string,
  title: string,
  rootNodeId: string | null,
  currentNodeId: string | null,
  nodeMap: { [id: string]: PageNode }
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const dbRootNodeId = toDbId(runId, rootNodeId);
    const dbCurrentNodeId = toDbId(runId, currentNodeId);

    // 1. Upsert run metadata
    const upsertRunQuery = `
      INSERT INTO runs (id, title, root_node_id, current_node_id, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        root_node_id = EXCLUDED.root_node_id,
        current_node_id = EXCLUDED.current_node_id,
        updated_at = CURRENT_TIMESTAMP;
    `;
    await client.query(upsertRunQuery, [runId, title, dbRootNodeId, dbCurrentNodeId]);

    // 2. Upsert each node in the nodeMap
    const nodeIds = Object.keys(nodeMap);
    const dbNodeIds: string[] = [];

    for (const id of nodeIds) {
      const node = nodeMap[id];
      const dbId = toDbId(runId, node.id) as string;
      dbNodeIds.push(dbId);

      const dbParentId = toDbId(runId, node.parentId);
      const dbChildrenIds = node.childrenIds.map(childId => toDbId(runId, childId) as string);

      const upsertNodeQuery = `
        INSERT INTO nodes (
          id, run_id, parent_id, topic, html_content, 
          trigger_context, trigger_summary, parent_component_id, 
          children_ids, timestamp
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          parent_id = EXCLUDED.parent_id,
          topic = EXCLUDED.topic,
          html_content = EXCLUDED.html_content,
          trigger_context = EXCLUDED.trigger_context,
          trigger_summary = EXCLUDED.trigger_summary,
          parent_component_id = EXCLUDED.parent_component_id,
          children_ids = EXCLUDED.children_ids,
          timestamp = EXCLUDED.timestamp;
      `;
      await client.query(upsertNodeQuery, [
        dbId,
        runId,
        dbParentId,
        node.topic,
        node.htmlContent,
        node.triggerContext || null,
        node.triggerSummary || null,
        node.parentComponentId || null,
        JSON.stringify(dbChildrenIds),
        node.timestamp
      ]);
    }

    // 3. Delete any nodes that exist in DB but are no longer in frontend's nodeMap
    if (dbNodeIds.length > 0) {
      const deleteQuery = `
        DELETE FROM nodes 
        WHERE run_id = $1 AND id NOT IN (${dbNodeIds.map((_, i) => `$${i + 2}`).join(', ')});
      `;
      await client.query(deleteQuery, [runId, ...dbNodeIds]);
    } else {
      await client.query('DELETE FROM nodes WHERE run_id = $1;', [runId]);
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`[Database] Error syncing run ${runId}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

// Delete a run (cascade will delete its nodes)
export async function deleteRun(runId: string) {
  const res = await pool.query('DELETE FROM runs WHERE id = $1', [runId]);
  return { success: res.rowCount !== 0 };
}
