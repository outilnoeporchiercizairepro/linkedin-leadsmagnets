-- Enable Row Level Security on Posts table
ALTER TABLE public."Posts" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read posts (since this seems to be public content)
CREATE POLICY "Allow public read access to posts" 
ON public."Posts" 
FOR SELECT 
USING (true);

-- Also enable RLS on Leads Linkedin table for security
ALTER TABLE public."Leads Linkedin" ENABLE ROW LEVEL SECURITY;

-- Create policy for leads (this should probably be user-specific, but for now allowing read access)
CREATE POLICY "Allow public read access to leads" 
ON public."Leads Linkedin" 
FOR SELECT 
USING (true);
-- Create a single, scalable comments table linked to Posts
-- This replaces the need for per-post dynamic tables (safer, simpler for N8N)

-- 1) Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES public."Posts"(id) ON DELETE CASCADE,
  received_dm BOOLEAN DEFAULT FALSE,
  comment_date TIMESTAMPTZ,
  person_name TEXT,
  linkedin_title TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Index for performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments (post_id);

-- 3) Enable RLS and allow public read + insert (for N8N)
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_comments' AND policyname = 'Public can read post comments'
  ) THEN
    CREATE POLICY "Public can read post comments"
    ON public.post_comments
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_comments' AND policyname = 'Public can insert post comments'
  ) THEN
    CREATE POLICY "Public can insert post comments"
    ON public.post_comments
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;
-- Create a function to execute dynamic SQL for creating comment tables
CREATE OR REPLACE FUNCTION public.create_post_comments_table(post_id_param BIGINT)
RETURNS JSONB AS $$
DECLARE
  table_name TEXT;
  sql_statement TEXT;
BEGIN
  -- Generate table name
  table_name := 'post_comments_' || post_id_param::TEXT;
  
  -- Build SQL statement
  sql_statement := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL DEFAULT %L,
      received_dm BOOLEAN DEFAULT FALSE,
      comment_date TIMESTAMPTZ,
      person_name TEXT,
      linkedin_title TEXT,
      linkedin_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR SELECT
    USING (true);
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR INSERT
    WITH CHECK (true);
  ', 
  table_name, 
  post_id_param,
  table_name,
  'read_' || table_name, table_name,
  'read_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'insert_' || table_name, table_name
  );
  
  -- Execute the SQL
  EXECUTE sql_statement;
  
  -- Return success response
  RETURN json_build_object(
    'success', true,
    'table_name', table_name,
    'post_id', post_id_param
  );
EXCEPTION WHEN OTHERS THEN
  -- Return error response
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'table_name', table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.create_post_comments_table(post_id_param BIGINT)
RETURNS JSONB AS $$
DECLARE
  table_name TEXT;
  sql_statement TEXT;
BEGIN
  -- Generate table name
  table_name := 'post_comments_' || post_id_param::TEXT;
  
  -- Build SQL statement
  sql_statement := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT NOT NULL DEFAULT %L,
      received_dm BOOLEAN DEFAULT FALSE,
      comment_date TIMESTAMPTZ,
      person_name TEXT,
      linkedin_title TEXT,
      linkedin_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR SELECT
    USING (true);
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR INSERT
    WITH CHECK (true);
  ', 
  table_name, 
  post_id_param,
  table_name,
  'read_' || table_name, table_name,
  'read_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'insert_' || table_name, table_name
  );
  
  -- Execute the SQL
  EXECUTE sql_statement;
  
  -- Return success response
  RETURN json_build_object(
    'success', true,
    'table_name', table_name,
    'post_id', post_id_param
  );
EXCEPTION WHEN OTHERS THEN
  -- Return error response
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'table_name', table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- Allow public updates on Posts so the app can set table_exist = true
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'Posts' AND policyname = 'Allow public update posts'
  ) THEN
    CREATE POLICY "Allow public update posts"
    ON public."Posts"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
