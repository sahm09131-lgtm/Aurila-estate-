-- Demo and initial schema for Aurelia Estates. Review and adapt policies before production.
create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('buyer','seller','agent','admin','super_admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  preferred_locale text not null default 'en',
  role_id uuid references public.roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission text not null,
  unique(role_id, permission)
);
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  display_name text not null,
  bio text,
  email text,
  phone text,
  active boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text not null default '',
  property_type text not null check (property_type in ('villa','apartment','townhouse','land','other')),
  listing_type text not null check (listing_type in ('sale','rent')),
  status text not null default 'pending' check (status in ('draft','pending','approved','rejected','sold','leased')),
  price numeric(14,2) not null check (price >= 0),
  currency char(3) not null default 'EUR',
  bedrooms smallint not null default 0 check (bedrooms >= 0),
  bathrooms smallint not null default 0 check (bathrooms >= 0),
  area_sqm numeric(10,2) check (area_sqm is null or area_sqm > 0),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists properties_public_search_idx on public.properties(status, listing_type, property_type, price);
create index if not exists properties_location_idx on public.properties(location_id);
create table if not exists public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.property_features (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  feature text not null,
  unique(property_id, feature)
);
create table if not exists public.property_inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  requester_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new','contacted','qualified','viewing_scheduled','negotiation','won','lost')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inquiries_created_idx on public.property_inquiries(created_at desc);
create table if not exists public.saved_properties (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(profile_id, property_id)
);
create table if not exists public.property_comparisons (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(profile_id, property_id)
);
create table if not exists public.viewing_appointments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  requester_id uuid references public.profiles(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists appointments_agent_time_idx on public.viewing_appointments(agent_id, starts_at, ends_at);
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid unique references public.property_inquiries(id) on delete set null,
  assigned_agent uuid references public.agents(id) on delete set null,
  status text not null default 'new' check (status in ('new','contacted','qualified','viewing_scheduled','negotiation','won','lost')),
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  locale text not null default 'en',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger properties_touch before update on public.properties for each row execute function public.touch_updated_at();
create trigger inquiries_touch before update on public.property_inquiries for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();

-- Role lookup runs with a fixed search_path and only reveals the caller's own assigned role.
create or replace function public.has_role(required_role text) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.profiles p join public.roles r on r.id = p.role_id where p.id = auth.uid() and r.name = required_role)
$$;
revoke all on function public.has_role(text) from public;
grant execute on function public.has_role(text) to authenticated;

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.permissions enable row level security;
alter table public.locations enable row level security;
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.property_features enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.saved_properties enable row level security;
alter table public.property_comparisons enable row level security;
alter table public.viewing_appointments enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.notifications enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy "public read roles" on public.roles for select to anon, authenticated using (true);
create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role('admin') or public.has_role('super_admin'));
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.has_role('admin') or public.has_role('super_admin')) with check (public.has_role('admin') or public.has_role('super_admin'));
create policy "public read locations" on public.locations for select to anon, authenticated using (true);
create policy "public read active agents" on public.agents for select to anon, authenticated using (active = true);
create policy "public read approved properties" on public.properties for select to anon, authenticated using (status = 'approved');
create policy "owners read own properties" on public.properties for select to authenticated using (owner_id = auth.uid() or public.has_role('admin') or public.has_role('super_admin'));
create policy "owners submit properties" on public.properties for insert to authenticated with check (owner_id = auth.uid() and status in ('draft','pending'));
create policy "owners update pending properties" on public.properties for update to authenticated using (owner_id = auth.uid() and status in ('draft','pending','rejected')) with check (owner_id = auth.uid() and status in ('draft','pending'));
create policy "admins manage properties" on public.properties for all to authenticated using (public.has_role('admin') or public.has_role('super_admin')) with check (public.has_role('admin') or public.has_role('super_admin'));
create policy "public read media of approved listings" on public.property_media for select to anon, authenticated using (exists(select 1 from public.properties p where p.id=property_id and p.status='approved'));
create policy "public read features of approved listings" on public.property_features for select to anon, authenticated using (exists(select 1 from public.properties p where p.id=property_id and p.status='approved'));
create policy "users manage own saved" on public.saved_properties for all to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());
create policy "users manage own comparisons" on public.property_comparisons for all to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());
create policy "users read own appointments" on public.viewing_appointments for select to authenticated using (requester_id=auth.uid() or public.has_role('admin') or public.has_role('super_admin'));
create policy "users request own appointments" on public.viewing_appointments for insert to authenticated with check (requester_id=auth.uid() and status='pending');
create policy "private inquiries" on public.property_inquiries for select to authenticated using (public.has_role('agent') or public.has_role('admin') or public.has_role('super_admin'));
create policy "users read own notifications" on public.notifications for select to authenticated using (profile_id=auth.uid() or public.has_role('admin') or public.has_role('super_admin'));
create policy "users update own notifications" on public.notifications for update to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());
create policy "public read published articles" on public.articles for select to anon, authenticated using (status='published');
create policy "public read safe settings" on public.site_settings for select to anon, authenticated using (key like 'public.%');
create policy "admins read leads" on public.leads for select to authenticated using (public.has_role('agent') or public.has_role('admin') or public.has_role('super_admin'));
create policy "admins read lead activities" on public.lead_activities for select to authenticated using (public.has_role('agent') or public.has_role('admin') or public.has_role('super_admin'));
create policy "admins read audit logs" on public.audit_logs for select to authenticated using (public.has_role('admin') or public.has_role('super_admin'));

-- No anonymous write policies are enabled. Public inquiry creation requires a protected server-side
-- integration with rate limiting, spam controls, and an explicitly configured provider.
insert into public.roles(name) values ('buyer'),('seller'),('agent'),('admin'),('super_admin') on conflict(name) do nothing;
