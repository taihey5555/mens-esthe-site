import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"

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
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {publicText.sections.therapists}
          </h1>
          <p className="text-sm text-zinc-600">
            在籍セラピストと予約リンクをご案内します。
          </p>

          <div className="text-xs text-zinc-500">
            件数: {therapists?.length ?? 0}
          </div>
          {debugInfo && (
            <pre className="whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-600">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {(therapists as TherapistCard[] | null)?.map((therapist) => {
            const bookingUrl = therapist.booking_url ?? globalBookingUrl

            return (
              <article
                key={therapist.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-md bg-zinc-100">
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

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/therapists/${therapist.slug}`}
                        className="text-lg font-semibold text-zinc-900"
                      >
                        {therapist.name}
                      </Link>

                      {therapist.is_newface && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {publicText.common.newFace}
                        </span>
                      )}
                    </div>

                    {therapist.profile_text && (
                      <p className="line-clamp-3 text-sm text-zinc-600">
                        {therapist.profile_text}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {bookingUrl ? (
                        <a
                          href={bookingUrl}
                          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {publicText.ctaBooking}
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-md bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-500"
                        >
                          {publicText.common.bookingUnavailable}
                        </button>
                      )}

                      <Link
                        href={`/therapists/${therapist.slug}`}
                        className="text-sm font-medium text-zinc-700 underline"
                      >
                        {publicText.common.viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}

          {!therapists?.length && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
              セラピストがありません。
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
