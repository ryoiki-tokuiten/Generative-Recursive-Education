-- Usage:  psql -U postgres -f schema.sql

-- 1. Create the database (idempotent via shell-level check)
SELECT 'CREATE DATABASE generative_os'
  WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'generative_os'
  )\gexec

-- 2. Connect to the database
\c generative_os;

-- =============================================================================
-- Core table: app_nodes
--
-- Each row represents a single generated HTML screen (node) within an app.
-- The tree structure is maintained by parent_id, with ON DELETE CASCADE
-- ensuring the entire subtree is removed when a branch is deleted.
-- html_content is stored as BYTEA (gzip-compressed UTF-8 HTML).
-- children_ids is a JSONB array of child UUIDs, kept in sync with parent_id
-- for O(1) frontend tree reconstruction without recursive CTEs.
-- =============================================================================
CREATE TABLE IF NOT EXISTS app_nodes (
    id             VARCHAR     PRIMARY KEY,
    app_id         VARCHAR     NOT NULL,
    parent_id      VARCHAR     REFERENCES app_nodes(id) ON DELETE CASCADE,
    topic          TEXT,
    html_content   BYTEA,
    trigger_context TEXT,
    children_ids   JSONB       NOT NULL DEFAULT '[]'::jsonb,
    timestamp      BIGINT      NOT NULL
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Primary query pattern: fetch the full node tree for a given app.
CREATE INDEX IF NOT EXISTS idx_app_nodes_app_id
    ON app_nodes (app_id);

-- Used when walking up the tree to update a parent's children_ids on delete.
CREATE INDEX IF NOT EXISTS idx_app_nodes_parent_id
    ON app_nodes (parent_id);
