-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  company_name text,
  company_logo_url text,
  brand_color text default '#0f172a',
  brand_accent text default '#3b82f6',
  website text,
  phone text,
  address text,
  bio text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  proposal_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clients (people you send proposals to)
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  email text,
  company text,
  website text,
  industry text,
  phone text,
  notes text,
  proposal_count integer not null default 0,
  total_value_cents bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposals
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  client_id uuid references public.clients on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('generating', 'draft', 'review', 'sent', 'accepted', 'declined', 'expired')),
  client_brief text,
  client_company text,
  client_name text,
  client_email text,

  -- Proposal content sections (stored as structured JSON)
  executive_summary text,
  understanding text,
  scope_of_work jsonb default '[]'::jsonb,
  deliverables jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  investment jsonb default '{"line_items": [], "total_cents": 0, "currency": "usd"}'::jsonb,
  terms text,
  about_us text,
  custom_sections jsonb default '[]'::jsonb,

  -- Metadata
  valid_until date,
  share_token text unique,
  share_enabled boolean not null default false,
  pdf_url text,
  template_id uuid,
  generation_metadata jsonb,

  -- Tracking
  sent_at timestamptz,
  viewed_at timestamptz,
  responded_at timestamptz,
  view_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Templates (reusable proposal structures)
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  description text,
  category text,
  is_default boolean not null default false,
  content jsonb not null,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Activity log (track proposal events)
create table public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  proposal_id uuid references public.proposals on delete cascade,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Row Level Security policies
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.proposals enable row level security;
alter table public.templates enable row level security;
alter table public.activity_log enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Clients: users can only CRUD their own clients
create policy "Users can view own clients" on public.clients for select using (auth.uid() = user_id);
create policy "Users can create clients" on public.clients for insert with check (auth.uid() = user_id);
create policy "Users can update own clients" on public.clients for update using (auth.uid() = user_id);
create policy "Users can delete own clients" on public.clients for delete using (auth.uid() = user_id);

-- Proposals: users can only CRUD their own proposals
create policy "Users can view own proposals" on public.proposals for select using (auth.uid() = user_id);
create policy "Users can create proposals" on public.proposals for insert with check (auth.uid() = user_id);
create policy "Users can update own proposals" on public.proposals for update using (auth.uid() = user_id);
create policy "Users can delete own proposals" on public.proposals for delete using (auth.uid() = user_id);
-- Public access for shared proposals
create policy "Anyone can view shared proposals" on public.proposals for select using (share_enabled = true and share_token is not null);

-- Templates: users can only CRUD their own templates
create policy "Users can view own templates" on public.templates for select using (auth.uid() = user_id);
create policy "Users can create templates" on public.templates for insert with check (auth.uid() = user_id);
create policy "Users can update own templates" on public.templates for update using (auth.uid() = user_id);
create policy "Users can delete own templates" on public.templates for delete using (auth.uid() = user_id);

-- Activity log: users can only view their own activity
create policy "Users can view own activity" on public.activity_log for select using (auth.uid() = user_id);
create policy "Users can create activity" on public.activity_log for insert with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger function
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger update_clients_updated_at before update on public.clients for each row execute function public.update_updated_at();
create trigger update_proposals_updated_at before update on public.proposals for each row execute function public.update_updated_at();
create trigger update_templates_updated_at before update on public.templates for each row execute function public.update_updated_at();

-- Indexes for performance
create index idx_clients_user_id on public.clients(user_id);
create index idx_proposals_user_id on public.proposals(user_id);
create index idx_proposals_client_id on public.proposals(client_id);
create index idx_proposals_status on public.proposals(status);
create index idx_proposals_share_token on public.proposals(share_token) where share_token is not null;
create index idx_templates_user_id on public.templates(user_id);
create index idx_activity_log_user_id on public.activity_log(user_id);
create index idx_activity_log_proposal_id on public.activity_log(proposal_id);
