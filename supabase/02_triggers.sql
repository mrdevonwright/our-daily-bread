-- ============================================================
-- Our Daily Bread — Database Setup
-- Step 2: Triggers (Auto-updating Stats)
-- ============================================================
-- Run AFTER 01_tables.sql
-- ============================================================

-- ============================================================
-- TRIGGER: Auto-create profile row when a user signs up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'baker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update baker's personal totals when a sale is logged
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_baker_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    loaves_sold  = loaves_sold + NEW.loaves_count,
    money_raised = money_raised + NEW.amount_raised,
    updated_at   = NOW()
  WHERE id = NEW.baker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_sale_logged
  AFTER INSERT ON public.sales_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_baker_totals();

-- ============================================================
-- TRIGGER: Update global stats when a sale is logged
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_global_stats_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.global_stats
  SET
    total_loaves = total_loaves + NEW.loaves_count,
    total_raised = total_raised + NEW.amount_raised,
    updated_at   = NOW()
  WHERE id = 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_sale_global_stats
  AFTER INSERT ON public.sales_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_global_stats_on_sale();

-- ============================================================
-- TRIGGER: Increment total_bakers when a profile is created
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_global_stats_on_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IN ('baker', 'church_admin') THEN
    UPDATE public.global_stats
    SET total_bakers = total_bakers + 1, updated_at = NOW()
    WHERE id = 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_global_stats_on_profile();

-- ============================================================
-- TRIGGER: Increment total_churches when a church is APPROVED
-- (fires only on the false → true transition)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_global_stats_on_church_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.approved = FALSE AND NEW.approved = TRUE THEN
    UPDATE public.global_stats
    SET total_churches = total_churches + 1, updated_at = NOW()
    WHERE id = 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_church_approved
  AFTER UPDATE ON public.churches
  FOR EACH ROW EXECUTE FUNCTION public.update_global_stats_on_church_approved();
