import { getSupabase } from "@/lib/supabase/client"
import { publicText } from "@/lib/i18n/ja"
import HeaderClient from "@/components/HeaderClient"

const navLinks = [
  { href: "/", label: "トップ" },
  { href: "/therapists", label: "セラピスト" },
  { href: "/schedule", label: "出勤情報" },
  { href: "/pricing", label: "料金" },
  { href: "/access", label: "アクセス" },
  { href: "/recruit", label: "求人" },
]

export default async function Header() {
  let bookingUrl: string | null = null

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("site_settings")
      .select("global_booking_url")
      .limit(1)
      .single()

    bookingUrl = error ? null : data?.global_booking_url ?? null
  } catch {
    bookingUrl = null
  }

  return (
    <HeaderClient
      bookingUrl={bookingUrl}
      bookingLabel={publicText.ctaBookingDisabled}
      navLinks={navLinks}
    />
  )
}
