-- Drop the existing policy
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON mrr_data;

-- Create a new policy that allows public access
CREATE POLICY "Allow public read access"
  ON mrr_data
  FOR SELECT
  TO public
  USING (true);