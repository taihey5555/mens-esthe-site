import Link from "next/link"
import { getSupabase } from "@/lib/supabase/client"

type TherapistCard = {
  id: string
  name: string
  slug: string
  main_image_url: string | null
  profile_text: string | null
}

const fallbackTherapists = [
  {
    id: "fallback-1",
    name: "Mika Tanaka",
    slug: "mika-tanaka",
    main_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBon8gRFlm4tp5dcLp92dSXCT1phCoWAc_ihaDX1maY5XuPHWaO11uD1rojT42Fg1LSSQkSpswxkT4AYPcNuAGmEEGp3tgbANDBtNnHV5zwKuneFSoE0DP_EJMCfMUctui2C2RfvI4p47rekI8qsNdhHOb_rroOOuTqPW14oW5Zp_dfoaPHJtE2E6j3wb8GACQbI6GkwmR4s6uF_zT5965XBo9fZdMW18Y-mYoJAeLDshUMzfgJi16onyUgtcTDfANK3GilGUv1sng",
    profile_text: "Deep tissue & Anti-aging specialist",
  },
  {
    id: "fallback-2",
    name: "Hana Sato",
    slug: "hana-sato",
    main_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8_p3ykfkaM_efgRoc00pSNyiv8wYEf3z0JByCXGZxbr_wEPd40Jy-BAvoWnnN-4Z-vACFmInGZjWqLdexuO-RLtYBYhOkvEAXp9tbEhIwgMAQnzW-ZXbJf7YFUBsL903pTaIu508-TB0tkzmWlgokAI1es9nyT747lYzu4z3f6X1UG9tfn7ZQ3IMSY-Cke8EaInXlE9uvFAyOZnUfjz1VPYRzygQ8XnDXtFYxCNpNPyxnJ1nDYeNWtrcmA6FOWLVreeg0XErGdgc",
    profile_text: "Hydration & Pore refinement expert",
  },
  {
    id: "fallback-3",
    name: "Aoi Watanabe",
    slug: "aoi-watanabe",
    main_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtehUk8PhEyy9NEW3wOppzOt0ZMBEcPYhUDTCm8Zf5-PWlkZZC_C-r6uk3XSZqPJKTULyKNcC7JY0EEs82G3fRjwilo0CerZYxdhs2-DO1K6z7pP_o1MU4ymn-rrSgpy88tx85PHNTRv78ZxHOd2zi9SHuZN6cN7qnp4YoU3Vo0ZMhEYmfYKQ8MnDKfbGYbaSbKAAV3rxrPcB2yKI21Skz8OK4Jljv236Zyc-tGhXS1tVQPVwFoE3Xv6sywSMGZU4OjEZH4grr9ic",
    profile_text: "Stress reduction & Recovery session",
  },
]

const roleLabels = ["Senior Therapist", "Skin Specialist", "Wellness Expert"]

