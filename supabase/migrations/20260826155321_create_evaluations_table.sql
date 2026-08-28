/*
# Create evaluations table for per-user AI response evaluation history

## Purpose
Stores AI response evaluation results so each authenticated user has their own
private history of evaluations they've run.

## New Tables
- `evaluations`
  - `id` (uuid, primary key) — unique evaluation ID
  - `user_id` (uuid, not null, defaults to auth.uid()) — owner of the evaluation
  - `question` (text, not null) — the question that was asked
  - `response` (text, not null) — the AI response being evaluated
  - `reference_answer` (text) — optional reference/ground-truth answer
  - `scores` (jsonb, not null) — score set with relevance, accuracy, hallucination, completeness, overall
  - `verdict` (text, not null) — one of: Excellent, Good, Acceptable, Needs Improvement, Poor
  - `hallucination` (boolean, not null, default false) — whether hallucination was detected
  - `hallucination_risk` (text, not null, default 'Low') — Low, Medium, or High
  - `claims` (jsonb, not null, default '[]') — array of claim analysis objects
  - `evidence` (jsonb, not null, default '[]') — array of retrieved evidence objects
  - `strengths` (jsonb, not null, default '[]') — array of strength strings
  - `weaknesses` (jsonb, not null, default '[]') — array of weakness strings
  - `confidence` (numeric, not null, default 0) — overall confidence 0-1
  - `summary` (text, not null, default '') — evaluation summary
  - `recommendation` (text, not null, default '') — recommendation text
  - `duration_ms` (integer, not null, default 0) — evaluation duration in milliseconds
  - `created_at` (timestamptz, default now()) — when the evaluation was created

## Security
- Row Level Security is ENABLED on `evaluations`.
- Four separate owner-scoped policies (SELECT, INSERT, UPDATE, DELETE) restricted
  to `authenticated` users, each checking `auth.uid() = user_id`.
- The `user_id` column defaults to `auth.uid()` so inserts from the client that
  omit `user_id` still satisfy the WITH CHECK constraint.

## Important Notes
1. Each user can only see, create, modify, and delete their own evaluations.
2. Unauthenticated (anon) users cannot access any rows.
3. The table is safe to re-run — uses IF NOT EXISTS and drops policies before creating.
*/

CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  response text NOT NULL,
  reference_answer text,
  scores jsonb NOT NULL,
  verdict text NOT NULL CHECK (verdict IN ('Excellent', 'Good', 'Acceptable', 'Needs Improvement', 'Poor')),
  hallucination boolean NOT NULL DEFAULT false,
  hallucination_risk text NOT NULL DEFAULT 'Low' CHECK (hallucination_risk IN ('Low', 'Medium', 'High')),
  claims jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  strengths jsonb NOT NULL DEFAULT '[]'::jsonb,
  weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence numeric NOT NULL DEFAULT 0,
  summary text NOT NULL DEFAULT '',
  recommendation text NOT NULL DEFAULT '',
  duration_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_evaluations" ON evaluations;
CREATE POLICY "select_own_evaluations"
ON evaluations FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_evaluations" ON evaluations;
CREATE POLICY "insert_own_evaluations"
ON evaluations FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_evaluations" ON evaluations;
CREATE POLICY "update_own_evaluations"
ON evaluations FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_evaluations" ON evaluations;
CREATE POLICY "delete_own_evaluations"
ON evaluations FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS evaluations_user_id_idx ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS evaluations_created_at_idx ON evaluations(created_at DESC);
