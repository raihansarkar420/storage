export const SUPABASE_SQL_MIGRATION = `-- ==============================================================================
-- PERSONAL CLOUD STORAGE - SUPABASE DATABASE MIGRATION & RLS SCRIPT
-- ==============================================================================
-- Includes:
-- 1. Profiles Table & Auth User Triggers (Passwordless OTP / Magic link sync)
-- 2. Files & Folders Table (Hierarchy, Metadata, Parent-Child structure)
-- 3. File Transfers Audit Log Table
-- 4. Supabase Storage Bucket ('user_storage') Setup & Storage Policies
-- 5. Row Level Security (RLS) Policies for CRUD & Safe Ownership Transfer
-- 6. Recursive Functions for Folder Cascaded Deletion and Sub-tree Transfer
-- ==============================================================================

-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies:
-- Allow authenticated users to view profiles (needed to validate transfer recipients by email)
create policy "Allow authenticated users to read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Allow users to update their own profile
create policy "Allow users to update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Trigger to automatically create profile on sign up (Works with Magic Link / OTP)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. FILES & FOLDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null, -- MIME type or 'folder' or extension
  size bigint default 0 not null, -- Size in bytes (0 for folders)
  storage_path text, -- Path in Supabase storage bucket (null for folders)
  is_folder boolean default false not null,
  parent_id uuid references public.files(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete cascade not null,
  original_owner_email text, -- Retains original creator email if transferred
  is_transferred boolean default false not null,
  transferred_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for performance
create index if not exists idx_files_owner_id on public.files(owner_id);
create index if not exists idx_files_parent_id on public.files(parent_id);
create index if not exists idx_files_is_folder on public.files(is_folder);

-- Enable RLS on files
alter table public.files enable row level security;

-- Files RLS Policies:
-- A. View own files
create policy "Users can view their own files and folders"
  on public.files for select
  to authenticated
  using (auth.uid() = owner_id);

-- B. Insert files into own dashboard
create policy "Users can insert their own files and folders"
  on public.files for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- C. Update own files or transfer ownership
create policy "Users can update their own files and folders"
  on public.files for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (true);

-- D. Delete own files and folders (Cascades to child folders via parent_id foreign key)
create policy "Users can delete their own files and folders"
  on public.files for delete
  to authenticated
  using (auth.uid() = owner_id);


-- 3. TRANSFERS AUDIT LOG TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.transfers (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references public.files(id) on delete set null,
  file_name text not null,
  is_folder boolean default false not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  sender_email text not null,
  recipient_id uuid references auth.users(id) on delete cascade not null,
  recipient_email text not null,
  note text,
  transferred_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transfers enable row level security;

create policy "Users can view transfers where they are sender or recipient"
  on public.transfers for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can log new transfers"
  on public.transfers for insert
  to authenticated
  with check (auth.uid() = sender_id);


-- 4. RECURSIVE OWNERSHIP TRANSFER STORED PROCEDURE (RPC)
-- ------------------------------------------------------------------------------
-- Transfers a file or an entire folder tree (with all recursive subfolders & files)
-- to a recipient by recipient email address.
create or replace function public.transfer_item(
  p_item_id uuid,
  p_recipient_email text,
  p_note text default ''
)
returns json
language plpgsql
security definer
as $$
declare
  v_sender_id uuid;
  v_sender_email text;
  v_recipient_id uuid;
  v_item record;
  v_count int := 0;
begin
  -- Get current user ID
  v_sender_id := auth.uid();
  if v_sender_id is null then
    return json_build_object('success', false, 'error', 'Unauthorized');
  end if;

  -- Get sender email
  select email into v_sender_email from public.profiles where id = v_sender_id;

  -- Validate target recipient exists
  select id into v_recipient_id from public.profiles where lower(email) = lower(trim(p_recipient_email));
  if v_recipient_id is null then
    return json_build_object('success', false, 'error', 'Recipient email not registered in system');
  end if;

  if v_recipient_id = v_sender_id then
    return json_build_object('success', false, 'error', 'Cannot transfer item to yourself');
  end if;

  -- Check ownership of item
  select * into v_item from public.files where id = p_item_id and owner_id = v_sender_id;
  if v_item.id is null then
    return json_build_object('success', false, 'error', 'Item not found or you do not own it');
  end if;

  -- If it is a folder, recursively transfer all descendants
  if v_item.is_folder then
    with recursive folder_tree as (
      select id from public.files where id = p_item_id and owner_id = v_sender_id
      union all
      select f.id from public.files f
      inner join folder_tree ft on f.parent_id = ft.id
      where f.owner_id = v_sender_id
    )
    update public.files
    set
      owner_id = v_recipient_id,
      original_owner_email = coalesce(original_owner_email, v_sender_email),
      is_transferred = true,
      transferred_at = now(),
      updated_at = now(),
      -- Root of transferred folder will sit at recipient root level (parent_id = null)
      parent_id = case when id = p_item_id then null else parent_id end
    where id in (select id from folder_tree);

    get diagnostics v_count = row_count;
  else
    -- Single file transfer (relocate to recipient's root)
    update public.files
    set
      owner_id = v_recipient_id,
      original_owner_email = coalesce(original_owner_email, v_sender_email),
      is_transferred = true,
      transferred_at = now(),
      updated_at = now(),
      parent_id = null
    where id = p_item_id and owner_id = v_sender_id;

    v_count := 1;
  end if;

  -- Log the transfer in audit table
  insert into public.transfers (
    file_id,
    file_name,
    is_folder,
    sender_id,
    sender_email,
    recipient_id,
    recipient_email,
    note
  ) values (
    v_item.id,
    v_item.name,
    v_item.is_folder,
    v_sender_id,
    coalesce(v_sender_email, 'unknown'),
    v_recipient_id,
    trim(p_recipient_email),
    p_note
  );

  return json_build_object(
    'success', true,
    'message', 'Ownership transferred successfully',
    'items_transferred', v_count,
    'recipient_email', trim(p_recipient_email)
  );
end;
$$;


-- 5. SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES
-- ------------------------------------------------------------------------------
-- Create 'user_storage' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('user_storage', 'user_storage', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies:
-- A. Allow authenticated users to upload files to their own user directory: /<user_id>/*
create policy "Authenticated users can upload objects to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user_storage' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- B. Allow users to read objects they own or have public URL access
create policy "Users can read stored objects"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'user_storage');

-- C. Allow users to update objects in their own folder
create policy "Users can update their own storage objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user_storage' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- D. Allow users to delete objects in their own folder
create policy "Users can delete their own storage objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user_storage' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );
`;
