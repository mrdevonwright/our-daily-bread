-- ============================================================
-- Our Daily Bread — Database Setup
-- Step 1: Core Tables
-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CHURCHES
-- ============================================================
CREATE TABLE public.churches (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  denomination  TEXT,
  address       TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL CHECK (LENGTH(state) = 2),
  zip           TEXT,
  website       TEXT,
  admin_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved      BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- PROFILES (extends auth.users — one row per user)
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'baker'
                  CHECK (role IN ('baker', 'church_admin', 'super_admin')),
  church_id     UUID REFERENCES public.churches(id) ON DELETE SET NULL,
  bio           TEXT,
  avatar_url    TEXT,
  loaves_sold   INTEGER DEFAULT 0 NOT NULL,
  money_raised  NUMERIC(10,2) DEFAULT 0 NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SALES LOGS
-- ============================================================
CREATE TABLE public.sales_logs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  baker_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  church_id     UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  loaves_count  INTEGER NOT NULL CHECK (loaves_count > 0),
  amount_raised NUMERIC(10,2) NOT NULL CHECK (amount_raised >= 0),
  notes         TEXT,
  sold_at       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- GLOBAL STATS (single-row table — powers the live ticker)
-- ============================================================
CREATE TABLE public.global_stats (
  id             INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_churches INTEGER DEFAULT 0 NOT NULL,
  total_bakers   INTEGER DEFAULT 0 NOT NULL,
  total_loaves   INTEGER DEFAULT 0 NOT NULL,
  total_raised   NUMERIC(12,2) DEFAULT 0 NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert the one and only row
INSERT INTO public.global_stats (id) VALUES (1);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE public.blog_posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  cover_image  TEXT,
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published    BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE public.contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- STORY SUBMISSIONS (social page)
-- ============================================================
CREATE TABLE public.story_submissions (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name         TEXT NOT NULL,
  church_name  TEXT,
  story        TEXT NOT NULL,
  photo_url    TEXT,
  approved     BOOLEAN DEFAULT FALSE,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
