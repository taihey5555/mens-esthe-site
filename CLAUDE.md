# Mens Esthe Site (MVP)

## Purpose
メンズエステ店舗の公式サイトを作る。MVPは「外部予約リンク運用」で、サイト内に予約機能（予約DB、空き枠、決済など）は実装しない。
ユーザーはサイトで「セラピスト」「出勤」「料金」「アクセス」を確認し、予約は外部サイトへ遷移して完結させる。

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres / Auth / RLS)
- Deploy: Vercel

## MVP Scope (Fixed)
### Public Pages
- `/` Top
- `/therapists` セラピスト一覧
- `/therapists/[slug]` セラピスト詳細
- `/schedule` スケジュール（出勤）
- `/pricing` 料金
- `/access` アクセス（ルーム）
- `/recruit` 求人

### Admin Pages (Login required)
- `/admin` Dashboard
- `/admin/therapists` セラピストCRUD
- `/admin/shifts` 出勤CRUD
- `/admin/rooms` ルームCRUD
- `/admin/courses` コースCRUD
- `/admin/settings` サイト設定（外部予約URLなど）

## Booking (External Only)
- 店全体の予約URL：`site_settings.global_booking_url`
- セラピスト個別の予約URL：`therapists.booking_url`（任意。空ならglobalを使う）
- 予約ボタンの遷移ルール：
  1) `therapists.booking_url` があればそれへ
  2) なければ `site_settings.global_booking_url` へ
- サイト内で予約データは保存しない（予約テーブルなし）

## Data Model (MVP)
- rooms（ルーム/エリア/アクセス文）
- therapists（プロフィール、画像、SNS、外部予約URL）
- shifts（出勤：therapist × room × start/end）
- courses（料金コース）
- site_settings（サイト共通設定：外部予約URL、SNS等）

## Security / RLS Policy (High Level)
- Public（匿名）に許可するのは原則 `SELECT` のみ（表示に必要なテーブル）
- `INSERT/UPDATE/DELETE` は管理者のみ
- Service Role をフロントエンドに置かない（Edge/Server専用）

## Development Workflow (Must)
- DB変更は必ず `supabase/migrations/*` にSQLとして残し、Gitにコミットする（SQL Editor直打ち運用を避ける）
- 1コミット1変更（RLSだけ、UIだけ、など小さく刻む）
- 迷ったら「MVPにあるか？」を最優先で判断。MVP外の機能は追加しない

## Coding Style
- App Router: `src/app/*`
- Components: `src/components/*`
- Supabase client: `src/lib/supabase/*`
- 型は可能な範囲で明示し、null/undefinedを厳密に扱う
- UIはまず80点で良い（機能とデータ整合を優先）。磨き込みは後工程
