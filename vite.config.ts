import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Helper to parse JSON body from incoming HTTP requests
function getRequestBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function databaseApiPlugin() {
  return {
    name: 'database-api-plugin',
    async configureServer(server: any) {
      // Dynamically import dbServer after process.env.DATABASE_URL is set
      const { initDb, getAllRuns, getRun, syncRun, deleteRun } = await import('./services/dbServer');

      // Automatically initialize DB tables on server start
      try {
        await initDb();
      } catch (err) {
        console.error('[Vite Server] Database initialization failed:', err);
      }

      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';

        // 1. GET /api/runs - Fetch all previous runs
        if (url === '/api/runs' && req.method === 'GET') {
          try {
            const runs = await getAllRuns();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(runs));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. GET /api/runs/:id - Load specific run and its node graph
        const getRunMatch = url.match(/^\/api\/runs\/([a-f0-9-]+)$/);
        if (getRunMatch && req.method === 'GET') {
          const runId = getRunMatch[1];
          try {
            const run = await getRun(runId);
            if (!run) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Run not found' }));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(run));
            }
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 3. POST /api/runs/:id/sync - Sync nodeMap graph and active state
        const syncMatch = url.match(/^\/api\/runs\/([a-f0-9-]+)\/sync$/);
        if (syncMatch && req.method === 'POST') {
          const runId = syncMatch[1];
          try {
            const body = await getRequestBody(req);
            const { title, rootNodeId, currentNodeId, nodeMap } = body;
            const result = await syncRun(runId, title, rootNodeId, currentNodeId, nodeMap);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 4. DELETE /api/runs/:id - Delete a run
        const deleteMatch = url.match(/^\/api\/runs\/([a-f0-9-]+)$/);
        if (deleteMatch && req.method === 'DELETE') {
          const runId = deleteMatch[1];
          try {
            const result = await deleteRun(runId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Explicitly set environment variables in Node process
    process.env.DATABASE_URL = env.DATABASE_URL || process.env.DATABASE_URL;
    process.env.API_KEY = env.GEMINI_API_KEY || process.env.API_KEY;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), databaseApiPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
