-- Create branches table for multi-branch support
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Admins can insert branches" ON branches FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can update branches" ON branches FOR UPDATE WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can delete branches" ON branches FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for branch queries
CREATE INDEX idx_branches_active ON branches(is_active);
