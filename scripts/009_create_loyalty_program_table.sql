-- Create loyalty program tiers
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_points INTEGER DEFAULT 0,
  max_points INTEGER DEFAULT 999999,
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  benefits JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer loyalty table
CREATE TABLE IF NOT EXISTS customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES loyalty_tiers(id),
  total_points INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  last_transaction_date TIMESTAMP WITH TIME ZONE,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_loyalty_id UUID NOT NULL REFERENCES customer_loyalty(id),
  transaction_type TEXT NOT NULL, -- 'earn', 'redeem', 'expire', 'adjustment'
  points_amount INTEGER NOT NULL,
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view loyalty tiers" ON loyalty_tiers FOR SELECT USING (true);
CREATE POLICY "Users can view customer loyalty" ON customer_loyalty FOR SELECT USING (true);
CREATE POLICY "Users can view loyalty transactions" ON loyalty_transactions FOR SELECT USING (true);

-- Insert default loyalty tiers
INSERT INTO loyalty_tiers (name, min_points, max_points, discount_percentage, benefits) VALUES
  ('Bronze', 0, 499, 0, '{"benefits": ["Birthday bonus 50 points"]}'::jsonb),
  ('Silver', 500, 1499, 5, '{"benefits": ["5% discount", "Birthday bonus 100 points", "Free gift card"]}'::jsonb),
  ('Gold', 1500, 4999, 10, '{"benefits": ["10% discount", "Birthday bonus 200 points", "Priority support", "VIP events"]}'::jsonb),
  ('Platinum', 5000, 999999, 15, '{"benefits": ["15% discount", "Birthday bonus 300 points", "Personal shopper", "VIP events", "Free shipping"]}'::jsonb)
ON CONFLICT DO NOTHING;
