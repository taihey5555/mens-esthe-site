"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { adminText } from "@/lib/i18n/ja"

type TherapistRow = {
  id: string
  name: string
  slug: string
  main_image_url: string | null
  profile_text: string | null
  booking_url: string | null
  sort_order: number
  is_newface: boolean
  is_active: boolean
}

const emptyForm: TherapistRow = {
  id: "",
  name: "",
  slug: "",
  main_image_url: "",
  profile_text: "",
  booking_url: "",
  sort_order: 0,
  is_newface: false,
  is_active: true,
}

export default function AdminTherapistsPage() {
  const [items, setItems] = useState<TherapistRow[]>([])
  const [form, setForm] = useState<TherapistRow>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadItems = async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("therapists")
      .select(
        "id,name,slug,main_image_url,profile_text,booking_url,sort_order,is_newface,is_active"
      )
      .order("sort_order", { ascending: true })
    if (error) {
      setError(error.message)
    } else {
      setItems((data as TherapistRow[]) ?? [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleEdit = (item: TherapistRow) => {
    setForm({
      ...item,
      main_image_url: item.main_image_url ?? "",
      profile_text: item.profile_text ?? "",
      booking_url: item.booking_url ?? "",
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm(adminText.therapists.deleteConfirm)) return
    const supabase = getSupabase()
    const { error } = await supabase.from("therapists").delete().eq("id", id)
    if (error) {
      setError(error.message)
      return
    }
    await loadItems()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = getSupabase()
    const payload = {
      name: form.name,
      slug: form.slug,
      main_image_url: form.main_image_url || null,
      profile_text: form.profile_text || null,
      booking_url: form.booking_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_newface: Boolean(form.is_newface),
      is_active: Boolean(form.is_active),
    }

    const { error } = form.id
      ? await supabase.from("therapists").update(payload).eq("id", form.id)
      : await supabase.from("therapists").insert(payload)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setForm(emptyForm)
    await loadItems()
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {adminText.therapists.title}
        </h1>
        <p className="text-sm text-zinc-600">
          {adminText.therapists.description}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">{adminText.therapists.name}</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">{adminText.therapists.slug}</span>
            <input
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">
              {adminText.therapists.mainImageUrl}
            </span>
            <input
              value={form.main_image_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, main_image_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">
              {adminText.therapists.bookingUrl}
            </span>
            <input
              value={form.booking_url ?? ""}
              onChange={(event) =>
                setForm({ ...form, booking_url: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-zinc-600">
              {adminText.therapists.profileText}
            </span>
            <textarea
              value={form.profile_text ?? ""}
              onChange={(event) =>
                setForm({ ...form, profile_text: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              rows={3}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">
              {adminText.therapists.sortOrder}
            </span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) =>
                setForm({ ...form, sort_order: Number(event.target.value) })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.checked })
                }
              />
              <span>{adminText.common.active}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_newface}
                onChange={(event) =>
                  setForm({ ...form, is_newface: event.target.checked })
                }
              />
              <span>{adminText.therapists.isNewface}</span>
            </label>
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {form.id ? adminText.common.update : adminText.common.create}
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
          >
            {adminText.common.clear}
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          {adminText.common.list}
        </h2>
        {loading ? (
          <p className="mt-3 text-sm text-zinc-500">
            {adminText.common.loading}
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="py-2">{adminText.therapists.name}</th>
                  <th className="py-2">{adminText.therapists.slug}</th>
                  <th className="py-2">{adminText.common.active}</th>
                  <th className="py-2">{adminText.therapists.sortOrder}</th>
                  <th className="py-2">{adminText.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.slug}</td>
                    <td className="py-2">
                      {item.is_active ? adminText.common.yes : adminText.common.no}
                    </td>
                    <td className="py-2">{item.sort_order}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="text-xs font-semibold text-zinc-700 underline"
                        >
                          {adminText.common.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-xs font-semibold text-red-600 underline"
                        >
                          {adminText.common.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td className="py-3 text-sm text-zinc-500" colSpan={5}>
                      {adminText.therapists.noItems}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
