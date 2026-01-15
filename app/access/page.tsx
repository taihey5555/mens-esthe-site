import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase/client"

export const metadata: Metadata = {
  title: "Access | Mens Esthe Official Site",
  description: "Access information for treatment rooms.",
  openGraph: {
    title: "Access | Mens Esthe Official Site",
    description: "Access information for treatment rooms.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Access | Mens Esthe Official Site",
    description: "Access information for treatment rooms.",
  },
}

type RoomRow = {
  id: string
  name: string
  area: string | null
  access_note: string | null
  sort_order: number
}

export default async function AccessPage() {
  const supabase = getSupabase()
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id,name,area,access_note,sort_order")
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">Access</h1>
          <p className="text-sm text-zinc-600">
            Room locations and access notes.
          </p>
        </header>

        <div className="space-y-3">
          {(rooms as RoomRow[] | null)?.map((room) => (
            <div
              key={room.id}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="text-base font-semibold text-zinc-900">
                {room.name}
              </div>
              {room.area && (
                <div className="text-sm text-zinc-600">{room.area}</div>
              )}
              {room.access_note && (
                <p className="mt-2 text-sm text-zinc-600">
                  {room.access_note}
                </p>
              )}
            </div>
          ))}
          {!rooms?.length && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
              No rooms available yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
