"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { adminText } from "@/lib/i18n/ja"

type Status = "checking" | "unauthenticated" | "forbidden" | "ready"

const navLinks = [
  { href: "/admin", label: adminText.nav.dashboard },
  { href: "/admin/therapists", label: adminText.nav.therapists },
  { href: "/admin/courses", label: adminText.nav.courses },
  { href: "/admin/shifts", label: adminText.nav.shifts },
  { href: "/admin/settings", label: adminText.nav.settings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<Status>("checking")
  const [userEmail, setUserEmail] = useState<string>("")

  const supabase = useMemo(() => getSupabase(), [])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (!isMounted) return
      if (!authData.user) {
        setStatus("unauthenticated")
        router.replace("/login")
        return
      }

      setUserEmail(authData.user.email ?? "")
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (!isMounted) return
      if (error || !profile?.is_admin) {
        setStatus("forbidden")
        return
      }
      setStatus("ready")
    }

    run()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        {adminText.adminShell.checking}
      </div>
    )
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-zinc-900">
            {adminText.adminShell.forbiddenTitle}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {adminText.adminShell.forbiddenBody}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline"
          >
            {adminText.common.backToSite}
          </Link>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "text-zinc-900" : "hover:text-zinc-900"}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            {userEmail && <span>{userEmail}</span>}
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              {adminText.common.signOut}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
