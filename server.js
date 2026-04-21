import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';
import zlib from 'zlib';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables, supporting .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config();

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Use provided connection string or a default local one
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

const pool = new Pool({
  connectionString: dbUrl,
});

async function initDB() {
  try {
    const client = await pool.connect();
    // Create the table. parent_id references id with ON DELETE CASCADE to automatically
    // delete all nested branches when a parent is deleted.
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_nodes (
        id VARCHAR PRIMARY KEY,
        app_id VARCHAR NOT NULL,
        parent_id VARCHAR REFERENCES app_nodes(id) ON DELETE CASCADE,
        topic TEXT,
        html_content BYTEA,
        trigger_context TEXT,
        children_ids JSONB,
        timestamp BIGINT
      );
    `);
    client.release();
    console.log('PostgreSQL Database connected and schema verified.');
  } catch (err) {
    console.error('Failed to connect or initialize PostgreSQL database:', err.message);
    console.error('Make sure you have set a valid DATABASE_URL in your .env.local file');
  }
}

initDB();

// API Endpoints

// 1. Get all nodes for an app
app.get('/api/nodes/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const result = await pool.query('SELECT * FROM app_nodes WHERE app_id = $1', [appId]);

    // We need to decompress the html_content
    const nodes = await Promise.all(result.rows.map(async (row) => {
      let htmlContent = '';
      if (row.html_content) {
        try {
          const decompressed = await gunzip(row.html_content);
          htmlContent = decompressed.toString('utf-8');
        } catch (e) {
          console.error(`Failed to decompress node ${row.id}`, e);
        }
      }

      return {
        id: row.id,
        parentId: row.parent_id,
        topic: row.topic,
        htmlContent,
        triggerContext: row.trigger_context,
        childrenIds: row.children_ids || [],
        timestamp: parseInt(row.timestamp, 10),
      };
    }));

    // Convert array to a map for the frontend
    const nodeMap = {};
    nodes.forEach(n => {
      nodeMap[n.id] = n;
    });

    res.json(nodeMap);
  } catch (err) {
    console.error('GET /api/nodes/:appId error:', err);
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

// 2. Save a new node
app.post('/api/nodes', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id, appId, parentId, topic, htmlContent, triggerContext, childrenIds, timestamp } = req.body;

    // Compress HTML
    const compressedHtml = await gzip(Buffer.from(htmlContent || '', 'utf-8'));

    // Insert node
    await client.query(`
      INSERT INTO app_nodes (id, app_id, parent_id, topic, html_content, trigger_context, children_ids, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET 
        topic = EXCLUDED.topic,
        html_content = EXCLUDED.html_content,
        children_ids = EXCLUDED.children_ids;
    `, [id, appId, parentId || null, topic, compressedHtml, triggerContext || null, JSON.stringify(childrenIds || []), timestamp]);

    // Update parent's children_ids if parentId exists
    if (parentId) {
      // In PostgreSQL, to append to a JSONB array, we can use the || operator
      await client.query(`
        UPDATE app_nodes 
        SET children_ids = children_ids || $1::jsonb
        WHERE id = $2 AND NOT (children_ids @> $1::jsonb);
      `, [JSON.stringify([id]), parentId]);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/nodes error:', err);
    res.status(500).json({ error: 'Failed to save node' });
  } finally {
    client.release();
  }
});

// 3. Delete a node (and automatically its cascading children due to ON DELETE CASCADE)
app.delete('/api/nodes/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // Find parent ID to update its children array
    const nodeRes = await client.query('SELECT parent_id FROM app_nodes WHERE id = $1', [id]);

    if (nodeRes.rows.length > 0) {
      const parentId = nodeRes.rows[0].parent_id;

      // Delete the node (cascades to children)
      await client.query('DELETE FROM app_nodes WHERE id = $1', [id]);

      // Update parent's children_ids to remove this ID
      if (parentId) {
        // We use a query to remove the specific element from the jsonb array
        await client.query(`
          UPDATE app_nodes
          SET children_ids = (
            SELECT jsonb_agg(elem)
            FROM jsonb_array_elements(children_ids) AS elem
            WHERE elem::text != '"' || $1 || '"'
          )
          WHERE id = $2;
        `, [id, parentId]);

        // Handle case where jsonb_agg returns null (empty array)
        await client.query(`
          UPDATE app_nodes
          SET children_ids = '[]'::jsonb
          WHERE id = $1 AND children_ids IS NULL;
        `, [parentId]);
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DELETE /api/nodes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete node' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
