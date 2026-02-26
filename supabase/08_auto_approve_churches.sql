-- Migration: Auto-approve churches on creation
-- There is no super-admin approval flow, so churches should be approved by default.
-- This also approves any existing churches that were stuck as unapproved.

-- Approve all existing churches
UPDATE public.churches SET approved = TRUE WHERE approved = FALSE;

-- Change default so new signups are approved immediately
ALTER TABLE public.churches ALTER COLUMN approved SET DEFAULT TRUE;
