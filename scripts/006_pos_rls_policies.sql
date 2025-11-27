-- =====================================================
-- POS System: Row Level Security Policies
-- =====================================================

-- BRANCHES - Allow users to see all branches
CREATE POLICY "branches_view_all" ON branches
  FOR SELECT USING (true);

CREATE POLICY "branches_manage" ON branches
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- PRODUCTS - Public product catalog
CREATE POLICY "products_view_all" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "products_manage" ON products
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- BRANCH_INVENTORY - Users can view their branch inventory
CREATE POLICY "branch_inventory_view" ON branch_inventory
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "branch_inventory_manage" ON branch_inventory
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
    OR auth.uid() IN (
      SELECT u.id FROM users u
      JOIN employees e ON u.id = e.user_id
      WHERE e.branch_id IN (
        SELECT branch_id FROM employees WHERE user_id = auth.uid()
      )
    )
  );

-- SUPPLIERS - Manage suppliers
CREATE POLICY "suppliers_view_all" ON suppliers
  FOR SELECT USING (true);

CREATE POLICY "suppliers_manage" ON suppliers
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- EMPLOYEES - Users can view employees in their branch
CREATE POLICY "employees_view" ON employees
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "employees_manage" ON employees
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- POS_TRANSACTIONS - Users can view and create transactions for their branch
CREATE POLICY "pos_transactions_view" ON pos_transactions
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "pos_transactions_insert" ON pos_transactions
  FOR INSERT WITH CHECK (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "pos_transactions_update" ON pos_transactions
  FOR UPDATE USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- POS_TRANSACTION_ITEMS - Associated with POS transactions
CREATE POLICY "pos_transaction_items_all" ON pos_transaction_items
  FOR ALL USING (
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

-- STOCK_MOVEMENTS - Audit trail, all users can view their branch
CREATE POLICY "stock_movements_view" ON stock_movements
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'managing_director')
    )
  );

CREATE POLICY "stock_movements_insert" ON stock_movements
  FOR INSERT WITH CHECK (
    branch_id IN (
      SELECT branch_id FROM employees WHERE user_id = auth.uid()
    )
  );

-- LOYALTY_PROGRAMS - User can manage their own loyalty data if they're staff
CREATE POLICY "loyalty_programs_view" ON loyalty_programs
  FOR SELECT USING (true);

-- REFUNDS - Manage refunds
CREATE POLICY "refunds_view" ON refunds
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

CREATE POLICY "refunds_manage" ON refunds
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
    OR pos_transaction_id IN (
      SELECT id FROM pos_transactions
      WHERE branch_id IN (
        SELECT branch_id FROM employees WHERE user_id = auth.uid()
      )
    )
  );