export default async function Home() {
  let bookingUrl: string | null = null
  let noticeText: string | null = null
  let instagramUrl: string | null = null
  let lineUrl: string | null = null
  let xUrl: string | null = null
  let therapists: TherapistCard[] = []

  try {
    const supabase = getSupabase()
    const [settingsResult, therapistsResult] = await Promise.all([
      supabase
        .from("site_settings")
        .select("global_booking_url,notice_text,instagram_url,line_url,x_url")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("therapists")
        .select("id,name,slug,main_image_url,profile_text,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(3),
    ])

    bookingUrl = settingsResult.data?.global_booking_url ?? null
    noticeText = settingsResult.data?.notice_text ?? null
    instagramUrl = settingsResult.data?.instagram_url ?? null
    lineUrl = settingsResult.data?.line_url ?? null
    xUrl = settingsResult.data?.x_url ?? null
    therapists = (therapistsResult.data as TherapistCard[] | null) ?? []
  } catch {
    bookingUrl = null
    noticeText = null
    therapists = []
  }

  const therapistCards =
    therapists.length > 0 ? therapists : (fallbackTherapists as TherapistCard[])

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1">
        <section className="relative flex min-h-screen w-full items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaX8Rmfbz3Fd3H93PoI-oN_iNmPXekAaK4QNNCTp57KH4bZ7QALBE_dhbWn707f1wmHfxqLqS_ljfauGDuMuk7pVDXTasnl1qtut1uWfwWZZoBJsIZrKcGiqQ2JpT-nKKRVixwSkVoizSocPCcozAh_hMh1ZV8pxlR5UEXeZyDvARxJ9dxVhAVJpB2DjzeDPV7fDJE5TPeS8q9sUwmNw1uynlx12wg3JeEacZYTVZRnIHCPBgDGEEZ_i1LhYQm5AmBSBZW6p8qyss")',
            }}
          >
            <div className="hero-gradient absolute inset-0"></div>
          </div>
          <div className="relative mx-auto w-full max-w-[1400px] px-8 pt-20">
            <div className="max-w-4xl space-y-8">
              <div className="inline-block border-l-2 border-gold pl-4">
                <p className="mb-2 text-sm font-bold tracking-[0.4em] text-gold uppercase">
                  Luxury Grooming for Gentlemen
                </p>
              </div>
              <div className="space-y-4">
                <h1 className="serif-font text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-8xl">
                  日常を脱ぎ捨て、
                  <br />
                  真の寛ぎへ。
                </h1>
                <p className="serif-font text-lg font-light leading-relaxed text-white/80 md:text-2xl">
                  洗練された空間と、熟練の技術。
                  <br className="hidden md:block" />
                  都会の喧騒を忘れ、心身を研ぎ澄ます至高のひとときを。
                </p>
              </div>
              <div className="flex flex-col gap-6 pt-10 sm:flex-row">
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 min-w-[240px] items-center justify-center gap-3 bg-gold font-bold tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-light"
                  >
                    <span className="material-symbols-outlined">calendar_month</span>
                    RESERVATION
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex h-16 min-w-[240px] cursor-not-allowed items-center justify-center gap-3 bg-white/10 font-bold tracking-[0.2em] text-white/40"
                  >
                    RESERVATION
                  </button>
                )}
                <Link
                  href="/pricing"
                  className="flex h-16 min-w-[240px] items-center justify-center gap-3 border border-white/20 bg-white/5 font-bold tracking-[0.2em] text-white backdrop-blur-md transition-colors hover:bg-white/10"
                >
                  SERVICE MENU
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 opacity-50">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white">
              Scroll
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-gold to-transparent"></div>
          </div>
        </section>

        {noticeText && (
          <div className="relative z-10 w-full bg-gold py-4">
            <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-4 px-8 text-rich-black md:flex-row">
              <span className="bg-rich-black px-3 py-0.5 text-[10px] font-bold tracking-widest text-white">
                IMPORTANT
              </span>
              <p className="text-center text-sm font-bold tracking-wider">
                {noticeText}
              </p>
            </div>
          </div>
        )}

        <section className="bg-charcoal py-32">
          <div className="mx-auto max-w-[1400px] px-8">
            <div className="mb-20 text-center">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-gold">
                The Boutique Experience
              </span>
              <h2 className="serif-font text-4xl font-black italic text-white md:text-5xl">
                Why Choose Us
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  icon: "shield_person",
                  title: "Total Privacy",
                  text: "完全個室のプライベート空間で、他のお客様と顔を合わせることなく、貴方だけの贅沢な時間をお約束します。",
                },
                {
                  icon: "sanitizer",
                  title: "Cleanliness",
                  text: "最高水準の衛生管理を徹底。厳選されたリネンと殺菌済みの器具のみを使用し、常に清潔な環境を維持しております。",
                },
                {
                  icon: "verified",
                  title: "Professionalism",
                  text: "独自の厳しい研修をクリアしたセラピストが、卓越した手技で貴方の疲れを芯から解きほぐします。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden border border-white/5 bg-rich-black/40 p-12 transition-all hover:border-gold/30"
                >
                  <div className="absolute left-0 top-0 h-0 w-1 bg-gold transition-all duration-500 group-hover:h-full"></div>
                  <span className="material-symbols-outlined mb-8 text-5xl text-gold/60">
                    {item.icon}
                  </span>
                  <h3 className="serif-font mb-6 text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-rich-black py-32">
          <div className="mx-auto max-w-[1400px] px-8">
            <div className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div className="text-left">
                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-gold">
                  Dedicated Specialists
                </span>
                <h2 className="serif-font text-4xl font-black text-white md:text-5xl">
                  Therapists
                </h2>
              </div>
              <Link
                href="/therapists"
                className="group flex items-center gap-4 border-b border-gold/30 pb-2 text-xs font-bold tracking-[0.2em] text-gold transition-colors hover:border-gold"
              >
                VIEW ALL THERAPISTS
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              {therapistCards.map((therapist, index) => {
                const roleLabel = roleLabels[index] ?? "Therapist"
                const profileText =
                  therapist.profile_text ?? "Signature treatment specialist"

                return (
                  <div key={therapist.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden grayscale transition-all duration-700 group-hover:grayscale-0">
                      <div className="absolute inset-0 bg-gold/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      <div
                        className="h-full w-full bg-charcoal"
                        style={{
                          backgroundImage: therapist.main_image_url
                            ? `url("${therapist.main_image_url}")`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-8 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <Link
                          href={`/therapists/${therapist.slug}`}
                          className="flex w-full items-center justify-center border border-white/20 bg-white/10 py-4 text-xs font-bold tracking-widest text-white backdrop-blur-md hover:bg-white/20"
                        >
                          VIEW PROFILE
                        </Link>
                      </div>
                    </div>
                    <div className="mt-8 space-y-2 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                        {roleLabel}
                      </p>
                      <h3 className="serif-font text-2xl font-bold tracking-wider text-white">
                        {therapist.name}
                      </h3>
                      <p className="text-sm italic text-white/40">{profileText}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-charcoal py-32">
          <div className="mx-auto max-w-[1400px] px-8">
            <div className="grid gap-20 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-gold"></span>
                  <h3 className="serif-font flex items-center gap-4 text-2xl font-bold text-white">
                    Today's Availability
                  </h3>
                </div>
                <div className="space-y-0 border-t border-white/10">
                  {[
                    { time: "12:00 - 14:00", status: "FULL", isFull: true },
                    { time: "14:00 - 16:00", status: "RESERVABLE" },
                    { time: "16:00 - 18:00", status: "RESERVABLE" },
                    { time: "18:00 - 20:00", status: "FULL", isFull: true },
                    { time: "20:00 - 22:00", status: "RESERVABLE" },
                  ].map((slot) => (
                    <div
                      key={slot.time}
                      className="group flex items-center justify-between border-b border-white/5 px-4 py-6 transition-colors hover:bg-white/5"
                    >
                      <span
                        className={`font-medium tracking-widest ${
                          slot.isFull ? "text-white/60" : "text-white"
                        }`}
                      >
                        {slot.time}
                      </span>
                      <span
                        className={`border px-3 py-1 text-[10px] font-bold tracking-widest ${
                          slot.isFull
                            ? "border-red-500/30 text-red-500/80"
                            : "border-gold text-gold"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                  ))}
                </div>
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-gold py-5 text-center font-bold tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-rich-black"
                  >
                    ONLINE RESERVATION
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed border border-white/10 py-5 text-center font-bold tracking-[0.2em] text-white/40"
                  >
                    ONLINE RESERVATION
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10">
                <Link
                  href="/pricing"
                  className="group flex aspect-square flex-col items-center justify-center bg-rich-black p-8 transition-colors hover:bg-charcoal"
                >
                  <span className="material-symbols-outlined mb-6 text-4xl text-gold/60 transition-transform group-hover:scale-110">
                    payments
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] text-white">
                    PRICING
                  </span>
                </Link>
                <Link
                  href="/access"
                  className="group flex aspect-square flex-col items-center justify-center bg-rich-black p-8 transition-colors hover:bg-charcoal"
                >
                  <span className="material-symbols-outlined mb-6 text-4xl text-gold/60 transition-transform group-hover:scale-110">
                    map
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] text-white">
                    ACCESS
                  </span>
                </Link>
                <Link
                  href="/pricing"
                  className="group flex aspect-square flex-col items-center justify-center bg-rich-black p-8 transition-colors hover:bg-charcoal"
                >
                  <span className="material-symbols-outlined mb-6 text-4xl text-gold/60 transition-transform group-hover:scale-110">
                    help
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] text-white">
                    FAQ
                  </span>
                </Link>
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex aspect-square flex-col items-center justify-center bg-rich-black p-8 transition-colors hover:bg-charcoal"
                  >
                    <span className="material-symbols-outlined mb-6 text-4xl text-gold transition-transform group-hover:scale-110">
                      chat
                    </span>
                    <span className="text-sm font-bold tracking-[0.2em] text-gold">
                      CONSULT
                    </span>
                  </a>
                ) : (
                  <div className="flex aspect-square flex-col items-center justify-center bg-rich-black p-8 text-gold/40">
                    <span className="material-symbols-outlined mb-6 text-4xl">
                      chat
                    </span>
                    <span className="text-sm font-bold tracking-[0.2em]">
                      CONSULT
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-rich-black py-32">
          <div className="mx-auto max-w-[1400px] px-8">
            <div className="flex flex-col overflow-hidden border border-white/10 lg:flex-row">
              <div className="flex-1 bg-charcoal p-12 lg:p-20">
                <h2 className="serif-font mb-12 text-4xl font-bold text-white">
                  Contact &amp; Access
                </h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <span className="material-symbols-outlined mt-1 text-gold">
                      location_on
                    </span>
                    <div>
                      <p className="mb-2 text-lg font-bold text-white">
                        Tokyo, Chuo City, Ginza 5-1-2
                      </p>
                      <p className="text-sm text-white/50">
                        3rd Floor, Grand Ginza Building
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="material-symbols-outlined mt-1 text-gold">
                      schedule
                    </span>
                    <div>
                      <p className="mb-2 text-lg font-bold text-white">
                        Daily 11:00 AM - 10:00 PM
                      </p>
                      <p className="text-sm text-white/50">
                        Last entry at 8:30 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="material-symbols-outlined mt-1 text-gold">
                      call
                    </span>
                    <div>
                      <p className="mb-2 text-lg font-bold text-white">
                        03-1234-5678
                      </p>
                      <p className="text-sm text-white/50">
                        Reservation Desk (English Available)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-16">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                    Precautions
                  </p>
                  <ul className="space-y-4">
                    {[
                      "無断キャンセルや直前の時間変更は、キャンセル料が発生する場合がございます。",
                      "ご予約時間の10分前にお越しいただけますと幸いです。",
                      "飲酒をされている方、体調が優れない方への施術はお断りしております。",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-4 text-xs leading-relaxed text-white/40"
                      >
                        <span className="text-gold"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="flex-1 bg-charcoal opacity-70 grayscale contrast-125 lg:h-auto"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4O_C1qnrsqn56h6C299-VyK1VFdfjToMhYloghqJtk4FYCuBJ7TiSdRxodhQRAbin5NQHEUWJk9OycPkOE8ASeJ5IZE6Mod2Oncdqlqm3tTNR1b61dOzKyserogXjydHqdxP-CTsrjdiD7EfSgJxvjjeAdYQrBUkyHRzy6qdPf33qnFE3MHq9NRpdrIaQq5qo_vhcKG1okaWx6MHbCT5iZTP45XIVQEp660ZCWJA9ekm1jOOo68qCF2-vyVlumY6EaHYrBm0ApcI")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div className="mt-32 text-center">
              <h3 className="serif-font mb-10 text-3xl font-bold text-white">
                特別な体験を、今すぐ予約する。
              </h3>
              {bookingUrl ? (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold px-16 py-6 font-black tracking-[0.3em] text-rich-black shadow-2xl transition-all hover:bg-gold-light"
                >
                  BOOK YOUR SESSION
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed bg-white/10 px-16 py-6 font-black tracking-[0.3em] text-white/40"
                >
                  BOOK YOUR SESSION
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-rich-black py-20">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center border border-gold/30 text-gold/50">
                <span className="material-symbols-outlined text-[20px]">
                  spa
                </span>
              </div>
              <h2 className="text-lg font-black tracking-[0.3em] text-white uppercase">
                Men's Esthetic
              </h2>
            </div>
            <div className="flex gap-10">
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-widest text-white/30 transition-colors hover:text-gold"
                >
                  INSTAGRAM
                </a>
              ) : (
                <span className="text-[10px] tracking-widest text-white/20">
                  INSTAGRAM
                </span>
              )}
              {lineUrl ? (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-widest text-white/30 transition-colors hover:text-gold"
                >
                  LINE
                </a>
              ) : (
                <span className="text-[10px] tracking-widest text-white/20">
                  LINE
                </span>
              )}
              {xUrl ? (
                <a
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-widest text-white/30 transition-colors hover:text-gold"
                >
                  X (TWITTER)
                </a>
              ) : (
                <span className="text-[10px] tracking-widest text-white/20">
                  X (TWITTER)
                </span>
              )}
            </div>
          </div>
          <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-10 text-[10px] tracking-widest text-white/20 md:flex-row">
            <p>2024 MEN'S ESTHETIC SHOP. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a className="transition-colors hover:text-gold" href="#">
                PRIVACY POLICY
              </a>
              <a className="transition-colors hover:text-gold" href="#">
                TERMS OF SERVICE
              </a>
              <a className="transition-colors hover:text-gold" href="#">
                LEGAL DISCLOSURE
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
