-- Invoice Management Platform Database Schema
-- Run this first to create all necessary tables

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'bank_transfer' CHECK (payment_method IN ('cash', 'check', 'bank_transfer', 'credit_card', 'paypal', 'other')),
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Fixed RLS policies to properly qualify column names with table references

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Customers policies (all authenticated users can manage customers)
CREATE POLICY "Users can view all customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update customers" ON public.customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete customers" ON public.customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Invoices policies (users can only manage their own invoices)
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = public.invoices.user_id);

CREATE POLICY "Users can insert own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = public.invoices.user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = public.invoices.user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = public.invoices.user_id);

-- Invoice items policies
CREATE POLICY "Users can view invoice items for own invoices" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.invoice_items.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert invoice items for own invoices" ON public.invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.invoice_items.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invoice items for own invoices" ON public.invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.invoice_items.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete invoice items for own invoices" ON public.invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.invoice_items.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view payments for own invoices" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.payments.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for own invoices" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.payments.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for own invoices" ON public.payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE public.invoices.id = public.payments.invoice_id 
      AND public.invoices.user_id = auth.uid()
    )
  );

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
