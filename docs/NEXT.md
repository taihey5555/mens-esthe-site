次にやるべき1行: 管理画面で本番データを入力 → 公開ページで確認

## Production content
- 推奨フロー: 管理画面で入力 → 公開ページで確認
- `docs/seed.sql` は dev/local 用（本番置換しない）
- 対象テーブル: `therapists` / `rooms` / `courses` / 出勤情報（`shifts`） / `site_settings`

## Settings 安定化（`site_settings`）
0行なら1行作成し、以後は upsert で更新する。Supabase SQL Editor で実行。

```sql
-- 0行なら1行作成
insert into public.site_settings (id)
select gen_random_uuid()
where not exists (select 1 from public.site_settings);

-- 既存1行を upsert で更新
insert into public.site_settings (
  id,
  global_booking_url,
  line_url,
  x_url,
  instagram_url,
  notice_text
)
select
  id,
  'https://example.com/booking',
  'https://line.me/R/ti/p/example',
  'https://x.com/example_store',
  'https://instagram.com/example_store',
  'ここにお知らせ文'
from public.site_settings
order by created_at
limit 1
on conflict (id) do update
set
  global_booking_url = excluded.global_booking_url,
  line_url = excluded.line_url,
  x_url = excluded.x_url,
  instagram_url = excluded.instagram_url,
  notice_text = excluded.notice_text;
```

## 管理画面入力テンプレ
見出しごとにコピペして使う（スラッグは `slug`）。

### rooms
- 最低ライン: name / area / access_note / sort_order / is_active
- 任意（店っぽさUP）: 画像URL / 補足説明

### therapists
- 最低ライン: name / `slug` / profile_text / tags / sns_urls / is_newface / is_active / sort_order
- 任意（店っぽさUP）: メイン画像URL / サブ画像URL / 推しポイント

### courses
- 最低ライン: name / duration_min / price / sort_order / is_active
- 任意（店っぽさUP）: 注意書き（指名料/延長/キャンセル）

### 出勤情報（`shifts`）
- 最低ライン: therapist_id / room_id / start_at / end_at / is_active
- 任意（店っぽさUP）: note / 昼夜タグ / 人気タグ

### site_settings
- 最低ライン: global_booking_url / line_url / x_url / instagram_url / notice_text
- 任意（店っぽさUP）: OGP 追加文 / 注意事項

## Done条件
- 公開ページ（`/` / `/therapists` / `/schedule` / `/pricing` / `/access` / `/recruit`）が本番データで成立
- seed 表示が残っていない
- Settings 保存後にリロードしても値が残る
