-- ============================================================
-- Our Daily Bread — Database Setup
-- Step 4: Enable Realtime for Live Ticker
-- ============================================================
-- Run AFTER 03_rls_policies.sql
-- ============================================================

-- Enable realtime publication for global_stats table
-- This allows the homepage ticker to update live when sales are logged.
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_stats;

-- Optional: also stream sales_logs for admin dashboards
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_logs;
