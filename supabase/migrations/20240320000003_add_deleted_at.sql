-- Add deleted_at column to rewrites table
ALTER TABLE rewrites ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE; 