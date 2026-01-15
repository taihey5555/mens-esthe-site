"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase/client"
import { adminText } from "@/lib/i18n/ja"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/admin")
      }
    })
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = getSupabase()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    router.replace("/admin")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            {adminText.login.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {adminText.login.description}
          </p>
        </div>

        <label className="block space-y-1 text-sm">
          <span className="text-zinc-600">{adminText.login.email}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-zinc-600">{adminText.login.password}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? adminText.login.submitting : adminText.login.submit}
        </button>
      </form>
    </main>
  )
}
