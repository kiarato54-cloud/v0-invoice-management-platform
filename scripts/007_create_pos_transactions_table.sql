-- Create POS transactions table
CREATE TABLE IF NOT EXISTS pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT UNIQUE NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id),
  cashier_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'cancelled', 'refunded'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  method TEXT NOT NULL, -- 'cash', 'card', 'mobile_money', 'cheque'
  amount NUMERIC(10, 2) NOT NULL,
  reference_number TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view transactions" ON pos_transactions FOR SELECT USING (true);
CREATE POLICY "Cashiers can insert transactions" ON pos_transactions FOR INSERT WITH CHECK (auth.uid() = cashier_id);
CREATE POLICY "Cashiers can update own transactions" ON pos_transactions FOR UPDATE USING (auth.uid() = cashier_id);

CREATE POLICY "Users can view transaction items" ON transaction_items FOR SELECT USING (true);
CREATE POLICY "Users can insert transaction items" ON transaction_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view payment methods" ON payment_methods FOR SELECT USING (true);
CREATE POLICY "Users can insert payment methods" ON payment_methods FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_transactions_branch ON pos_transactions(branch_id);
CREATE INDEX idx_transactions_cashier ON pos_transactions(cashier_id);
CREATE INDEX idx_transactions_date ON pos_transactions(created_at);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
