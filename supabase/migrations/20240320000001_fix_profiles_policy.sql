-- Add INSERT policy for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Remove confirmed_at column if it exists
ALTER TABLE profiles DROP COLUMN IF EXISTS confirmed_at; 