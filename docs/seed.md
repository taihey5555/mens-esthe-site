## Seed data instructions

1) Open Supabase Dashboard > SQL Editor
2) Paste and run `docs/seed.sql`

## Notes

- Do not delete production data in bulk; this seed uses upserts for rooms/therapists/courses.
- Shifts are replaced only when `note = 'seed'`.

## Verify after seeding

- `/` Header booking button shows the global booking URL
- `/therapists` List shows 5 therapists
- `/schedule` Upcoming shifts are visible
- `/pricing` Courses list shows 4 items
- `/access` Rooms list shows 2 rooms
- `/admin` Dashboard counts are updated
- `/admin/therapists` CRUD works and reflects on public list
- `/admin/courses` CRUD works and reflects on pricing page
- `/admin/shifts` CRUD works and reflects on schedule page
- `/admin/settings` Save global booking URL and SNS links
