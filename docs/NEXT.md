# NEXT (mens-esthe-site)

## Current status
- Deploy: ✅ Vercel Production Ready
- Public pages: ✅ Top / therapists / schedule / pricing / access / recruit
- Supabase: ✅ schema + RLS applied
- Remaining: production data + admin bootstrap + basic SEO

---

## 0. Safety rules (must)
- Never commit secrets (.env.local, service_role key)
- Use ONLY NEXT_PUBLIC_SUPABASE_* on client
- Any DB write from UI must be admin-only (RLS enforced)

---

## 1. Seed production content (manual, Supabase dashboard)
### 1-1 site_settings
- Set global_booking_url
- Set line_url / instagram_url / x_url
- Set notice_text

### 1-2 rooms / courses / therapists / shifts
- Add at least:
  - rooms: 1+
  - courses: 3+
  - therapists: 3+
  - shifts: next 7-14 days

Done when:
- All pages render meaningful content on production URL

---

## 2. Admin bootstrap (SQL)
- Insert/Upsert current user into profiles as is_admin=true

SQL:
```sql
insert into public.profiles (id, is_admin)
values ('<YOUR_AUTH_USER_ID>', true)
on conflict (id) do update set is_admin = true;
