-- Add contact fields to profiles
-- Run this in Supabase SQL editor: https://app.supabase.com → SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;
