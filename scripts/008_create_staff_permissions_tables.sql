-- Create staff positions table
CREATE TABLE IF NOT EXISTS staff_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table (extends users for POS)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  position_id UUID REFERENCES staff_positions(id),
  salary NUMERIC(10, 2),
  employment_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles and permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff shifts table
CREATE TABLE IF NOT EXISTS staff_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'checked_in', 'checked_out'
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Admins can manage staff" ON staff FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage role permissions" ON role_permissions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view shifts" ON staff_shifts FOR SELECT USING (true);
CREATE POLICY "Admins can manage shifts" ON staff_shifts FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default positions
INSERT INTO staff_positions (name, description) VALUES
  ('Cashier', 'Handles POS transactions'),
  ('Store Manager', 'Manages inventory and staff'),
  ('Sales Associate', 'Assists customers and processes sales'),
  ('Supervisor', 'Supervises store operations')
ON CONFLICT DO NOTHING;
