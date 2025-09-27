-- Create users table for role-based access
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'managing_director', 'sales_officer', 'storekeeper')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  created_by UUID NOT NULL REFERENCES public.users(id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "admin_select_all_users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for customers table
CREATE POLICY "customers_select_all" ON public.customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
);
CREATE POLICY "customers_insert_own" ON public.customers FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "customers_update_own" ON public.customers FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'managing_director'))
);

-- RLS Policies for invoices table
CREATE POLICY "invoices_select_all" ON public.invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
);
CREATE POLICY "invoices_insert_own" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "invoices_update_own" ON public.invoices FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'managing_director'))
);

-- RLS Policies for invoice_items table
CREATE POLICY "invoice_items_select_all" ON public.invoice_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices i 
    JOIN public.users u ON u.id = auth.uid() 
    WHERE i.id = invoice_items.invoice_id
  )
);
CREATE POLICY "invoice_items_insert_own" ON public.invoice_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices i 
    WHERE i.id = invoice_items.invoice_id AND i.created_by = auth.uid()
  )
);
CREATE POLICY "invoice_items_update_own" ON public.invoice_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.invoices i 
    WHERE i.id = invoice_items.invoice_id AND (
      i.created_by = auth.uid() OR 
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'managing_director'))
    )
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'sales_officer')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
