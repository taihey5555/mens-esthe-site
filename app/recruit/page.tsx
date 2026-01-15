import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recruit | Mens Esthe Official Site",
  description: "Recruitment information for therapists.",
  openGraph: {
    title: "Recruit | Mens Esthe Official Site",
    description: "Recruitment information for therapists.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Recruit | Mens Esthe Official Site",
    description: "Recruitment information for therapists.",
  },
}

export default function RecruitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">求人</h1>

      <div className="mt-6 space-y-4 text-sm leading-6">
        <p>
          一緒に働いてくれるセラピストさんを募集しています。未経験の方もご相談ください。
        </p>

        <ul className="list-disc pl-5">
          <li>高収入 / 日払い相談可</li>
          <li>自由出勤 / 掛け持ちOK</li>
          <li>個室対応 / 安心サポート</li>
        </ul>

        <p className="pt-2">
          応募・お問い合わせは外部予約の連絡先からお願いします。
        </p>
      </div>
    </main>
  )
}
