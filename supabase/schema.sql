create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Scholar',
  email text not null default '',
  school text,
  grade text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now()
);

create table if not exists public.academic_reports (
  id uuid primary key default gen_random_uuid(),
  scholar_id uuid not null references public.profiles(id) on delete cascade,
  file_path text,
  mean_score numeric(5,2),
  subjects_count integer not null default 0,
  submitted_at timestamptz not null default now()
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'general-scholars',
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Scholar',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists announcements_published_at_idx on public.announcements (published_at desc);
create index if not exists academic_reports_scholar_idx on public.academic_reports (scholar_id, submitted_at desc);
create index if not exists community_messages_channel_idx on public.community_messages (channel, created_at desc);

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.academic_reports enable row level security;
alter table public.community_messages enable row level security;

drop policy if exists "profiles are readable by signed-in users" on public.profiles;
create policy "profiles are readable by signed-in users" on public.profiles for select to authenticated using (true);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "announcements are readable by signed-in users" on public.announcements;
create policy "announcements are readable by signed-in users" on public.announcements for select to authenticated using (true);

drop policy if exists "users can read their own academic reports" on public.academic_reports;
create policy "users can read their own academic reports" on public.academic_reports for select to authenticated using (auth.uid() = scholar_id);

drop policy if exists "users can create their own academic reports" on public.academic_reports;
create policy "users can create their own academic reports" on public.academic_reports for insert to authenticated with check (auth.uid() = scholar_id);

drop policy if exists "signed-in users can read community messages" on public.community_messages;
create policy "signed-in users can read community messages" on public.community_messages for select to authenticated using (true);

drop policy if exists "signed-in users can create community messages" on public.community_messages;
create policy "signed-in users can create community messages" on public.community_messages for insert to authenticated with check (auth.uid() = author_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Scholar'), coalesce(new.email, ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
