"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { adminText } from "@/lib/i18n/ja"

type SettingsRow = {
  id: string
  global_booking_url: string | null
  line_url: string | null
  instagram_url: string | null
  x_url: string | null
  notice_text: string | null
}

const emptyForm: SettingsRow = {
  id: "",
  global_booking_url: "",
  line_url: "",
  instagram_url: "",
  x_url: "",
  notice_text: "",
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsRow>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "id,global_booking_url,line_url,instagram_url,x_url,notice_text"
      )
      .limit(1)
      .single()
    if (error) {
      setError(error.message)
    } else if (data) {
      setForm({
        id: data.id,
        global_booking_url: data.global_booking_url ?? "",
        line_url: data.line_url ?? "",
        instagram_url: data.instagram_url ?? "",
        x_url: data.x_url ?? "",
        notice_text: data.notice_text ?? "",
      })
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = getSupabase()
    const payload = {
      global_booking_url: form.global_booking_url || null,
      line_url: form.line_url || null,
      instagram_url: form.instagram_url || null,
      x_url: form.x_url || null,
      notice_text: form.notice_text || null,
    }

    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", form.id)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">{adminText.settings.loading}</p>
    )
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {adminText.settings.title}
        </h1>
        <p className="text-sm text-zinc-600">
          {adminText.settings.description}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-zinc-600">
              {adminText.settings.globalBookingUrl}
            </span>
            <input
              value={form.global_booking_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, global_booking_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">{adminText.settings.lineUrl}</span>
            <input
              value={form.line_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, line_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">
              {adminText.settings.instagramUrl}
            </span>
            <input
              value={form.instagram_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, instagram_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">{adminText.settings.xUrl}</span>
            <input
              value={form.x_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, x_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-zinc-600">
              {adminText.settings.noticeText}
            </span>
            <textarea
              value={form.notice_text ?? ""}
              onChange={(event) =>
                setForm({ ...form, notice_text: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              rows={3}
            />
          </label>
        </div>
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? adminText.settings.saving : adminText.settings.save}
        </button>
      </form>
    </section>
  )
}
