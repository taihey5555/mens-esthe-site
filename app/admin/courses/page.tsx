"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"

type CourseRow = {
  id: string
  name: string
  duration_min: number
  price: number
  sort_order: number
  is_active: boolean
}

const emptyForm: CourseRow = {
  id: "",
  name: "",
  duration_min: 60,
  price: 0,
  sort_order: 0,
  is_active: true,
}

export default function AdminCoursesPage() {
  const [items, setItems] = useState<CourseRow[]>([])
  const [form, setForm] = useState<CourseRow>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadItems = async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("courses")
      .select("id,name,duration_min,price,sort_order,is_active")
      .order("sort_order", { ascending: true })
    if (error) {
      setError(error.message)
    } else {
      setItems((data as CourseRow[]) ?? [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleEdit = (item: CourseRow) => {
    setForm({ ...item })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return
    const supabase = getSupabase()
    const { error } = await supabase.from("courses").delete().eq("id", id)
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
      duration_min: Number(form.duration_min) || 0,
      price: Number(form.price) || 0,
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
    }

    const { error } = form.id
      ? await supabase.from("courses").update(payload).eq("id", form.id)
      : await supabase.from("courses").insert(payload)

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
        <h1 className="text-2xl font-semibold text-zinc-900">Courses</h1>
        <p className="text-sm text-zinc-600">Manage course pricing.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Duration (min)</span>
            <input
              type="number"
              value={form.duration_min}
              onChange={(event) =>
                setForm({ ...form, duration_min: Number(event.target.value) })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Price (JPY)</span>
            <input
              type="number"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: Number(event.target.value) })
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-600">Sort order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) =>
                setForm({ ...form, sort_order: Number(event.target.value) })
              }
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
                  <th className="py-2">Name</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Sort</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.duration_min} min</td>
                    <td className="py-2">{item.price}</td>
                    <td className="py-2">{item.is_active ? "Yes" : "No"}</td>
                    <td className="py-2">{item.sort_order}</td>
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
                    <td className="py-3 text-sm text-zinc-500" colSpan={6}>
                      No courses found.
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
