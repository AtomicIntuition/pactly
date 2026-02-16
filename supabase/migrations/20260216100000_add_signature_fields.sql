ALTER TABLE public.proposals
  ADD COLUMN signature_name text,
  ADD COLUMN signature_ip text,
  ADD COLUMN signed_at timestamptz;
