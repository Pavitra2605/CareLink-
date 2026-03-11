-- ============================================================
-- CareLink AI — Supabase Schema for Chat, VLM & Symptom History
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Chat sessions (one per conversation)
create table if not exists chat_sessions (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  title         text default 'New Chat',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table chat_sessions enable row level security;
create policy "Users see own sessions"  on chat_sessions for select using (auth.uid() = user_id);
create policy "Users insert own sessions" on chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users update own sessions" on chat_sessions for update using (auth.uid() = user_id);
create policy "Users delete own sessions" on chat_sessions for delete using (auth.uid() = user_id);

-- 2. Chat messages (text + optional image URL)
create table if not exists chat_messages (
  id            uuid default gen_random_uuid() primary key,
  session_id    uuid references chat_sessions(id) on delete cascade not null,
  user_id       uuid references auth.users(id) on delete cascade not null,
  role          text check (role in ('user', 'assistant')) not null,
  content       text not null,
  image_url     text,                       -- Supabase Storage public URL (nullable)
  metadata      jsonb default '{}'::jsonb,   -- extra info (model_ready, etc.)
  created_at    timestamptz default now()
);
alter table chat_messages enable row level security;
create policy "Users see own messages"  on chat_messages for select using (auth.uid() = user_id);
create policy "Users insert own messages" on chat_messages for insert with check (auth.uid() = user_id);

-- 3. VLM scans (image analysis results)
create table if not exists vlm_scans (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  image_url     text,                       -- Supabase Storage URL
  question      text,
  analysis      text,                       -- raw VLM response
  findings      jsonb default '[]'::jsonb,  -- parsed [{severity, label, desc}]
  model_name    text,
  model_ready   boolean default false,
  created_at    timestamptz default now()
);
alter table vlm_scans enable row level security;
create policy "Users see own scans"  on vlm_scans for select using (auth.uid() = user_id);
create policy "Users insert own scans" on vlm_scans for insert with check (auth.uid() = user_id);

-- 4. Symptom checks (triage results)
create table if not exists symptom_checks (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users(id) on delete cascade not null,
  symptoms_text     text not null,
  symptoms_selected text[] default '{}',     -- array of symptom chips selected
  duration          text,
  answers           jsonb default '{}'::jsonb, -- clarifying question answers
  prediction        text,                     -- LOW / MEDIUM / HIGH
  confidence        real,
  probabilities     jsonb default '{}'::jsonb,
  rules_triggered   text[] default '{}',
  explanation       text,
  emergency_flag    boolean default false,
  escalated         boolean default false,
  model_version     text,
  request_id        text,
  created_at        timestamptz default now()
);
alter table symptom_checks enable row level security;
create policy "Users see own checks"  on symptom_checks for select using (auth.uid() = user_id);
create policy "Users insert own checks" on symptom_checks for insert with check (auth.uid() = user_id);

-- 5. Storage bucket for medical images (VLM photos)
-- Run this ONLY if the bucket doesn't exist yet:
insert into storage.buckets (id, name, public)
values ('medical-images', 'medical-images', true)
on conflict (id) do nothing;

-- Storage policy: users can upload to their own folder
create policy "Users upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: anyone can read (public bucket for display)
create policy "Public read medical images"
  on storage.objects for select
  using (bucket_id = 'medical-images');

-- Index for fast queries
create index if not exists idx_chat_sessions_user on chat_sessions(user_id, updated_at desc);
create index if not exists idx_chat_messages_session on chat_messages(session_id, created_at asc);
create index if not exists idx_vlm_scans_user on vlm_scans(user_id, created_at desc);
create index if not exists idx_symptom_checks_user on symptom_checks(user_id, created_at desc);
