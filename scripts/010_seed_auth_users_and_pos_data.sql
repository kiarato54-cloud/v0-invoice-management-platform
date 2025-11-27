-- Seed Demo Users and POS Data for Testing
-- This script creates demo auth users and populates branches, products, and staff data

-- ===== USER ACCOUNTS (via Supabase Auth) =====
-- Note: These users need to be created via Supabase Auth dashboard or API
-- Credentials for testing:
-- Admin: admin@pos.local / password123
-- Store Manager: manager@pos.local / password123
-- Cashier 1: cashier1@pos.local / password123
-- Cashier 2: cashier2@pos.local / password123
-- After creating these auth users, update the user profiles below

-- ===== INSERT USER PROFILES =====
INSERT INTO public.users (id, email, name, role, created_at, is_active) VALUES
-- Replace UUIDs with actual Supabase Auth user IDs after creating users
('11111111-1111-1111-1111-111111111111', 'admin@pos.local', 'Admin User', 'admin', NOW(), true),
('22222222-2222-2222-2222-222222222222', 'manager@pos.local', 'Store Manager', 'storekeeper', NOW(), true),
('33333333-3333-3333-3333-333333333333', 'cashier1@pos.local', 'Cashier One', 'sales_officer', NOW(), true),
('44444444-4444-4444-4444-444444444444', 'cashier2@pos.local', 'Cashier Two', 'sales_officer', NOW(), true),
('55555555-5555-5555-5555-555555555555', 'director@pos.local', 'Managing Director', 'managing_director', NOW(), true)
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT BRANCHES =====
INSERT INTO public.branches (id, name, location, manager_id, created_at) VALUES
('branch-001', 'Main Store - Downtown', 'Nairobi CBD', '22222222-2222-2222-2222-222222222222', NOW()),
('branch-002', 'Westlands Branch', 'Westlands, Nairobi', '22222222-2222-2222-2222-222222222222', NOW()),
('branch-003', 'Nakuru Branch', 'Nakuru Town', '22222222-2222-2222-2222-222222222222', NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT PRODUCT CATEGORIES =====
INSERT INTO public.product_categories (id, name, description) VALUES
('cat-001', 'Hardware Tools', 'Hand tools, power tools, measuring tools'),
('cat-002', 'Building Materials', 'Cement, sand, bricks, timber'),
('cat-003', 'Electrical', 'Wires, switches, fittings, circuit breakers'),
('cat-004', 'Plumbing', 'Pipes, fittings, taps, water fixtures'),
('cat-005', 'Paint & Finishes', 'Interior paint, exterior paint, varnish'),
('cat-006', 'Safety Equipment', 'Helmets, gloves, boots, masks')
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT PRODUCTS =====
INSERT INTO public.products (id, sku, name, category_id, description, unit_price, tax_rate) VALUES
('prod-001', 'TOOL-001', 'Claw Hammer', 'cat-001', '16oz Claw Hammer with comfortable grip', 450.00, 0.16),
('prod-002', 'TOOL-002', 'Adjustable Wrench', 'cat-001', '10" Adjustable Wrench', 280.00, 0.16),
('prod-003', 'TOOL-003', 'Drill Set', 'cat-001', '13-piece Power Drill Set', 2500.00, 0.16),
('prod-004', 'BUILD-001', 'Portland Cement', 'cat-002', '50kg bag of Portland Cement', 650.00, 0.16),
('prod-005', 'BUILD-002', 'River Sand', 'cat-002', '1 cubic meter River Sand', 1200.00, 0.16),
('prod-006', 'BUILD-003', 'Concrete Blocks', 'cat-002', 'Standard 8" Concrete Blocks (per unit)', 45.00, 0.16),
('prod-007', 'ELEC-001', 'Electrical Wire', 'cat-003', '2.5mm x 100m Copper Wire', 3200.00, 0.16),
('prod-008', 'ELEC-002', 'Light Switch', 'cat-003', 'Two-way Light Switch', 120.00, 0.16),
('prod-009', 'ELEC-003', 'Power Socket', 'cat-003', 'Double Power Socket Outlet', 150.00, 0.16),
('prod-010', 'PLUMB-001', 'PVC Pipe', 'cat-004', '3" PVC Pipe x 6m', 850.00, 0.16),
('prod-011', 'PLUMB-002', 'Water Tap', 'cat-004', 'Chrome Plated Water Tap', 450.00, 0.16),
('prod-012', 'PLUMB-003', 'Pipe Fitting', 'cat-004', 'PVC Elbow 3" Fitting', 80.00, 0.16),
('prod-013', 'PAINT-001', 'Interior Paint', 'cat-005', '5L Interior Emulsion Paint - White', 2800.00, 0.16),
('prod-014', 'PAINT-002', 'Exterior Paint', 'cat-005', '5L Exterior Oil Paint - Red', 3500.00, 0.16),
('prod-015', 'SAFE-001', 'Safety Helmet', 'cat-006', 'Hard Safety Helmet with Chin Strap', 350.00, 0.16),
('prod-016', 'SAFE-002', 'Work Gloves', 'cat-006', 'Leather Work Gloves (pair)', 220.00, 0.16),
('prod-017', 'SAFE-003', 'Safety Boots', 'cat-006', 'Steel-toe Safety Work Boots', 1800.00, 0.16),
('prod-018', 'SAFE-004', 'Face Mask', 'cat-006', 'N95 Face Mask (box of 50)', 450.00, 0.16)
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT INVENTORY (Stock per branch) =====
INSERT INTO public.inventory (id, product_id, branch_id, quantity, reorder_level) VALUES
-- Main Store
('inv-001', 'prod-001', 'branch-001', 45, 10),
('inv-002', 'prod-002', 'branch-001', 65, 15),
('inv-003', 'prod-003', 'branch-001', 12, 5),
('inv-004', 'prod-004', 'branch-001', 150, 50),
('inv-005', 'prod-005', 'branch-001', 80, 30),
('inv-006', 'prod-006', 'branch-001', 500, 100),
('inv-007', 'prod-007', 'branch-001', 25, 10),
('inv-008', 'prod-008', 'branch-001', 120, 30),
('inv-009', 'prod-009', 'branch-001', 100, 25),
('inv-010', 'prod-010', 'branch-001', 40, 15),
('inv-011', 'prod-011', 'branch-001', 85, 20),
('inv-012', 'prod-012', 'branch-001', 250, 50),
('inv-013', 'prod-013', 'branch-001', 30, 10),
('inv-014', 'prod-014', 'branch-001', 25, 8),
('inv-015', 'prod-015', 'branch-001', 60, 20),
('inv-016', 'prod-016', 'branch-001', 150, 40),
('inv-017', 'prod-017', 'branch-001', 35, 15),
('inv-018', 'prod-018', 'branch-001', 200, 50),
-- Westlands Branch
('inv-019', 'prod-001', 'branch-002', 35, 10),
('inv-020', 'prod-002', 'branch-002', 50, 15),
('inv-021', 'prod-003', 'branch-002', 8, 5),
('inv-022', 'prod-004', 'branch-002', 120, 50),
('inv-023', 'prod-005', 'branch-002', 60, 30),
('inv-024', 'prod-006', 'branch-002', 400, 100),
('inv-025', 'prod-007', 'branch-002', 20, 10),
('inv-026', 'prod-008', 'branch-002', 100, 30),
('inv-027', 'prod-009', 'branch-002', 80, 25),
('inv-028', 'prod-010', 'branch-002', 30, 15),
('inv-029', 'prod-011', 'branch-002', 70, 20),
('inv-030', 'prod-012', 'branch-002', 200, 50),
('inv-031', 'prod-013', 'branch-002', 25, 10),
('inv-032', 'prod-014', 'branch-002', 20, 8),
('inv-033', 'prod-015', 'branch-002', 50, 20),
('inv-034', 'prod-016', 'branch-002', 120, 40),
('inv-035', 'prod-017', 'branch-002', 25, 15),
('inv-036', 'prod-018', 'branch-002', 150, 50),
-- Nakuru Branch
('inv-037', 'prod-001', 'branch-003', 25, 10),
('inv-038', 'prod-002', 'branch-003', 35, 15),
('inv-039', 'prod-003', 'branch-003', 5, 5),
('inv-040', 'prod-004', 'branch-003', 80, 50),
('inv-041', 'prod-005', 'branch-003', 40, 30),
('inv-042', 'prod-006', 'branch-003', 300, 100),
('inv-043', 'prod-007', 'branch-003', 15, 10),
('inv-044', 'prod-008', 'branch-003', 80, 30),
('inv-045', 'prod-009', 'branch-003', 60, 25),
('inv-046', 'prod-010', 'branch-003', 25, 15),
('inv-047', 'prod-011', 'branch-003', 55, 20),
('inv-048', 'prod-012', 'branch-003', 150, 50),
('inv-049', 'prod-013', 'branch-003', 20, 10),
('inv-050', 'prod-014', 'branch-003', 15, 8),
('inv-051', 'prod-015', 'branch-003', 40, 20),
('inv-052', 'prod-016', 'branch-003', 100, 40),
('inv-053', 'prod-017', 'branch-003', 20, 15),
('inv-054', 'prod-018', 'branch-003', 120, 50)
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT STAFF MEMBERS =====
INSERT INTO public.staff (id, user_id, branch_id, position, hire_date, is_active) VALUES
('staff-001', '22222222-2222-2222-2222-222222222222', 'branch-001', 'Store Manager', NOW(), true),
('staff-002', '33333333-3333-3333-3333-333333333333', 'branch-001', 'Cashier', NOW(), true),
('staff-003', '44444444-4444-4444-4444-444444444444', 'branch-001', 'Cashier', NOW(), true),
('staff-004', '22222222-2222-2222-2222-222222222222', 'branch-002', 'Store Manager', NOW(), true),
('staff-005', '33333333-3333-3333-3333-333333333333', 'branch-002', 'Cashier', NOW(), true),
('staff-006', '22222222-2222-2222-2222-222222222222', 'branch-003', 'Store Manager', NOW(), true),
('staff-007', '44444444-4444-4444-4444-444444444444', 'branch-003', 'Cashier', NOW(), true)
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT PAYMENT METHODS =====
INSERT INTO public.payment_methods (id, method_name, requires_reference, is_active) VALUES
('pm-001', 'Cash', false, true),
('pm-002', 'Card', true, true),
('pm-003', 'Mobile Money', true, true),
('pm-004', 'Cheque', true, true)
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT LOYALTY TIERS =====
INSERT INTO public.loyalty_tiers (id, tier_name, min_points, max_points, discount_percentage, benefits) VALUES
('tier-001', 'Bronze', 0, 999, 0, 'Standard customer benefits'),
('tier-002', 'Silver', 1000, 4999, 5, '5% discount on all purchases, exclusive offers'),
('tier-003', 'Gold', 5000, 9999, 10, '10% discount on all purchases, priority support'),
('tier-004', 'Platinum', 10000, 999999, 15, '15% discount on all purchases, free shipping, VIP support')
ON CONFLICT (id) DO NOTHING;

-- ===== INSERT SAMPLE CUSTOMERS WITH LOYALTY =====
INSERT INTO public.customers (id, name, email, phone, branch_id, loyalty_tier_id, loyalty_points) VALUES
('cust-001', 'John Mukundi', 'john.mukundi@email.com', '+254 712 345 678', 'branch-001', 'tier-002', 1500),
('cust-002', 'Mary Kipchoge', 'mary.kipchoge@email.com', '+254 713 456 789', 'branch-001', 'tier-003', 6500),
('cust-003', 'Peter Ochieng', 'peter.ochieng@email.com', '+254 714 567 890', 'branch-002', 'tier-001', 250),
('cust-004', 'Grace Otieno', 'grace.otieno@email.com', '+254 715 678 901', 'branch-002', 'tier-002', 2300),
('cust-005', 'David Kamau', 'david.kamau@email.com', '+254 716 789 012', 'branch-003', 'tier-004', 15000)
ON CONFLICT (id) DO NOTHING;

COMMIT;
