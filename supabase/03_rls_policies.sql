-- ============================================================
-- Our Daily Bread — Database Setup
-- Step 3: Row Level Security (RLS) Policies
-- ============================================================
-- Run AFTER 02_triggers.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_stats     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can read profiles (baker directory)
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles_own_update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- The DB trigger uses SECURITY DEFINER so it bypasses RLS for inserts

-- ============================================================
-- CHURCHES
-- ============================================================
-- Anyone can view approved churches (needed for baker signup dropdown)
CREATE POLICY "churches_approved_read"
  ON public.churches FOR SELECT USING (approved = TRUE);

-- Authenticated users can create a church (pending approval)
CREATE POLICY "churches_authenticated_insert"
  ON public.churches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Church admins can update their own church record
CREATE POLICY "churches_admin_update"
  ON public.churches FOR UPDATE USING (auth.uid() = admin_id);

-- ============================================================
-- SALES LOGS
-- ============================================================
-- Bakers can only see their own sales
CREATE POLICY "sales_baker_read_own"
  ON public.sales_logs FOR SELECT
  USING (auth.uid() = baker_id);

-- Church admins can see all sales for their church
CREATE POLICY "sales_church_admin_read"
  ON public.sales_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = sales_logs.church_id
        AND churches.admin_id = auth.uid()
    )
  );

-- Bakers can insert their own sales
CREATE POLICY "sales_baker_insert"
  ON public.sales_logs FOR INSERT
  WITH CHECK (auth.uid() = baker_id);

-- ============================================================
-- GLOBAL STATS
-- ============================================================
-- Anyone can read (powers the public ticker on the homepage)
CREATE POLICY "global_stats_public_read"
  ON public.global_stats FOR SELECT USING (TRUE);

-- ============================================================
-- BLOG POSTS
-- ============================================================
-- Anyone can read published posts
CREATE POLICY "blog_published_read"
  ON public.blog_posts FOR SELECT USING (published = TRUE);

-- Only super_admin can create/edit/delete posts
CREATE POLICY "blog_admin_write"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
-- Anyone can submit a contact message (unauthenticated is fine)
CREATE POLICY "contact_public_insert"
  ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- Only super_admin can read messages
CREATE POLICY "contact_admin_read"
  ON public.contact_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================================
-- STORY SUBMISSIONS
-- ============================================================
-- Anyone can submit a story
CREATE POLICY "stories_public_insert"
  ON public.story_submissions FOR INSERT WITH CHECK (TRUE);

-- Anyone can read approved stories (for the social page)
CREATE POLICY "stories_approved_read"
  ON public.story_submissions FOR SELECT USING (approved = TRUE);

-- Super_admin can manage all stories
CREATE POLICY "stories_admin_all"
  ON public.story_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
