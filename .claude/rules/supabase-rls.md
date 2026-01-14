---
title: supabase-rls
priority: high
---

# Supabase / RLS Rules (MVP: External Booking)

## 0. MVPの前提（破らない）
- サイト内予約は作らない（予約DBなし）
- 予約導線は外部URLへ遷移のみ
- Publicに許可するのは基本 `SELECT` のみ

## 1. 絶対禁止
- フロントエンド（ブラウザ）で service_role を使うこと
- RLSを無効化して「動かすためだけ」に逃げること
- SQL Editorに直打ちして、マイグレーションを残さない運用
- anon/public に `INSERT/UPDATE/DELETE` を広く許可すること（MVPでは不要）
- `site_settings` 等に秘密情報（鍵/内部用連絡先/運用メモ）を混ぜること（必要なら分離）

## 2. 認可モデル（基本方針）
### Roles
- anon: 未ログイン（Public閲覧）
- authenticated: ログインユーザー
- service_role: サーバー専用（Edge/Server）※クライアント禁止

### Public(anon) に許可
- `rooms, therapists, shifts, courses, site_settings` の **SELECT** のみ
- 表示は `is_active = true` を基本条件にする（原則ポリシー側で固定）
- `site_settings` は「公開してよい項目だけ」に限定する（公開ビュー/分離テーブル推奨）

### 書き込み（INSERT/UPDATE/DELETE）
- admin のみ（authenticated の中でも管理者だけ）
- 管理者判定は `profiles.is_admin` を使用する
  - `profiles(id uuid pk -> auth.users(id), is_admin boolean)`

## 3. RLSとGRANTは別レイヤー（両方必要）
- RLSを設定しても、Postgres権限（GRANT）が無いと 401/permission で詰まることがある
- 逆にGRANTだけしてRLSが緩いと漏洩する
- 必須GRANT（基本）：
  - `GRANT USAGE ON SCHEMA public TO anon, authenticated;`
  - `GRANT SELECT ON <table> TO anon, authenticated;`
  - 管理系は必要に応じて `GRANT INSERT/UPDATE/DELETE` を authenticated に（ただしRLSでadminのみに縛る）

## 4. RLSの基本（USING / WITH CHECK）
- SELECT: `USING` が適用される
- INSERT: `WITH CHECK` が適用される（新しい行が条件を満たす必要）
- UPDATE: `USING`（更新対象の行）と `WITH CHECK`（更新後の行）の両方が効く
- 「保存されない」時の多くは `WITH CHECK` 不一致 or `auth.uid()` が null

## 5. 最小のRLS実装パターン（MVP推奨）
### a) Public read-only tables
- `ENABLE RLS`
- policy:
  - `FOR SELECT USING (is_active = true)` のように公開条件を付ける
  - `USING (true)` は「全面公開でOK」なテーブルだけ（ドラフトや非公開が混ざるなら禁止）

### b) Admin write
- `FOR ALL`（or INSERT/UPDATE/DELETE別々）で
  - `USING (is_admin(auth.uid()))`
  - `WITH CHECK (is_admin(auth.uid()))`

### c) is_admin() 関数の注意
- `SECURITY DEFINER` を使う場合は必ず `SET search_path = public` を固定する

## 6. Admin Bootstrap（最初の管理者の作り方）
- 手順（推奨）：
  1) Supabase Authで管理者ユーザーを作成（通常ログイン）
  2) SQLで `profiles` に upsert して `is_admin=true` を付与する（SQL Editor / migration / server側）
- フロントから service_role を使って管理者化しない

## 7. “詰まった時” の切り分け（最速）
1) クエリが client からか server からか（anon/auth/service_role を確認）
2) 対象テーブルの RLS が有効か
3) policy の `USING / WITH CHECK` は正しいか
4) `auth.uid()` が期待通りか（未ログインなら null）
5) 条件列（is_active等）が false になっていないか
6) GRANT（schema/table）が付いているか
7) Supabase logs / SQL実行結果のエラーを確認（401/403/permission）

## 7.5 追加チェックリスト（RLSで詰まりやすい点）
1) `GRANT USAGE ON SCHEMA public TO anon, authenticated`
2) `GRANT SELECT ON <table> TO anon, authenticated`（RLSは別）
3) `profiles` の admin 行が存在し `is_admin=true` になっている
4) `is_admin()` 関数は `SECURITY DEFINER` + `SET search_path = public`
5) クライアントが `anon` key を使っている（service_role混入なし）

## 8. マイグレーション運用（必須）
- DB変更は `supabase/migrations/<timestamp>_*.sql` に必ず残す
- policy 変更も migration に含める
- 変更したら即コミット（「DBだけのコミット」を作る）
