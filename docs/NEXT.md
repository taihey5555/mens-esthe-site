1) Bugfix: セラピスト詳細が表示されない（最優先）

目的：`/therapists/[slug]` が本番で確実に表示される状態にする。
対応：原因の洗い出しから修正、本番確認まで完了させる。

チェック観点：
- `therapists.slug` と URL の slug が一致しているか
- 詳細側のクエリ条件（`eq("slug", slug)` / `is_active`）の不整合
- RLS（anon の SELECT が詳細ページ側クエリで弾かれていないか）
- Next.js のキャッシュ/SSG が原因で 404/空表示になっていないか（動的化 or noStore）
- 取得カラム不足（tags 等）や型/例外で落ちていないか

Done条件：
- 本番URLで `https://<domain>/therapists/<slug>` が表示される
- 404/空表示にならない
- `npm run build` が通る

2) Production content（見た目を完成させる）

目的：seedではなく「運用データ」で全ページがそれっぽく成立する状態にする。
対応：Admin から投入（または SQL でも可）

投入最低ライン：
- site_settings: global_booking_url / SNS / notice_text
- rooms: 1+
- courses: 3+
- therapists: 3+
- shifts: 7〜14日分

Done条件：
- 公開ページ（`/` `/therapists` `/schedule` `/pricing` `/access` `/recruit`）が本番データで表示される

3) 画像運用方針を決める（最後でOK）

目的：画像URLの管理を迷わない形に固定する。
選択肢：
- A) Supabase Storage にアップロードしてURL管理
- B) 外部URL運用（最速・コストゼロ）

Done条件：
- 「どの画面で・どの項目に・どの形式で保存するか」が決まっている

4) 公開ページの日本語コピー調整（今回）

目的：トップ刷新の文言と説明文を日本語へ統一し、英語残りを解消する。
対象：`/` `/therapists` `/therapists/[slug]` `/schedule` `/pricing` `/access` `/recruit` + Header

Done条件：
- 公開ページに英語が残っていない
- トップ刷新の日本語コピーが反映されている

Notes（運用ルール）
- secrets は絶対 commit しない（`.env.local` / service_role）
- クライアントは `NEXT_PUBLIC_SUPABASE_*` のみ使用
- UI からの DB 書き込みは admin のみ（RLS で強制）
