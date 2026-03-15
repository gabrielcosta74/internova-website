-- =============================================================
-- 01_admin_panel_tables.sql
-- Run this in Supabase SQL Editor
-- =============================================================

-- 1. Site content overrides (admin edits copywriting here)
CREATE TABLE IF NOT EXISTS public.site_content (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section     TEXT NOT NULL,
  key         TEXT NOT NULL,
  value_pt    TEXT,
  value_en    TEXT,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_content"
  ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Allow public insert site_content"
  ON public.site_content FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update site_content"
  ON public.site_content FOR UPDATE USING (true);

CREATE POLICY "Allow public delete site_content"
  ON public.site_content FOR DELETE USING (true);


-- 2. Add status + notes columns to leads (for admin management)
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
