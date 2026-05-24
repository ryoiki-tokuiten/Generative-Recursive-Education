-- schema.sql
-- Run this in your database to initialize the tables:
-- psql -d generative_osw -f schema.sql

-- Enable UUID extension if not already enabled (gen_random_uuid is built-in for PG 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create runs table
CREATE TABLE IF NOT EXISTS runs (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    root_node_id VARCHAR(255),
    current_node_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create nodes table (stores the tree nodes)
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nodes_run_id ON nodes(run_id);
