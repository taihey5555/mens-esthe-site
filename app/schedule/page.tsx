import type { Metadata } from "next"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"
import {
  formatJstDateTime,
  formatJstTime,
  getTodayStartUtcISOString,
} from "@/lib/time"
import { publicText } from "@/lib/i18n/ja"

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
  note: string | null
  therapist: {
    id: string
    name: string
    slug: string
    main_image_url: string | null
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
  searchParams?: Promise<{ room?: string }>
}) {
  const supabase = getSupabase()
  const todayStartUtc = getTodayStartUtcISOString()
  const resolvedSearchParams = await searchParams
  const selectedRoomId = resolvedSearchParams?.room ?? "all"

  const roomsPromise = supabase
    .from("rooms")
    .select("id,name,area,sort_order")
    .order("sort_order", { ascending: true })

  const shiftsQuery = supabase
    .from("shifts")
    .select(
      "id,start_at,end_at,note,therapist:therapists(id,name,slug,main_image_url),room:rooms(id,name,area)"
    )
    .gte("start_at", todayStartUtc)
    .order("start_at", { ascending: true })

  if (selectedRoomId !== "all") {
    shiftsQuery.eq("room_id", selectedRoomId)
  }

  const [{ data: rooms }, { data: shifts }] = await Promise.all([
    roomsPromise,
    shiftsQuery,
  ])

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

        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600" htmlFor="room">
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
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            {publicText.common.apply}
          </button>
        </form>

        <div className="space-y-4">
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
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {shift.therapist ? (
                  <Link
                    href={`/therapists/${shift.therapist.slug}`}
                    className="text-sm font-medium text-zinc-900 underline"
                  >
                    {shift.therapist.name}
                  </Link>
                ) : (
                  <span className="text-sm text-zinc-500">
                    {publicText.common.therapistTbd}
                  </span>
                )}
                {shift.note && (
                  <span className="text-xs text-zinc-500">{shift.note}</span>
                )}
              </div>
            </div>
          ))}
          {!shifts?.length && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
              {publicText.common.noUpcomingShifts}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
