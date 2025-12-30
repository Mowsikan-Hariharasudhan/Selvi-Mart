-- Add variants column to products table to store multiple units/prices
ALTER TABLE public.products ADD COLUMN variants JSONB DEFAULT '[]'::jsonb;
