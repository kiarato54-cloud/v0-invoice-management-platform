-- Demo data for Invoice Management Platform
-- Run this after creating the schema to populate with sample data

-- Insert demo customers
INSERT INTO public.customers (id, name, email, phone, address, city, state, zip_code, country) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'billing@acme.com', '+1-555-0123', '123 Business Ave', 'New York', 'NY', '10001', 'US'),
('550e8400-e29b-41d4-a716-446655440002', 'Tech Solutions Inc', 'accounts@techsolutions.com', '+1-555-0124', '456 Innovation Dr', 'San Francisco', 'CA', '94105', 'US'),
('550e8400-e29b-41d4-a716-446655440003', 'Global Enterprises', 'finance@globalent.com', '+1-555-0125', '789 Corporate Blvd', 'Chicago', 'IL', '60601', 'US'),
('550e8400-e29b-41d4-a716-446655440004', 'StartUp Dynamics', 'billing@startupdyn.com', '+1-555-0126', '321 Venture St', 'Austin', 'TX', '73301', 'US'),
('550e8400-e29b-41d4-a716-446655440005', 'Creative Agency', 'payments@creativeagency.com', '+1-555-0127', '654 Design Way', 'Los Angeles', 'CA', '90210', 'US')
ON CONFLICT (id) DO NOTHING;

-- Note: You'll need to manually insert your user data after authentication
-- The invoices and related data will be inserted via the application once you have authenticated users

-- Insert demo invoice statuses and sample data structure
-- This creates the foundation for the invoice management system
