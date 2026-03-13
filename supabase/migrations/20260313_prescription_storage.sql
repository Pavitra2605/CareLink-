-- ============================================================
-- CareLink — Prescription Storage Feature
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. User-uploaded prescriptions table
create table if not exists user_prescriptions (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  title           text not null,                          -- e.g. "Dr. Sharma – 12 Jan 2025"
  doctor_name     text,                                   -- optional
  hospital_name   text,                                   -- optional
  prescription_date date,                                 -- optional date on the prescription
  image_url       text,                                   -- Supabase Storage public URL
  notes           text,                                   -- user-added notes
  tags            text[] default '{}',                    -- e.g. ['diabetes', 'chronic']
  is_active       boolean default true,                   -- false = archived
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table user_prescriptions enable row level security;

drop policy if exists "Users see own prescriptions" on user_prescriptions;
create policy "Users see own prescriptions"
  on user_prescriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own prescriptions" on user_prescriptions;
create policy "Users insert own prescriptions"
  on user_prescriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own prescriptions" on user_prescriptions;
create policy "Users update own prescriptions"
  on user_prescriptions for update
  using (auth.uid() = user_id);

drop policy if exists "Users delete own prescriptions" on user_prescriptions;
create policy "Users delete own prescriptions"
  on user_prescriptions for delete
  using (auth.uid() = user_id);

-- Index for fast queries
create index if not exists idx_user_prescriptions_user
  on user_prescriptions(user_id, created_at desc);

-- 2. Storage bucket for prescription images (separate from medical-images)
insert into storage.buckets (id, name, public)
values ('prescription-images', 'prescription-images', true)
on conflict (id) do nothing;

-- Storage policy: users can only upload to their own subfolder
drop policy if exists "Users upload own prescription images" on storage.objects;
create policy "Users upload own prescription images"
  on storage.objects for insert
  with check (
    bucket_id = 'prescription-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: users can update their own prescription images
drop policy if exists "Users update own prescription images" on storage.objects;
create policy "Users update own prescription images"
  on storage.objects for update
  using (
    bucket_id = 'prescription-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: users can delete their own prescription images
drop policy if exists "Users delete own prescription images" on storage.objects;
create policy "Users delete own prescription images"
  on storage.objects for delete
  using (
    bucket_id = 'prescription-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: anyone can read (public bucket for display)
drop policy if exists "Public read prescription images" on storage.objects;
create policy "Public read prescription images"
  on storage.objects for select
  using (bucket_id = 'prescription-images');
