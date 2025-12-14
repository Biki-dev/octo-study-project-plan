-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table (managed by Supabase Auth, but we'll reference it)
-- The auth.users table already exists, we'll create a profiles table

-- Create profiles table for extended user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Contents table (imported study materials)
create table if not exists public.contents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('text', 'pdf', 'url')),
  source_url text,
  raw_text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.contents enable row level security;

-- Contents policies
create policy "Users can view their own contents"
  on public.contents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own contents"
  on public.contents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contents"
  on public.contents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contents"
  on public.contents for delete
  using (auth.uid() = user_id);

-- Lessons table (AI-generated micro-lessons)
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid not null references public.contents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  bullets jsonb not null default '[]',
  explanation text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.lessons enable row level security;

-- Lessons policies
create policy "Users can view their own lessons"
  on public.lessons for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lessons"
  on public.lessons for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own lessons"
  on public.lessons for delete
  using (auth.uid() = user_id);

-- Cards table (quiz questions)
create table if not exists public.cards (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  card_type text not null check (card_type in ('mcq', 'short')),
  prompt text not null,
  choices jsonb, -- for MCQ: array of options
  answer jsonb not null, -- for MCQ: index, for short: text
  
  -- SRS fields
  ef float default 2.5, -- easiness factor
  interval integer default 1, -- days until next review
  reps integer default 0, -- number of successful reviews
  next_due timestamptz default now(),
  
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.cards enable row level security;

-- Cards policies
create policy "Users can view their own cards"
  on public.cards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cards"
  on public.cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cards"
  on public.cards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cards"
  on public.cards for delete
  using (auth.uid() = user_id);

-- Reviews table (track user answers)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  quality smallint not null check (quality >= 0 and quality <= 4),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Reviews policies
create policy "Users can view their own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists idx_contents_user_id on public.contents(user_id);
create index if not exists idx_lessons_content_id on public.lessons(content_id);
create index if not exists idx_lessons_user_id on public.lessons(user_id);
create index if not exists idx_cards_lesson_id on public.cards(lesson_id);
create index if not exists idx_cards_user_id on public.cards(user_id);
create index if not exists idx_cards_next_due on public.cards(next_due);
create index if not exists idx_reviews_card_id on public.reviews(card_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_contents_updated_at
  before update on public.contents
  for each row
  execute function public.handle_updated_at();
