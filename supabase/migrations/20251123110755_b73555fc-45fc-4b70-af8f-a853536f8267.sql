-- Fix RLS policies to allow N8N (service role) to insert data
-- The previous policies only worked for authenticated users, not service role

-- ============================================
-- POSTS EN LIGNE TABLES - Allow service role inserts
-- ============================================

-- Drop the overly restrictive policy for Posts En Ligne_imrane
DROP POLICY IF EXISTS "Imrane users can access their posts" ON "Posts En Ligne_imrane";

-- Create separate policies for different operations on Posts En Ligne_imrane
-- Allow service role (N8N) to insert
CREATE POLICY "Allow service role to insert posts for imrane"
ON "Posts En Ligne_imrane" 
FOR INSERT 
WITH CHECK (true);  -- Service role bypasses this anyway, but explicit for clarity

-- Allow authenticated imrane users to read/update/delete
CREATE POLICY "Imrane users can view their posts"
ON "Posts En Ligne_imrane" 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can update their posts"
ON "Posts En Ligne_imrane" 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can delete their posts"
ON "Posts En Ligne_imrane" 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

-- Same fix for Posts En Ligne_bapt
DROP POLICY IF EXISTS "Bapt users can access their posts" ON "Posts En Ligne_bapt";

CREATE POLICY "Allow service role to insert posts for bapt"
ON "Posts En Ligne_bapt" 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bapt users can view their posts"
ON "Posts En Ligne_bapt" 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can update their posts"
ON "Posts En Ligne_bapt" 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can delete their posts"
ON "Posts En Ligne_bapt" 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

-- ============================================
-- COMPETITORS TABLES - Allow service role inserts
-- ============================================

DROP POLICY IF EXISTS "Bapt users can access their competitors" ON competitors_bapt;

CREATE POLICY "Allow service role to insert competitors for bapt"
ON competitors_bapt 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bapt users can view their competitors"
ON competitors_bapt 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can update their competitors"
ON competitors_bapt 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can delete their competitors"
ON competitors_bapt 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

DROP POLICY IF EXISTS "Imrane users can access their competitors" ON competitors_imrane;

CREATE POLICY "Allow service role to insert competitors for imrane"
ON competitors_imrane 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Imrane users can view their competitors"
ON competitors_imrane 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can update their competitors"
ON competitors_imrane 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can delete their competitors"
ON competitors_imrane 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

-- ============================================
-- COMPETITOR POSTS TABLES - Allow service role inserts
-- ============================================

DROP POLICY IF EXISTS "Bapt users can access their competitor posts" ON competitor_posts_bapt;

CREATE POLICY "Allow service role to insert competitor posts for bapt"
ON competitor_posts_bapt 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bapt users can view their competitor posts"
ON competitor_posts_bapt 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can update their competitor posts"
ON competitor_posts_bapt 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

CREATE POLICY "Bapt users can delete their competitor posts"
ON competitor_posts_bapt 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'bapt'
  )
);

DROP POLICY IF EXISTS "Imrane users can access their competitor posts" ON competitor_posts_imrane;

CREATE POLICY "Allow service role to insert competitor posts for imrane"
ON competitor_posts_imrane 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Imrane users can view their competitor posts"
ON competitor_posts_imrane 
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can update their competitor posts"
ON competitor_posts_imrane 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);

CREATE POLICY "Imrane users can delete their competitor posts"
ON competitor_posts_imrane 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'imrane'
  )
);