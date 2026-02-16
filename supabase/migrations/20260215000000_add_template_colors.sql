-- Add template color columns to proposals
-- Colors are stored at creation time so they persist even if the template changes

ALTER TABLE public.proposals
  ALTER COLUMN template_id TYPE text USING template_id::text;

ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS template_color_primary text,
  ADD COLUMN IF NOT EXISTS template_color_accent text;
