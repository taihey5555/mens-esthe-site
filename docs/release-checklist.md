# リリースチェックリスト

## 最優先（リリース最低ライン）
- [x] 本番データ差し替え（seed卒業）: `therapists`
- [x] 本番データ差し替え（seed卒業）: `rooms`
- [x] 本番データ差し替え（seed卒業）: `courses`
- [x] 本番データ差し替え（seed卒業）: 出勤情報（`shifts`）
- [x] 本番データ差し替え（seed卒業）: `site_settings`
- [x] 画面上の seed 表示を全削除
- [x] Settings保存の安定化（保存→反映→再読込で値が残る）
- [ ] 反映しない場合の確認: RLS / update対象行(1行目) / where条件
- [ ] 予約導線の最終確認（外部予約なら「今すぐ予約」を強く）
- [ ] 表示対象・並び順: `is_active` と `sort` が本番想定
- [ ] 画像運用方針の決定
  - [ ] 最短: `main_image_url` 外部URL運用
  - [ ] ちゃんと: Supabase Storage（UI or 手動URL）

## 次にやると「店っぽく」なる
- [ ] トップ作り込み（ヒーロー文言）
- [ ] トップ作り込み（推しポイント3つ）
- [ ] トップ作り込み（予約導線）
- [ ] トップ作り込み（注意事項）
- [ ] トップ作り込み（SNS導線）
- [ ] `/schedule` 店舗感アップ（7/14日表示はOK）
- [ ] `/schedule` 施術者の丸アイコン＋名前
- [ ] `/schedule` 空き状況風タグ（昼/夜、人気）
- [ ] `/pricing` 実データ（コース3つ以上）
- [ ] `/pricing` 注意書き（指名料/延長/キャンセル）
- [ ] `/access` 住所
- [ ] `/access` 最寄駅
- [ ] `/access` 地図リンク
- [ ] `/access` 注意

## 安全品質
- [ ] 管理画面CRUDで失敗理由を表示（RLS対策）
- [ ] update/insert の `error` を必ず表示
- [ ] RLS & admin gate の整合確認（非adminは`/admin`で`403`、更新権限をRLSで制御）
- [ ] 本番 env var の最終確認
- [ ] title/description/OG が日本語
- [ ] robots/sitemap が本番URLで正しい

## 管理ユーザーまわり
- [ ] admin権限付与の手順を docs に1枚で残す
