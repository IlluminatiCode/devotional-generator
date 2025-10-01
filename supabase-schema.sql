-- Create devotionals table
CREATE TABLE IF NOT EXISTS devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  intro TEXT NOT NULL,
  scripture TEXT NOT NULL,
  reflection TEXT NOT NULL,
  prayer TEXT NOT NULL,
  challenge TEXT NOT NULL,
  theme TEXT NOT NULL,
  audience TEXT,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_devotionals_created_at ON devotionals(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON devotionals
  FOR SELECT USING (true);

-- Create policy to allow public insert (since this is a generator app)
CREATE POLICY "Allow public insert" ON devotionals
  FOR INSERT WITH CHECK (true);
