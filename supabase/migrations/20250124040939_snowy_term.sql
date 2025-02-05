/*
  # Create MRR tracking table

  1. New Tables
    - `mrr_data`
      - `id` (uuid, primary key)
      - `creation_date` (date, not null)
      - `mrr` (integer, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `mrr_data` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS mrr_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_date date NOT NULL,
  mrr integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mrr_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users"
  ON mrr_data
  FOR SELECT
  TO authenticated
  USING (true);