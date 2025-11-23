-- Fix RLS policies to require authentication and enforce user_type separation

-- ============================================
-- PROFILES TABLE - Keep existing policies
-- ============================================
-- (No changes needed - already has proper policies)

-- ============================================
-- LEADS LINKEDIN TABLES - Fix overly permissive policies
-- ============================================

-- Drop existing overly permissive policies for Leads Linkedin_bapt
DROP POLICY IF EXISTS "Allow public read access to leads" ON "Leads Linkedin_bapt";
DROP POLICY IF EXISTS "Allow delete access to leads" ON "Leads Linkedin_bapt";
DROP POLICY IF EXISTS "Allow insert access to leads" ON "Leads Linkedin_bapt";
DROP POLICY IF EXISTS "Allow update access to leads" ON "Leads Linkedin_bapt";

-- Create secure policies for Leads Linkedin_bapt
CREATE POLICY "Bapt users can view their leads"
ON "Leads Linkedin_bapt" 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can insert their leads"
ON "Leads Linkedin_bapt" 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can update their leads"
ON "Leads Linkedin_bapt" 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can delete their leads"
ON "Leads Linkedin_bapt" 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

-- Drop existing overly permissive policies for Leads Linkedin_imrane
DROP POLICY IF EXISTS "Allow all on Leads Linkedin_imrane" ON "Leads Linkedin_imrane";

-- Create secure policies for Leads Linkedin_imrane
CREATE POLICY "Imrane users can access their leads"
ON "Leads Linkedin_imrane" 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

-- ============================================
-- POSTS EN LIGNE TABLES
-- ============================================

-- Drop existing overly permissive policies for Posts En Ligne_bapt
DROP POLICY IF EXISTS "Allow public read access to posts" ON "Posts En Ligne_bapt";
DROP POLICY IF EXISTS "Allow delete access to posts" ON "Posts En Ligne_bapt";
DROP POLICY IF EXISTS "Allow insert access to posts" ON "Posts En Ligne_bapt";
DROP POLICY IF EXISTS "Allow public update posts" ON "Posts En Ligne_bapt";

-- Create secure policies for Posts En Ligne_bapt
CREATE POLICY "Bapt users can access their posts"
ON "Posts En Ligne_bapt" 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

-- Drop existing overly permissive policies for Posts En Ligne_imrane
DROP POLICY IF EXISTS "Allow all on Posts En Ligne_imrane" ON "Posts En Ligne_imrane";

-- Create secure policies for Posts En Ligne_imrane
CREATE POLICY "Imrane users can access their posts"
ON "Posts En Ligne_imrane" 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

-- ============================================
-- COMPETITORS TABLES
-- ============================================

-- Drop existing overly permissive policies for competitors_bapt
DROP POLICY IF EXISTS "Allow public read access to competitors" ON competitors_bapt;
DROP POLICY IF EXISTS "Allow delete access to competitors" ON competitors_bapt;
DROP POLICY IF EXISTS "Allow insert access to competitors" ON competitors_bapt;
DROP POLICY IF EXISTS "Allow update access to competitors" ON competitors_bapt;

-- Create secure policies for competitors_bapt
CREATE POLICY "Bapt users can access their competitors"
ON competitors_bapt 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

-- Drop existing overly permissive policies for competitors_imrane
DROP POLICY IF EXISTS "Allow all on competitors_imrane" ON competitors_imrane;

-- Create secure policies for competitors_imrane
CREATE POLICY "Imrane users can access their competitors"
ON competitors_imrane 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

-- ============================================
-- COMPETITOR_POSTS TABLES
-- ============================================

-- Drop existing overly permissive policies for competitor_posts_bapt
DROP POLICY IF EXISTS "Allow public read access to competitor posts" ON competitor_posts_bapt;
DROP POLICY IF EXISTS "Allow delete access to competitor posts" ON competitor_posts_bapt;
DROP POLICY IF EXISTS "Allow insert access to competitor posts" ON competitor_posts_bapt;
DROP POLICY IF EXISTS "Allow update access to competitor posts" ON competitor_posts_bapt;

-- Create secure policies for competitor_posts_bapt
CREATE POLICY "Bapt users can access their competitor posts"
ON competitor_posts_bapt 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

-- Drop existing overly permissive policies for competitor_posts_imrane
DROP POLICY IF EXISTS "Allow all on competitor_posts_imrane" ON competitor_posts_imrane;

-- Create secure policies for competitor_posts_imrane
CREATE POLICY "Imrane users can access their competitor posts"
ON competitor_posts_imrane 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);