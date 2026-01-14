import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

const navLinks = [
  { href: "/", label: "トップ" },
  { href: "/therapists", label: "セラピスト" },
  { href: "/schedule", label: "スケジュール" },
  { href: "/pricing", label: "料金" },
  { href: "/access", label: "アクセス" },
  { href: "/recruit", label: "求人" },
]

export default async function Header() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("global_booking_url")
    .limit(1)
    .single()

  const bookingUrl = error ? null : data?.global_booking_url ?? null

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-700">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-zinc-900">
              {link.label}
            </Link>
          ))}
        </nav>
        {bookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            今すぐ予約
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-md bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-500"
          >
            予約準備中
          </button>
        )}
      </div>
    </header>
  )
}
