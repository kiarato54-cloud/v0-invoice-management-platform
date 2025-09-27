-- Insert demo users (these will be created through auth.users trigger)
-- Note: In production, users would sign up through the auth system

-- Insert demo customers
INSERT INTO public.customers (id, name, email, phone, address, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'ABC Hardware Store', 'contact@abchardware.com', '+1-555-0101', '123 Main St, City, State 12345', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440002', 'XYZ Construction', 'orders@xyzconstruction.com', '+1-555-0102', '456 Oak Ave, City, State 12346', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440003', 'BuildRight Supplies', 'purchasing@buildright.com', '+1-555-0103', '789 Pine Rd, City, State 12347', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440004', 'Metro Tools Inc', 'sales@metrotools.com', '+1-555-0104', '321 Elm St, City, State 12348', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440005', 'Industrial Supply Co', 'orders@industrialsupply.com', '+1-555-0105', '654 Maple Dr, City, State 12349', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Insert demo invoices
INSERT INTO public.invoices (id, invoice_number, customer_id, created_by, status, subtotal, tax_amount, total_amount, due_date, notes) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1), 'paid', 2500.00, 250.00, 2750.00, '2024-02-15', 'Hardware supplies for Q1'),
  ('660e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1), 'pending', 4200.00, 420.00, 4620.00, '2024-02-20', 'Construction materials'),
  ('660e8400-e29b-41d4-a716-446655440003', 'INV-2024-003', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1), 'overdue', 1800.00, 180.00, 1980.00, '2024-01-30', 'Building supplies'),
  ('660e8400-e29b-41d4-a716-446655440004', 'INV-2024-004', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1), 'draft', 3200.00, 320.00, 3520.00, '2024-02-25', 'Tool order'),
  ('660e8400-e29b-41d4-a716-446655440005', 'INV-2024-005', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1), 'paid', 5600.00, 560.00, 6160.00, '2024-02-10', 'Industrial equipment')
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert demo invoice items
INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, total_price) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Steel Bolts M12x50', 100, 2.50, 250.00),
  ('660e8400-e29b-41d4-a716-446655440001', 'Washers M12', 200, 0.25, 50.00),
  ('660e8400-e29b-41d4-a716-446655440001', 'Hex Nuts M12', 100, 1.20, 120.00),
  ('660e8400-e29b-41d4-a716-446655440001', 'Steel Plates 10mm', 50, 42.00, 2100.00),
  
  ('660e8400-e29b-41d4-a716-446655440002', 'Concrete Mixer', 2, 850.00, 1700.00),
  ('660e8400-e29b-41d4-a716-446655440002', 'Safety Helmets', 25, 35.00, 875.00),
  ('660e8400-e29b-41d4-a716-446655440002', 'Work Gloves', 50, 12.50, 625.00),
  ('660e8400-e29b-41d4-a716-446655440002', 'Measuring Tape 25ft', 10, 25.00, 250.00),
  
  ('660e8400-e29b-41d4-a716-446655440003', 'Lumber 2x4x8', 100, 8.50, 850.00),
  ('660e8400-e29b-41d4-a716-446655440003', 'Plywood 4x8', 20, 45.00, 900.00),
  ('660e8400-e29b-41d4-a716-446655440003', 'Nails 3.5inch', 10, 5.00, 50.00),
  
  ('660e8400-e29b-41d4-a716-446655440004', 'Power Drill Set', 5, 180.00, 900.00),
  ('660e8400-e29b-41d4-a716-446655440004', 'Circular Saw', 3, 320.00, 960.00),
  ('660e8400-e29b-41d4-a716-446655440004', 'Tool Box Large', 8, 85.00, 680.00),
  ('660e8400-e29b-41d4-a716-446655440004', 'Extension Cord 50ft', 12, 55.00, 660.00),
  
  ('660e8400-e29b-41d4-a716-446655440005', 'Industrial Compressor', 2, 1200.00, 2400.00),
  ('660e8400-e29b-41d4-a716-446655440005', 'Pneumatic Tools Set', 4, 450.00, 1800.00),
  ('660e8400-e29b-41d4-a716-446655440005', 'Air Hose 100ft', 6, 75.00, 450.00),
  ('660e8400-e29b-41d4-a716-446655440005', 'Pressure Gauge', 15, 35.00, 525.00),
  ('660e8400-e29b-41d4-a716-446655440005', 'Safety Valve', 8, 65.00, 520.00);
