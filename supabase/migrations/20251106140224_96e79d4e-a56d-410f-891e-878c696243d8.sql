-- Modifier la fonction pour créer les tables de commentaires avec suffixe utilisateur
DROP FUNCTION IF EXISTS public.create_post_comments_table(bigint);

CREATE OR REPLACE FUNCTION public.create_post_comments_table(post_id_param bigint, user_type_param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  table_name TEXT;
  sql_statement TEXT;
BEGIN
  -- Generate table name with user type suffix
  table_name := 'post_comments_' || post_id_param::TEXT || '_' || user_type_param;
  
  -- Build SQL statement avec la même structure que post_comments_1
  sql_statement := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id_comment_primary TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
      linkedin_id TEXT NOT NULL,
      person_name TEXT,
      linkedin_title TEXT,
      linkedin_url TEXT,
      comment_date TIMESTAMPTZ,
      received_dm BOOLEAN DEFAULT FALSE,
      connection_request_statut BOOLEAN,
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
    
    DROP POLICY IF EXISTS %I ON public.%I;
    CREATE POLICY %I
    ON public.%I
    FOR UPDATE
    USING (true);
  ', 
  table_name,
  table_name,
  'read_' || table_name, table_name,
  'read_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'insert_' || table_name, table_name,
  'update_' || table_name, table_name,
  'update_' || table_name, table_name
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
$function$;