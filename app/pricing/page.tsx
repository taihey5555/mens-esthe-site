import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"

export const metadata: Metadata = {
  title: publicText.metadata.pricing.title,
  description: publicText.metadata.pricing.description,
  openGraph: {
    title: publicText.metadata.pricing.title,
    description: publicText.metadata.pricing.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.pricing.title,
    description: publicText.metadata.pricing.description,
  },
}

type CourseRow = {
  id: string
  name: string
  duration_min: number
  price: number
  sort_order: number
}

export default async function PricingPage() {
  const supabase = getSupabase()
  const { data: courses } = await supabase
    .from("courses")
    .select("id,name,duration_min,price,sort_order")
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen bg-rich-black px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            {publicText.sections.pricing}
          </h1>
          <p className="text-sm text-white/60">
            コース料金と施術時間のご案内です。
          </p>
        </header>

        <div className="space-y-3">
          {(courses as CourseRow[] | null)?.map((course) => (
            <div
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4 shadow-sm"
            >
              <div>
                <div className="text-base font-semibold text-white">
                  {course.name}
                </div>
                <div className="text-sm text-white/60">
                  {course.duration_min} 分
                </div>
              </div>
              <div className="text-base font-semibold text-white">
                {course.price.toLocaleString()} {publicText.common.priceSuffix}
              </div>
            </div>
          ))}
          {!courses?.length && (
            <div className="rounded-lg border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
              料金情報がありません。
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
