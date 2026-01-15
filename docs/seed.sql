begin;

-- Rooms
with room_rows as (
  insert into public.rooms (name, area, access_note, sort_order, is_active)
  values
    ('Room A', 'Shibuya', '5 min walk from Shibuya station', 1, true),
    ('Room B', 'Ebisu', '7 min walk from Ebisu station', 2, true)
  on conflict (name) do update
    set
      area = excluded.area,
      access_note = excluded.access_note,
      sort_order = excluded.sort_order,
      is_active = excluded.is_active
  returning id, name
),
-- Therapists
therapist_rows as (
  insert into public.therapists (
    name,
    slug,
    profile_text,
    tags,
    sns_urls,
    is_newface,
    is_active,
    sort_order
  )
  values
    (
      'Ayaka',
      'ayaka',
      'Gentle and attentive therapy with a calm atmosphere.',
      array['calm','relax'],
      jsonb_build_object('instagram', 'https://instagram.com/example_ayaka'),
      true,
      true,
      1
    ),
    (
      'Rina',
      'rina',
      'Deep tissue focus with a smooth flow.',
      array['deep','smooth'],
      jsonb_build_object('x', 'https://x.com/example_rina'),
      false,
      true,
      2
    ),
    (
      'Miyu',
      'miyu',
      'Bright energy and uplifting session.',
      array['bright','friendly'],
      jsonb_build_object('instagram', 'https://instagram.com/example_miyu'),
      false,
      true,
      3
    ),
    (
      'Saki',
      'saki',
      'Balanced care with gentle pressure.',
      array['balance','gentle'],
      jsonb_build_object('line', 'https://line.me/R/ti/p/example_saki'),
      true,
      true,
      4
    ),
    (
      'Noa',
      'noa',
      'Premium relaxation with careful attention.',
      array['premium','relax'],
      jsonb_build_object('x', 'https://x.com/example_noa'),
      false,
      true,
      5
    )
  on conflict (slug) do update
    set
      name = excluded.name,
      profile_text = excluded.profile_text,
      tags = excluded.tags,
      sns_urls = excluded.sns_urls,
      is_newface = excluded.is_newface,
      is_active = excluded.is_active,
      sort_order = excluded.sort_order
  returning id, name
),
-- Courses
course_rows as (
  insert into public.courses (
    name,
    duration_min,
    price,
    sort_order,
    is_active
  )
  values
    ('Standard 60', 60, 12000, 1, true),
    ('Relax 90', 90, 17000, 2, true),
    ('Premium 120', 120, 22000, 3, true),
    ('Luxury 150', 150, 28000, 4, true)
  on conflict (name) do update
    set
      duration_min = excluded.duration_min,
      price = excluded.price,
      sort_order = excluded.sort_order,
      is_active = excluded.is_active
  returning id
),
-- Shifts: replace only seed rows
delete from public.shifts where note = 'seed';

-- Shifts: today + next 6 days
shift_rows as (
  select
    t.id as therapist_id,
    r.id as room_id,
    (date_trunc('day', now()) + (d * interval '1 day') + interval '12 hours') as start_at,
    (date_trunc('day', now()) + (d * interval '1 day') + interval '15 hours') as end_at
  from therapist_rows t
  cross join room_rows r
  cross join generate_series(0, 6) as d
  where (t.name, r.name) in (
    ('Ayaka', 'Room A'),
    ('Rina', 'Room B'),
    ('Miyu', 'Room A'),
    ('Saki', 'Room B'),
    ('Noa', 'Room A')
  )
)
insert into public.shifts (
  id,
  therapist_id,
  room_id,
  start_at,
  end_at,
  note,
  is_active
)
select
  gen_random_uuid(),
  therapist_id,
  room_id,
  start_at,
  end_at,
  'seed',
  true
from shift_rows;

-- Site settings (singleton)
update public.site_settings
set
  global_booking_url = 'https://booking.example.com',
  line_url = 'https://line.me/R/ti/p/example',
  x_url = 'https://x.com/example_store',
  instagram_url = 'https://instagram.com/example_store',
  notice_text = 'External booking only. Please reserve via the booking link.'
where id = (
  select id
  from public.site_settings
  order by created_at
  limit 1
);

commit;
