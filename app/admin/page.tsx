"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { adminText } from "@/lib/i18n/ja"

type Counts = Record<string, number | null>

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    const loadCounts = async () => {
      const tables = [
        "therapists",
        "courses",
        "shifts",
        "rooms",
        "site_settings",
      ]

      const results = await Promise.all(
        tables.map(async (table) => {
          const { count } = await supabase
            .from(table)
            .select("id", { count: "exact", head: true })
          return [table, count ?? 0] as const
        })
      )

      setCounts(Object.fromEntries(results))
      setLoading(false)
    }

    loadCounts()
  }, [])

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {adminText.dashboard.title}
        </h1>
        <p className="text-sm text-zinc-600">
          {adminText.dashboard.description}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["therapists", "courses", "shifts", "rooms", "site_settings"].map(
          (table) => (
            <div
              key={table}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="text-sm text-zinc-500">{table}</div>
              <div className="mt-2 text-2xl font-semibold text-zinc-900">
                {loading ? "-" : counts[table] ?? 0}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}
