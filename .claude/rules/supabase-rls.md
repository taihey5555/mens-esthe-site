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

## 2. 認可モデル（基本方針）
### Roles
- anon: 未ログイン（Public閲覧）
- authenticated: ログインユーザー
- service_role: サーバー専用（Edge/Server）※クライアント禁止

### Public(anon) に許可
- `rooms, therapists, shifts, courses, site_settings` の **SELECT** のみ
- 表示は `is_active = true` を基本条件にする（アプリ側 or ポリシー側）

### 書き込み（INSERT/UPDATE/DELETE）
- admin のみ（authenticated の中でも管理者だけ）
- 管理者判定は「profilesテーブル + is_admin」などで行う（推奨）
  - 例：`profiles(id uuid pk, is_admin boolean)`
  - `auth.uid()` と `profiles.id` を突合

## 3. RLSの基本（USING / WITH CHECK）
- SELECT: `USING` が適用される
- INSERT: `WITH CHECK` が適用される（新しい行が条件を満たす必要）
- UPDATE: `USING`（更新対象の行）と `WITH CHECK`（更新後の行）の両方が効く
- 「保存されない」時の多くは `WITH CHECK` 不一致 or `auth.uid()` が null

## 4. 最小のRLS実装パターン（MVP推奨）
### a) Public read-only tables
- `ENABLE RLS`
- policy:
  - `FOR SELECT USING (is_active = true)` のように公開条件を付ける
  - もしくは `USING (true)` にしてアプリ側で `is_active` を必ず絞る（どちらかに統一）

### b) Admin write
- `FOR ALL`（or INSERT/UPDATE/DELETE別々）で
  - `USING (is_admin(auth.uid()))`
  - `WITH CHECK (is_admin(auth.uid()))`
- is_admin は関数化してもよい：
  - `create function public.is_admin(uid uuid) returns boolean ...`

## 5. “詰まった時” の切り分け順（これが最速）
1) クエリが client からか server からか（anon/auth/service_role を確認）
2) 対象テーブルの RLS が有効か
3) policy の `USING / WITH CHECK` は正しいか
4) `auth.uid()` が期待通りか（未ログインなら null）
5) 条件列（is_active等）が false になっていないか
6) Supabase logs / SQL実行結果のエラーを確認（401/403/permission）

## 6. マイグレーション運用（必須）
- DB変更は `supabase/migrations/<timestamp>_*.sql` に必ず残す
- policy 変更も migration に含める
- 変更したら即コミット（「DBだけのコミット」を作る）

## 7. 公開データの取り扱い
- 個人情報はPublicテーブルに置かない（MVPで顧客情報は扱わない）
- アクセスは「詳細は予約後に案内」など、位置情報を出しすぎない文言を採用（運用で調整）

## 8. デフォルト推奨テーブル（MVP）
- rooms
- therapists
- shifts
- courses
- site_settings
- profiles（admin判定用）

この範囲にない機能（予約/レビュー投稿/決済）はMVP外。追加するときは要件・RLS・監査を先に作る。
