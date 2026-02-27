-- Migration script to add missing columns to existing tables
-- Run this in Supabase SQL Editor after the initial schema

-- Add missing columns to invoices table
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS terms TEXT,
ADD COLUMN IF NOT EXISTS store_keeper_name TEXT,
ADD COLUMN IF NOT EXISTS sales_officer_name TEXT,
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS vehicle_plate_number TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'mpesa', 'bank', 'credit'));

-- Add missing columns to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Add missing columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing users to have full_name from name if it exists
UPDATE public.users SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'mpesa', 'bank', 'credit', 'check', 'other')),
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view payments for own invoices" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for own invoices" ON public.payments;
DROP POLICY IF EXISTS "Users can delete payments for own invoices" ON public.payments;

-- Create RLS policies for payments
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

-- Create function for automatic timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at if they don't exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
