import type { Metadata } from "next"
import { publicText } from "@/lib/i18n/ja"

export const metadata: Metadata = {
  title: publicText.metadata.recruit.title,
  description: publicText.metadata.recruit.description,
  openGraph: {
    title: publicText.metadata.recruit.title,
    description: publicText.metadata.recruit.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.recruit.title,
    description: publicText.metadata.recruit.description,
  },
}

export default function RecruitPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Recruit</p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            {publicText.sections.recruit}
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            落ち着いた空間で、丁寧な接客を大切にしています。未経験の方も研修があるので、
            まずはご相談ください。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">働きやすさ</h2>
            <p className="mt-2 text-sm text-zinc-600">
              自由出勤・掛け持ちOK。ライフスタイルに合わせて調整できます。
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">収入</h2>
            <p className="mt-2 text-sm text-zinc-600">
              高収入を目指せます。日払い・週払いは相談可能です。
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">サポート</h2>
            <p className="mt-2 text-sm text-zinc-600">
              個室対応で安心。接客や施術の基本も丁寧にフォローします。
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">応募条件</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>18歳以上（高校生不可）</li>
              <li>未経験OK / 経験者優遇</li>
              <li>清潔感のある接客ができる方</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">勤務イメージ</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>出勤日数は週1回から相談可</li>
              <li>短時間のシフトもOK</li>
              <li>Wワーク・学業との両立可</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">応募・お問い合わせ</h2>
          <p className="mt-2 text-sm text-zinc-600">
            応募・お問い合わせは外部予約ページまたはSNSの連絡先からお願いします。
            体験入店や見学もご相談ください。
          </p>
        </section>
      </div>
    </main>
  )
}
