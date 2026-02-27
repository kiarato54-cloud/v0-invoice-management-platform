-- =====================================================
-- POS System: Multi-Branch Architecture
-- =====================================================

-- 1. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE (with branch inventory)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT UNIQUE,
  category TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  cost_price NUMERIC,
  stock_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  supplier_id UUID,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BRANCH INVENTORY TABLE (track stock per branch)
CREATE TABLE IF NOT EXISTS branch_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  last_counted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, product_id)
);

-- 4. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EMPLOYEES TABLE (enhanced)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  employee_id_number TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  salary NUMERIC,
  hire_date DATE,
  status TEXT DEFAULT 'active', -- active, on-leave, terminated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. POS TRANSACTIONS TABLE (sales orders)
CREATE TABLE IF NOT EXISTS pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT UNIQUE NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id),
  customer_id UUID REFERENCES customers(id),
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC,
  tax_rate NUMERIC,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT, -- cash, card, mobile_money, etc
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed', -- completed, pending, cancelled, refunded
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. POS TRANSACTION ITEMS TABLE
CREATE TABLE IF NOT EXISTS pos_transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. STOCK MOVEMENTS TABLE (for inventory tracking)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  movement_type TEXT NOT NULL, -- in, out, adjustment, return
  quantity INTEGER NOT NULL,
  reference_id UUID, -- links to po, pos_transaction, etc
  reference_type TEXT, -- purchase_order, pos_transaction, adjustment
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. LOYALTY PROGRAM TABLE
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  points_balance INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id)
);

-- 10. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
  refund_amount NUMERIC NOT NULL,
  reason TEXT,
  refund_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_by UUID REFERENCES employees(id),
  status TEXT DEFAULT 'completed', -- completed, pending, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_branches_is_active ON branches(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_branch_inventory_branch ON branch_inventory(branch_id);
CREATE INDEX idx_branch_inventory_product ON branch_inventory(product_id);
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_pos_transactions_branch ON pos_transactions(branch_id);
CREATE INDEX idx_pos_transactions_date ON pos_transactions(transaction_date);
CREATE INDEX idx_pos_transactions_employee ON pos_transactions(employee_id);
CREATE INDEX idx_stock_movements_branch ON stock_movements(branch_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);
CREATE INDEX idx_loyalty_programs_customer ON loyalty_programs(customer_id);

-- =====================================================
-- ADD FOREIGN KEY TO EXISTING INVOICES TABLE
-- =====================================================

ALTER TABLE invoices ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
CREATE INDEX idx_invoices_branch ON invoices(branch_id);
