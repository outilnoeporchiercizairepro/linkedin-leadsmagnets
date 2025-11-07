-- Ajouter le champ message_prefait aux tables Posts En Ligne
ALTER TABLE public."Posts En Ligne_bapt" 
ADD COLUMN IF NOT EXISTS message_prefait TEXT;

ALTER TABLE public."Posts En Ligne_imrane" 
ADD COLUMN IF NOT EXISTS message_prefait TEXT;