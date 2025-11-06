-- Ajouter la colonne "B2B ou B2C" aux tables Posts En Ligne
ALTER TABLE public."Posts En Ligne_bapt" 
ADD COLUMN "B2B_ou_B2C" TEXT;

ALTER TABLE public."Posts En Ligne_imrane" 
ADD COLUMN "B2B_ou_B2C" TEXT;