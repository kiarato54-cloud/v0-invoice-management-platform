-- =====================================================
-- Staff & Permissions Management
-- =====================================================

-- ROLES TABLE (for detailed role definitions)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- pos_checkout, inventory_view, staff_manage, etc.
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- pos, inventory, staff, reports, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROLE_PERMISSIONS (many-to-many junction table)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- STAFF_SHIFTS TABLE
CREATE TABLE IF NOT EXISTS staff_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL, -- morning, afternoon, night
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEE_PERMISSIONS TABLE (for custom permissions override)
CREATE TABLE IF NOT EXISTS employee_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES employees(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(employee_id, permission_id)
);

-- ACTIVITY_LOG TABLE (audit trail)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  branch_id UUID REFERENCES branches(id),
  action TEXT NOT NULL, -- login, logout, pos_checkout, inventory_update, etc.
  resource_type TEXT, -- pos_transaction, product, inventory, etc.
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ENABLE RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- CREATE INDEXES
CREATE INDEX idx_roles_active ON roles(is_active);
CREATE INDEX idx_permissions_category ON permissions(category);
CREATE INDEX idx_staff_shifts_employee ON staff_shifts(employee_id);
CREATE INDEX idx_staff_shifts_branch ON staff_shifts(branch_id);
CREATE INDEX idx_staff_shifts_date ON staff_shifts(shift_date);
CREATE INDEX idx_employee_permissions_employee ON employee_permissions(employee_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);
CREATE INDEX idx_activity_log_action ON activity_log(action);

-- RLS POLICIES

-- Permissions - everyone can view
CREATE POLICY "permissions_view_all" ON permissions
  FOR SELECT USING (is_active = true);

-- Roles - view and manage
CREATE POLICY "roles_view_all" ON roles
  FOR SELECT USING (true);

CREATE POLICY "roles_manage" ON roles
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Staff Shifts
CREATE POLICY "staff_shifts_view" ON staff_shifts
  FOR SELECT USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
    OR branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "staff_shifts_manage" ON staff_shifts
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
    OR branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Activity Log - view own activity or admin
CREATE POLICY "activity_log_view" ON activity_log
  FOR SELECT USING (
    user_id = auth.uid()
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "activity_log_insert" ON activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NOT NULL);
