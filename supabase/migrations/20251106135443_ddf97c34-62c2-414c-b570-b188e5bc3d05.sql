-- Corriger l'association utilisateur → tables
-- Mettre à jour le user_type pour abdoul.imrane@outlook.fr
UPDATE public.profiles 
SET user_type = 'imrane' 
WHERE email = 'abdoul.imrane@outlook.fr';