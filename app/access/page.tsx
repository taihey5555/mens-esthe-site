import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"

export const metadata: Metadata = {
  title: publicText.metadata.access.title,
  description: publicText.metadata.access.description,
  openGraph: {
    title: publicText.metadata.access.title,
    description: publicText.metadata.access.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: publicText.metadata.access.title,
    description: publicText.metadata.access.description,
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
    <main className="min-h-screen bg-rich-black px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            {publicText.sections.access}
          </h1>
          <p className="text-sm text-white/60">
            ルームの場所とアクセス方法をご案内します。
          </p>
        </header>

        <div className="space-y-3">
          {(rooms as RoomRow[] | null)?.map((room) => (
            <div
              key={room.id}
              className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-sm"
            >
              <div className="text-base font-semibold text-white">
                {room.name}
              </div>
              {room.area && (
                <div className="text-sm text-white/60">{room.area}</div>
              )}
              {room.access_note && (
                <p className="mt-2 text-sm text-white/60">
                  {room.access_note}
                </p>
              )}
            </div>
          ))}
          {!rooms?.length && (
            <div className="rounded-lg border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
              ルーム情報がありません。
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
