import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"

export const metadata: Metadata = {
  title: publicText.metadata.home.title,
  description: publicText.metadata.home.description,
  openGraph: {
    title: publicText.metadata.home.title,
    description: publicText.metadata.home.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.home.title,
    description: publicText.metadata.home.description,
  },
}

type TherapistCard = {
  id: string
  name: string
  slug: string
  main_image_url: string | null
  profile_text: string | null
  is_newface: boolean
}

export default async function Home() {
  let bookingUrl: string | null = null
  let noticeText: string | null = null
  let therapists: TherapistCard[] = []

  try {
    const supabase = getSupabase()
    const [settingsResult, therapistsResult] = await Promise.all([
      supabase
        .from("site_settings")
        .select("global_booking_url,notice_text")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("therapists")
        .select("id,name,slug,main_image_url,profile_text,is_newface,sort_order")
        .order("sort_order", { ascending: true })
        .limit(3),
    ])

    bookingUrl = settingsResult.data?.global_booking_url ?? null
    noticeText = settingsResult.data?.notice_text ?? null
    therapists = (therapistsResult.data as TherapistCard[] | null) ?? []
  } catch {
    bookingUrl = null
    noticeText = null
    therapists = []
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-12">
        <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 shadow-sm md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-500">
                {publicText.heroNote}
              </p>
              <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
                {publicText.shopName}
              </h1>
              <p className="text-lg text-zinc-600">{publicText.heroCatch}</p>
            </div>
            {bookingUrl ? (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
              >
                {publicText.ctaBooking}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center rounded-md bg-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-500"
              >
                {publicText.ctaBookingDisabled}
              </button>
            )}
          </div>
        </section>

        {noticeText && (
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              {publicText.sections.notice}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{noticeText}</p>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-900">
              {publicText.sections.therapists}
            </h2>
            <Link
              href="/therapists"
              className="text-sm font-medium text-zinc-700 underline"
            >
              {publicText.ctaSeeTherapists}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {therapists.map((therapist) => (
              <article
                key={therapist.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="h-32 w-full overflow-hidden rounded-md bg-zinc-100">
                  {therapist.main_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={therapist.main_image_url}
                      alt={therapist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                      {publicText.common.noImage}
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-zinc-900">
                      {therapist.name}
                    </h3>
                    {therapist.is_newface && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        新人
                      </span>
                    )}
                  </div>
                  {therapist.profile_text && (
                    <p className="text-sm text-zinc-600 line-clamp-2">
                      {therapist.profile_text}
                    </p>
                  )}
                  <Link
                    href={`/therapists/${therapist.slug}`}
                    className="text-sm font-medium text-zinc-700 underline"
                  >
                    {publicText.common.viewDetails}
                  </Link>
                </div>
              </article>
            ))}
            {!therapists.length && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
                {publicText.common.loading}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              {publicText.sections.pricing}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              コース内容と料金をご案内します。
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex text-sm font-medium text-zinc-700 underline"
            >
              {publicText.ctaSeePricing}
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              {publicText.sections.access}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              ルームの場所とアクセスを確認できます。
            </p>
            <Link
              href="/access"
              className="mt-4 inline-flex text-sm font-medium text-zinc-700 underline"
            >
              {publicText.ctaSeeAccess}
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              {publicText.sections.recruit}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              セラピスト募集の詳細はこちらから。
            </p>
            <Link
              href="/recruit"
              className="mt-4 inline-flex text-sm font-medium text-zinc-700 underline"
            >
              {publicText.ctaSeeRecruit}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
