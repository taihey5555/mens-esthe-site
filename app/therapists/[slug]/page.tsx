import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase/client"
import {
  formatJstDateTime,
  formatJstTime,
  getTodayStartUtcISOString,
} from "@/lib/time"
import { publicText } from "@/lib/i18n/ja"
import PlaceholderImage from "@/components/ui/PlaceholderImage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: publicText.metadata.therapistDetail.titlePrefix,
  description: publicText.metadata.therapistDetail.description,
  openGraph: {
    title: publicText.metadata.therapistDetail.titlePrefix,
    description: publicText.metadata.therapistDetail.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.therapistDetail.titlePrefix,
    description: publicText.metadata.therapistDetail.description,
  },
}

type TherapistDetail = {
  id: string
  name: string
  slug: string
  main_image_url: string | null
  profile_text: string | null
  booking_url: string | null
  tags: string[]
  is_newface: boolean
  sns_urls: Record<string, string> | null
}

type ShiftRow = {
  id: string
  start_at: string
  end_at: string
  note: string | null
  room: {
    id: string
    name: string
    area: string | null
  } | null
}

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = getSupabase()
  const todayStartUtc = getTodayStartUtcISOString()

  const therapistQuery = supabase
    .from("therapists")
    .select(
      "id,name,slug,main_image_url,profile_text,booking_url,tags,is_newface,sns_urls"
    )
    .eq("slug", slug)
    .maybeSingle()

  const settingsQuery = supabase
    .from("site_settings")
    .select("global_booking_url")
    .limit(1)

  const [
    { data: therapist, error: therapistError },
    { data: settings, error: settingsError },
  ] = await Promise.all([therapistQuery, settingsQuery])

  if (therapistError) {
    console.error("Therapist detail fetch failed", {
      slug,
      error: therapistError.message,
    })
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto w-full max-w-3xl space-y-4 rounded-lg border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">
            {publicText.messages.fetchFailed}
          </h1>
          <p>{publicText.messages.retryLater}</p>
        </div>
      </main>
    )
  }

  if (!therapist) {
    notFound()
  }

  if (settingsError) {
    console.error("Site settings fetch failed", {
      error: settingsError.message,
    })
  }

  const { data: shifts, error: shiftsError } = await supabase
    .from("shifts")
    .select("id,start_at,end_at,note,room:rooms(id,name,area)")
    .eq("therapist_id", therapist.id)
    .gte("start_at", todayStartUtc)
    .order("start_at", { ascending: true })

  if (shiftsError) {
    console.error("Shift fetch failed", {
      therapistId: therapist.id,
      error: shiftsError.message,
    })
  }

  const globalBookingUrl = settings?.[0]?.global_booking_url ?? null
  const bookingUrl = therapist.booking_url ?? globalBookingUrl

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Link href="/therapists" className="text-sm text-zinc-600 underline">
          {publicText.common.backToList}
        </Link>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-40 w-40 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <PlaceholderImage
                src={therapist.main_image_url}
                alt={therapist.name}
                size={160}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold text-zinc-900">
                  {therapist.name}
                </h1>
                {therapist.is_newface && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {publicText.common.newFace}
                  </span>
                )}
              </div>
              {therapist.profile_text && (
                <p className="text-sm text-zinc-600">
                  {therapist.profile_text}
                </p>
              )}
              {therapist.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {(therapist.tags as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div>
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicText.ctaBooking}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500"
                  >
                    {publicText.common.bookingUnavailable}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            {publicText.common.upcomingShifts}
          </h2>
          {shiftsError && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {publicText.messages.shiftsFetchFailed}
            </div>
          )}
          <div className="space-y-3">
            {(shifts as ShiftRow[] | null)?.map((shift) => (
              <div
                key={shift.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-zinc-900">
                      {formatJstDateTime(shift.start_at)}
                    </div>
                    <div className="text-sm text-zinc-600">
                      {formatJstTime(shift.start_at)} -{" "}
                      {formatJstTime(shift.end_at)}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-600">
                    {shift.room?.name ?? publicText.common.roomTbd}
                    {shift.room?.area ? ` / ${shift.room.area}` : ""}
                  </div>
                </div>
                {shift.note && (
                  <div className="mt-2 text-xs text-zinc-500">{shift.note}</div>
                )}
              </div>
            ))}
            {!shifts?.length && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
                {publicText.common.noUpcomingShifts}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
