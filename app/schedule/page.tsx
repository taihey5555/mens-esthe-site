import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import {
  formatJstDateTime,
  formatJstTime,
  getTodayStartUtcISOString,
} from "@/lib/time"
import { publicText } from "@/lib/i18n/ja"
import PlaceholderImage from "@/components/ui/PlaceholderImage"

export const metadata: Metadata = {
  title: publicText.metadata.schedule.title,
  description: publicText.metadata.schedule.description,
  openGraph: {
    title: publicText.metadata.schedule.title,
    description: publicText.metadata.schedule.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.schedule.title,
    description: publicText.metadata.schedule.description,
  },
}

type ShiftRow = {
  id: string
  start_at: string
  end_at: string
  therapist: {
    id: string
    name: string
    slug: string
    main_image_url: string | null
    booking_url: string | null
  } | null
  room: {
    id: string
    name: string
    area: string | null
  } | null
}

type RoomRow = {
  id: string
  name: string
  area: string | null
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams?: Promise<{ room?: string; days?: string }>
}) {
  const supabase = getSupabase()
  const todayStartUtc = getTodayStartUtcISOString()
  const resolvedSearchParams = await searchParams
  const selectedRoomId = resolvedSearchParams?.room ?? "all"
  const selectedDays = resolvedSearchParams?.days === "14" ? 14 : 7
  const startDate = new Date(todayStartUtc)
  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() + selectedDays)
  const endDateIso = endDate.toISOString()

  const roomsPromise = supabase
    .from("rooms")
    .select("id,name,area,sort_order")
    .order("sort_order", { ascending: true })

  const settingsPromise = supabase
    .from("site_settings")
    .select("global_booking_url")
    .limit(1)

  const shiftsQuery = supabase
    .from("shifts")
    .select(
      "id,start_at,end_at,therapist:therapists(id,name,slug,main_image_url,booking_url),room:rooms(id,name,area)"
    )
    .gte("start_at", todayStartUtc)
    .lt("start_at", endDateIso)
    .eq("is_active", true)
    .order("start_at", { ascending: true })

  if (selectedRoomId !== "all") {
    shiftsQuery.eq("room_id", selectedRoomId)
  }

  const [{ data: rooms }, { data: settings }, { data: shifts }] =
    await Promise.all([roomsPromise, settingsPromise, shiftsQuery])

  const globalBookingUrl = settings?.[0]?.global_booking_url ?? null

  const getJstParts = (date: Date) => {
    const formatter = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
    const parts = formatter.formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? ""
    return {
      year: get("year"),
      month: get("month"),
      day: get("day"),
      weekday: get("weekday"),
    }
  }

  const groups =
    (shifts as ShiftRow[] | null)?.reduce<
      Record<string, { label: string; items: ShiftRow[] }>
    >((acc, shift) => {
      const parts = getJstParts(new Date(shift.start_at))
      const dateKey = `${parts.year}-${parts.month}-${parts.day}`
      if (!acc[dateKey]) {
        acc[dateKey] = {
          label: `${parts.month}/${parts.day}(${parts.weekday})`,
          items: [],
        }
      }
      acc[dateKey].items.push(shift)
      return acc
    }, {}) ?? {}

  const buildHref = (days: number) => {
    const params = new URLSearchParams()
    if (selectedRoomId !== "all") {
      params.set("room", selectedRoomId)
    }
    params.set("days", String(days))
    return `/schedule?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {publicText.sections.schedule}
          </h1>
          <p className="text-sm text-zinc-600">
            本日以降の出勤スケジュールを掲載しています。
          </p>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-zinc-600"
                htmlFor="room"
              >
                {publicText.common.filterByRoom}
              </label>
              <select
                id="room"
                name="room"
                defaultValue={selectedRoomId}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                <option value="all">{publicText.common.allRooms}</option>
                {(rooms as RoomRow[] | null)?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <input type="hidden" name="days" value={String(selectedDays)} />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              {publicText.common.apply}
            </button>
          </form>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={buildHref(7)}
              className={
                selectedDays === 7
                  ? "rounded-md bg-zinc-900 px-3 py-1.5 font-semibold text-white"
                  : "rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700"
              }
            >
              7日
            </Link>
            <Link
              href={buildHref(14)}
              className={
                selectedDays === 14
                  ? "rounded-md bg-zinc-900 px-3 py-1.5 font-semibold text-white"
                  : "rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700"
              }
            >
              14日
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groups).map(([dateKey, group]) => (
            <section key={dateKey} className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map((shift) => (
                  <div
                    key={shift.id}
                    className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="h-28 w-28 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                        <PlaceholderImage
                          src={shift.therapist?.main_image_url}
                          alt={shift.therapist?.name ?? publicText.common.noImage}
                          size={112}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-zinc-900">
                            {formatJstTime(shift.start_at)} -{" "}
                            {formatJstTime(shift.end_at)}
                          </div>
                          <div className="text-sm text-zinc-600">
                            {shift.room?.name ?? publicText.common.roomTbd}
                            {shift.room?.area ? ` / ${shift.room.area}` : ""}
                          </div>
                        </div>
                        <div>
                          {shift.therapist ? (
                            <Link
                              href={`/therapists/${shift.therapist.slug}`}
                              className="text-base font-semibold text-zinc-900 underline"
                            >
                              {shift.therapist.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-zinc-500">
                              {publicText.common.therapistTbd}
                            </span>
                          )}
                        </div>
                        <div>
                          {(() => {
                            const bookingUrl =
                              shift.therapist?.booking_url ?? globalBookingUrl
                            if (!bookingUrl) {
                              return (
                                <button
                                  type="button"
                                  disabled
                                  className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-500"
                                >
                                  {publicText.ctaBookingDisabled}
                                </button>
                              )
                            }
                            return (
                              <a
                                href={bookingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                              >
                                {publicText.ctaBooking}
                              </a>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {!Object.keys(groups).length && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
              {publicText.common.noUpcomingShifts}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
