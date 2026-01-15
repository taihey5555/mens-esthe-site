"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { formatJstDateTime } from "@/lib/time"

type ShiftRow = {
  id: string
  start_at: string
  end_at: string
  note: string | null
  is_active: boolean
  therapist: { id: string; name: string } | null
  room: { id: string; name: string } | null
}

type OptionRow = {
  id: string
  name: string
}

type ShiftForm = {
  id: string
  therapist_id: string
  room_id: string
  start_at: string
  end_at: string
  note: string
  is_active: boolean
}

const emptyForm: ShiftForm = {
  id: "",
  therapist_id: "",
  room_id: "",
  start_at: "",
  end_at: "",
  note: "",
  is_active: true,
}

export default function AdminShiftsPage() {
  const [items, setItems] = useState<ShiftRow[]>([])
  const [therapists, setTherapists] = useState<OptionRow[]>([])
  const [rooms, setRooms] = useState<OptionRow[]>([])
  const [form, setForm] = useState<ShiftForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOptions = async () => {
    const supabase = getSupabase()
    const [{ data: therapistData }, { data: roomData }] = await Promise.all([
      supabase.from("therapists").select("id,name").order("sort_order"),
      supabase.from("rooms").select("id,name").order("sort_order"),
    ])
    setTherapists((therapistData as OptionRow[]) ?? [])
    setRooms((roomData as OptionRow[]) ?? [])
  }

  const loadItems = async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("shifts")
      .select(
        "id,start_at,end_at,note,is_active,therapist:therapists(id,name),room:rooms(id,name)"
      )
      .order("start_at", { ascending: true })
    if (error) {
      setError(error.message)
    } else {
      const normalized =
        (data ?? []).map((row: any) => ({
          ...row,
          therapist: Array.isArray(row.therapist)
            ? row.therapist[0] ?? null
            : row.therapist ?? null,
          room: Array.isArray(row.room) ? row.room[0] ?? null : row.room ?? null,
        })) ?? []
      setItems(normalized as ShiftRow[])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadOptions()
    loadItems()
  }, [])

  const handleEdit = (item: ShiftRow) => {
    setForm({
      id: item.id,
      therapist_id: item.therapist?.id ?? "",
      room_id: item.room?.id ?? "",
      start_at: item.start_at,
      end_at: item.end_at,
      note: item.note ?? "",
      is_active: item.is_active,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shift?")) return
    const supabase = getSupabase()
    const { error } = await supabase.from("shifts").delete().eq("id", id)
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
      therapist_id: form.therapist_id,
      room_id: form.room_id,
      start_at: form.start_at,
      end_at: form.end_at,
      note: form.note || null,
      is_active: Boolean(form.is_active),
    }

    const { error } = form.id
      ? await supabase.from("shifts").update(payload).eq("id", form.id)
      : await supabase.from("shifts").insert(payload)

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
        <h1 className="text-2xl font-semibold text-zinc-900">Shifts</h1>
        <p className="text-sm text-zinc-600">Manage shift schedules.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Therapist</span>
            <select
              value={form.therapist_id}
              onChange={(event) =>
                setForm({ ...form, therapist_id: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              required
            >
              <option value="">Select therapist</option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Room</span>
            <select
              value={form.room_id}
              onChange={(event) =>
                setForm({ ...form, room_id: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              required
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Start (ISO UTC)</span>
            <input
              value={form.start_at}
              onChange={(event) =>
                setForm({ ...form, start_at: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              placeholder="2025-01-01T10:00:00Z"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">End (ISO UTC)</span>
            <input
              value={form.end_at}
              onChange={(event) =>
                setForm({ ...form, end_at: event.target.value })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              placeholder="2025-01-01T12:00:00Z"
              required
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-zinc-600">Note</span>
            <input
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm({ ...form, is_active: event.target.checked })
              }
            />
            <span>Active</span>
          </label>
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
            {form.id ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">List</h2>
        {loading ? (
          <p className="mt-3 text-sm text-zinc-500">Loading...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="py-2">Time (JST)</th>
                  <th className="py-2">Therapist</th>
                  <th className="py-2">Room</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">
                      {formatJstDateTime(item.start_at)} -{" "}
                      {formatJstDateTime(item.end_at)}
                    </td>
                    <td className="py-2">{item.therapist?.name ?? "-"}</td>
                    <td className="py-2">{item.room?.name ?? "-"}</td>
                    <td className="py-2">{item.is_active ? "Yes" : "No"}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="text-xs font-semibold text-zinc-700 underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-xs font-semibold text-red-600 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td className="py-3 text-sm text-zinc-500" colSpan={5}>
                      No shifts found.
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
