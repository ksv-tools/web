-- Chạy một lần trong Supabase: SQL Editor → New query → dán toàn bộ file này → Run.
-- Hai bảng bật RLS và không có policy nào: trình duyệt không đọc/ghi trực tiếp được,
-- chỉ máy chủ của web (dùng khóa service role) mới truy cập.

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  full_name     text,
  avatar_url    text,
  provider      text,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'locked')),
  daily_quota   integer check (daily_quota is null or daily_quota >= 0),
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz
);

create table if not exists public.downloads (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  tool        text not null,
  version     text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists downloads_user_time on public.downloads (user_id, created_at desc);
create index if not exists downloads_time on public.downloads (created_at desc);

alter table public.profiles enable row level security;
alter table public.downloads enable row level security;

-- Tạo hồ sơ (trạng thái chờ duyệt) ngay khi có người đăng nhập lần đầu.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    new.raw_app_meta_data ->> 'provider'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
