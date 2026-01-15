import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import { formatJstTime, getTodayStartUtcISOString } from "@/lib/time"
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
    })
    const parts = formatter.formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? ""
    return {
      year: get("year"),
      month: get("month"),
      day: get("day"),
    }
  }

  const getWeekdayLabel = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      weekday: "short",
    }).format(date)

  const groups =
    (shifts as ShiftRow[] | null)?.reduce<Record<string, ShiftRow[]>>(
      (acc, shift) => {
        const parts = getJstParts(new Date(shift.start_at))
        const dateKey = `${parts.year}-${parts.month}-${parts.day}`
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(shift)
        return acc
      },
      {}
    ) ?? {}

  const todayKey = (() => {
    const parts = getJstParts(new Date())
    return `${parts.year}-${parts.month}-${parts.day}`
  })()

  const dateList = Array.from({ length: selectedDays }, (_, index) => {
    const date = new Date(startDate)
    date.setUTCDate(date.getUTCDate() + index)
    const parts = getJstParts(date)
    const dateKey = `${parts.year}-${parts.month}-${parts.day}`
    return {
      dateKey,
      weekday: getWeekdayLabel(date),
      day: parts.day,
      isToday: dateKey === todayKey,
      shifts: groups[dateKey] ?? [],
    }
  })

  const formatRange = (start: Date, days: number) => {
    const format = (date: Date) =>
      new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo",
        month: "2-digit",
        day: "2-digit",
      }).format(date)
    const rangeEnd = new Date(start)
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + days - 1)
    return `${format(start)} - ${format(rangeEnd)}`
  }

  const buildHref = (options: { days?: number; room?: string }) => {
    const params = new URLSearchParams()
    const days = options.days ?? selectedDays
    const room = options.room ?? selectedRoomId
    if (room !== "all") {
      params.set("room", room)
    }
    params.set("days", String(days))
    return `/schedule?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-rich-black px-6 py-8 text-warm-gray">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-white">
              {publicText.sections.schedule}
            </h1>
            <p className="text-sm font-medium text-white/60">
              {formatRange(startDate, selectedDays)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/schedule"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              Today
            </Link>
            {globalBookingUrl ? (
              <a
                href={globalBookingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                予約する
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-10 min-w-[140px] cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white/10 px-6 text-sm font-bold text-white/40"
              >
                {publicText.ctaBookingDisabled}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-10 w-48 items-center justify-center rounded-lg bg-slate-100 p-1">
              {([7, 14] as const).map((days) => (
                <Link
                  key={days}
                  href={buildHref({ days })}
                  className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-bold leading-normal transition-all ${
                    selectedDays === days
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {days} Days
                </Link>
              ))}
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ room: "all" })}
                className={`flex h-9 items-center justify-center gap-x-2 rounded-lg border px-4 ${
                  selectedRoomId === "all"
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="text-sm font-bold leading-normal">
                  All Rooms
                </span>
              </Link>
              {(rooms as RoomRow[] | null)?.map((room) => (
                <Link
                  key={room.id}
                  href={buildHref({ room: room.id })}
                  className={`flex h-9 items-center justify-center gap-x-2 rounded-lg border px-4 ${
                    selectedRoomId === room.id
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm font-medium leading-normal">
                    {room.name}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    keyboard_arrow_down
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined">calendar_month</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <div className="grid min-w-[1200px] grid-cols-7 gap-4">
            {dateList.map((day) => (
              <div key={day.dateKey} className="flex flex-col gap-4">
                <div
                  className={`flex flex-col items-center rounded-xl py-4 shadow-sm ${
                    day.isToday
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      day.isToday ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {day.weekday}
                  </span>
                  <span
                    className={`text-2xl font-black ${
                      day.isToday ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {day.day}
                  </span>
                </div>
                {day.shifts.length ? (
                  <div className="space-y-3">
                    {day.shifts.map((shift) => (
                      <div
                        key={shift.id}
                        className={`group cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all ${
                          day.isToday
                            ? "border-slate-200 hover:border-primary"
                            : "border-slate-200 hover:border-primary"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                            {formatJstTime(shift.start_at)} -{" "}
                            {formatJstTime(shift.end_at)}
                          </span>
                          <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-primary">
                            more_vert
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                            <PlaceholderImage
                              src={shift.therapist?.main_image_url}
                              alt={shift.therapist?.name ?? ""}
                              size={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            {shift.therapist ? (
                              <Link
                                href={`/therapists/${shift.therapist.slug}`}
                                className="text-sm font-bold text-slate-900 hover:text-primary"
                              >
                                {shift.therapist.name}
                              </Link>
                            ) : (
                              <span className="text-sm font-bold text-slate-400">
                                {publicText.common.therapistTbd}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">
                              {shift.room?.name ?? publicText.common.roomTbd}
                              {shift.room?.area ? ` / ${shift.room.area}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300">
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-6 text-right text-xs text-white/40">
          Last updated: Just now
        </div>
      </div>
    </main>
  )
}
