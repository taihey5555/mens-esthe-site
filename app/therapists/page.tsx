import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"
import PlaceholderImage from "@/components/ui/PlaceholderImage"

export const metadata: Metadata = {
  title: publicText.metadata.therapists.title,
  description: publicText.metadata.therapists.description,
  openGraph: {
    title: publicText.metadata.therapists.title,
    description: publicText.metadata.therapists.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.therapists.title,
    description: publicText.metadata.therapists.description,
  },
}

type TherapistCard = {
  id: string
  name: string
  slug: string
  main_image_url: string | null
  profile_text: string | null
  booking_url: string | null
  sort_order: number | null
  is_newface: boolean | null
  is_active: boolean
}

type SiteSettingsRow = {
  global_booking_url: string | null
}

const filterChips = [
  "すべて",
  "マッサージ",
  "スキンケア",
  "ディープ",
  "本日出勤",
  "人気",
]

export default async function TherapistsPage() {
  const supabase = getSupabase()

  const [
    { data: therapists, error: therapistsError },
    { data: settings, error: settingsError },
  ] = await Promise.all([
    supabase
      .from("therapists")
      .select(
        "id,name,slug,main_image_url,profile_text,booking_url,sort_order,is_newface,is_active"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("site_settings").select("global_booking_url").limit(1),
  ])

  const globalBookingUrl =
    (settings as SiteSettingsRow[] | null)?.[0]?.global_booking_url ?? null

  const debugInfo =
    therapistsError || settingsError
      ? {
          therapistsError: therapistsError?.message ?? null,
          settingsError: settingsError?.message ?? null,
          therapistsCount: therapists?.length ?? 0,
        }
      : null

  return (
    <div className="min-h-screen bg-rich-black text-warm-gray">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black text-white md:text-4xl">
            セラピスト一覧
          </h1>
          <p className="max-w-2xl text-white/60">
            男性の癒やしと美を追求するプロフェッショナル。お気に入りの担当者をお選びください。
          </p>
          {debugInfo && (
            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>

        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {filterChips.map((chip, index) => (
            <button
              key={chip}
              type="button"
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all ${
                index === 0
                  ? "bg-primary text-white"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-primary hover:text-primary"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(therapists as TherapistCard[] | null)?.map((therapist) => {
            const bookingUrl = therapist.booking_url ?? globalBookingUrl

            return (
              <article
                key={therapist.id}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-primary/50 hover:bg-white/10"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="h-full w-full bg-white/10">
                    <PlaceholderImage
                      src={therapist.main_image_url}
                      alt={therapist.name}
                      size={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {therapist.is_newface && (
                    <span className="absolute left-3 top-3 rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      新人
                    </span>
                  )}
                </div>
                <div className="flex flex-grow flex-col p-5">
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-white transition-colors group-hover:text-primary">
                      {therapist.name}
                    </h2>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-primary/80">
                      セラピスト
                    </p>
                  </div>
                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/60">
                    {therapist.profile_text || "プロフィール準備中です。"}
                  </p>
                  <div className="mt-auto flex flex-col gap-2">
                    {bookingUrl ? (
                      <a
                        href={bookingUrl}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                        target="_blank"
                        rel="noreferrer"
                      >
                        予約する
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-lg bg-white/10 px-4 py-2.5 text-sm font-bold text-white/40"
                      >
                        {publicText.common.bookingUnavailable}
                      </button>
                    )}
                    <Link
                      href={`/therapists/${therapist.slug}`}
                      className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}

          {!therapists?.length && (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
              {publicText.common.noData}
            </div>
          )}
        </div>

        <div className="mt-12 mb-20 flex items-center justify-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white"
          >
            1
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-white/60 transition-colors hover:bg-white/10"
          >
            2
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-white/60 transition-colors hover:bg-white/10"
          >
            3
          </button>
          <span className="px-1 text-white/40">...</span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 md:hidden">
        {globalBookingUrl ? (
          <a
            href={globalBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-xl shadow-primary/30"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            予約する
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 py-4 font-bold text-white/40"
          >
            {publicText.ctaBookingDisabled}
          </button>
        )}
      </div>
    </div>
  )
}
