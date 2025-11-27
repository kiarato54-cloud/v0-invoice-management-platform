-- =====================================================
-- Payment Methods & Processing Tables
-- =====================================================

-- PAYMENT_METHODS TABLE
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Cash, Card, Mobile Money, Cheque, etc.
  code TEXT NOT NULL UNIQUE,
  requires_reference BOOLEAN DEFAULT false,
  requires_verification BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENT_TRANSACTIONS TABLE (for detailed payment tracking)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
  amount_tendered NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL,
  change_amount NUMERIC,
  reference_number TEXT, -- Card auth code, MPESA ref, etc.
  verification_code TEXT,
  notes TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, verified, failed, refunded
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RECONCILIATION TABLE (for end-of-day reconciliation)
CREATE TABLE IF NOT EXISTS daily_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  reconciliation_date DATE NOT NULL,
  expected_cash NUMERIC NOT NULL,
  actual_cash NUMERIC NOT NULL,
  variance NUMERIC,
  status TEXT DEFAULT 'pending', -- pending, verified, accepted, disputed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES employees(id),
  UNIQUE(branch_id, reconciliation_date)
);

-- REFUND_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  refund_amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  requested_by UUID NOT NULL REFERENCES employees(id),
  approved_by UUID REFERENCES employees(id),
  refund_method TEXT, -- same_method, cash, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ENABLE RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- CREATE INDEXES
CREATE INDEX idx_payment_transactions_pos ON payment_transactions(pos_transaction_id);
CREATE INDEX idx_payment_transactions_method ON payment_transactions(payment_method_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(payment_status);
CREATE INDEX idx_payment_transactions_date ON payment_transactions(payment_date);
CREATE INDEX idx_daily_reconciliation_branch ON daily_reconciliation(branch_id);
CREATE INDEX idx_daily_reconciliation_date ON daily_reconciliation(reconciliation_date);
CREATE INDEX idx_refund_requests_pos ON refund_requests(pos_transaction_id);
CREATE INDEX idx_refund_requests_status ON refund_requests(status);

-- RLS POLICIES

-- Payment Methods - Everyone can view
CREATE POLICY "payment_methods_view_all" ON payment_methods
  FOR SELECT USING (is_active = true);

-- Payment Transactions
CREATE POLICY "payment_transactions_view" ON payment_transactions
  FOR SELECT USING (
    pos_transaction_id IN (
      SELECT id FROM pos_transactions
      WHERE branch_id IN (
        SELECT branch_id FROM employees WHERE user_id = auth.uid()
      )
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "payment_transactions_insert" ON payment_transactions
  FOR INSERT WITH CHECK (
    pos_transaction_id IN (
      SELECT id FROM pos_transactions
      WHERE branch_id IN (
        SELECT branch_id FROM employees WHERE user_id = auth.uid()
      )
    )
  );

-- Daily Reconciliation
CREATE POLICY "daily_reconciliation_view" ON daily_reconciliation
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "daily_reconciliation_manage" ON daily_reconciliation
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
    OR employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Refund Requests
CREATE POLICY "refund_requests_view" ON refund_requests
  FOR SELECT USING (
    pos_transaction_id IN (
      SELECT id FROM pos_transactions
      WHERE branch_id IN (
        SELECT branch_id FROM employees WHERE user_id = auth.uid()
      )
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "refund_requests_manage" ON refund_requests
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
    OR auth.uid() IN (
      SELECT u.id FROM users u
      JOIN employees e ON u.id = e.user_id
      WHERE e.branch_id IN (
        SELECT branch_id FROM pos_transactions 
        WHERE id = refund_requests.pos_transaction_id
      )
    )
  );
