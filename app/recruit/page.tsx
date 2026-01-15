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
    <main className="bg-rich-black text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-10">
        <section id="intro" className="py-4 md:py-10">
          <div className="rounded-xl bg-cover bg-center bg-no-repeat p-6 text-center">
            <div
              className="flex min-h-[560px] flex-col items-center justify-center gap-6 rounded-xl px-6"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBspKOdMjtF3WNKBurYGxtr4A9b_xYcczRYNhfS0s5WRBZgWBMyaZYEhNN-I5by5X7nt2LTjEMKS105bsRzmjsGFvoXe_XG3pt-0bGAeKseIZ7qDYh6ML3vYYZMVDjGX9SOt6AHsMARFeVg-DxI5Weu0dXw22lfY3mwxNjkv5f6lHaIalrbNhXa6A4yf5xud9vNRePZOzi6JG4ZcNa_Q7a2NiapFD2Eo0BpH4cqU7GhpnnlEQScW-dNf2oF-dISfZdWaffCFLYV2yk")',
              }}
            >
              <div className="flex max-w-[800px] flex-col gap-4">
                <h1 className="text-4xl font-black leading-tight tracking-[-0.03em] md:text-6xl">
                  上質なセラピーを届ける仲間を募集
                </h1>
                <p className="text-lg font-normal text-white/80 md:text-xl">
                  落ち着いた空間と丁寧な接客を大切にする職場です。未経験の方も安心して
                  始められる研修を用意しています。
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <button className="flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-lg bg-[#06C755] px-6 text-lg font-bold text-white transition-all hover:brightness-110">
                  <span className="material-symbols-outlined">chat</span>
                  LINEで応募
                </button>
                <button className="flex h-14 min-w-[200px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 text-lg font-bold text-white transition-all hover:bg-white/20">
                  店内の雰囲気を見る
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="px-0 py-12 md:px-0">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                働きやすさの理由
              </h2>
              <p className="text-lg text-white/60">
                セラピストの働きやすさを最優先に整えています。
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "高歩合・高収入",
                  icon: "payments",
                  text: "高歩合＋指名料・オプションの還元。頑張りをしっかり評価します。",
                },
                {
                  title: "自由なシフト",
                  icon: "calendar_month",
                  text: "週1日・短時間から相談OK。ライフスタイルに合わせて働けます。",
                },
                {
                  title: "充実の研修",
                  icon: "school",
                  text: "未経験でも安心の研修制度。接客・施術を丁寧にサポートします。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl leading-none">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-base text-white/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="requirements"
          className="mx-0 mb-12 rounded-3xl bg-white/5 px-4 py-12 md:px-10"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="pb-6 text-3xl font-bold">
                求める人物像・応募条件
              </h2>
              <p className="mb-8 text-lg text-white/60">
                経験よりも人柄を重視。丁寧な接客ができる方を歓迎します。
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "ホスピタリティのある方・時間を守れる方",
                  "未経験歓迎（研修あり）",
                  "清潔感を大切にできる方",
                  "成長意欲がある方",
                  "18歳以上（高校生不可）",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary text-primary">
                      <span className="material-symbols-outlined text-sm font-bold">
                        check
                      </span>
                    </div>
                    <p className="text-lg text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl lg:aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="サロンスタッフ"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNw5AnanZPu67Md27cmhPKt7t-hH0bmli01vbsQSXxIcDSCQnGn1sSTTYfUE9bjKrF3voSuRm3L-_gr2N7BmGP6KGK9mFx9h5KSjEY8LX3-nR2i3-EvMTNsmDmBC9_Pwxoi7z7kxKmzsxBIG0pf6irUS-cVIExAMAuOY69cMMeVhp3K7KKQg6Q22EDK6GZqWxzv1JO-wv7MK7SxcZaLW59f3JBKfFZwwNwPXtpwF9lmsGlz_F481yqZKR9sCHhpB0eM0XiR1mkG-Y"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-black/70 p-6 backdrop-blur">
                <p className="text-white/90 italic">
                  「未経験からでもすぐにお客様を担当できるようになりました。」
                </p>
                <p className="mt-2 font-bold text-primary">- 先輩セラピスト</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="px-0 py-16">
          <h2 className="mb-10 text-center text-3xl font-bold">
            よくある質問
          </h2>
          <div className="mx-auto flex max-w-[800px] flex-col gap-4">
            {[
              {
                q: "体験入店はありますか？",
                a: "はい。2週間の体験期間を設けています。実際の雰囲気を確認できます。",
              },
              {
                q: "報酬はいつ支払われますか？",
                a: "週払いに対応しています。詳細は面談時にご説明します。",
              },
              {
                q: "道具は自分で用意しますか？",
                a: "基本的な備品は店舗で用意します。手ぶらで始められます。",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold">
                  <span className="material-symbols-outlined text-primary">
                    help
                  </span>
                  {item.q}
                </h3>
                <p className="text-white/60">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-0 py-20 text-center">
          <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl bg-primary p-10 shadow-2xl md:p-20">
            <div className="absolute -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10"></div>
            <div className="absolute -ml-10 -mb-10 h-48 w-48 rounded-full bg-black/10"></div>
            <h2 className="relative z-10 text-4xl font-black text-white md:text-5xl">
              まずは気軽にご相談ください
            </h2>
            <p className="relative z-10 max-w-[600px] text-lg text-white/90 md:text-xl">
              LINEで応募・質問を受け付けています。気になることは何でもご相談ください。
            </p>
            <button className="relative z-10 flex h-16 min-w-[280px] items-center justify-center gap-3 rounded-xl bg-[#06C755] px-8 text-xl font-bold text-white shadow-lg transition-all hover:scale-105">
              
              LINEで応募する
            </button>
            <p className="relative z-10 text-sm text-white/70">
              返信目安: 2時間以内
            </p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#06C755] text-white shadow-2xl transition-transform hover:scale-110">
          <span className="material-symbols-outlined text-3xl">chat</span>
        </button>
      </div>
    </main>
  )
}
