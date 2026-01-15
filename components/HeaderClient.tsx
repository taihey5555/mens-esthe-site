"use client"

import { useState } from "react"
import Link from "next/link"

type NavLink = {
  href: string
  label: string
}

type HeaderClientProps = {
  bookingUrl: string | null
  bookingLabel: string
  navLinks: NavLink[]
}

export default function HeaderClient({
  bookingUrl,
  bookingLabel,
  navLinks,
}: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-rich-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center border border-gold/50 text-gold">
            <span className="material-symbols-outlined text-[24px]">spa</span>
          </div>
          <div className="flex flex-col leading-none">
            <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase">
              メンズエステ
            </h2>
            <span className="text-[10px] tracking-[0.3em] text-gold">
              極上の癒やしと洗練
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-xs font-medium tracking-widest text-white/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="rounded-full border border-white/20 p-2 text-white/80 transition-transform hover:rotate-90 lg:hidden"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          {bookingUrl ? (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden overflow-hidden bg-gold px-8 py-3 text-xs font-bold tracking-[0.2em] text-rich-black transition-all hover:bg-gold-light lg:inline-flex"
            >
              <span className="relative z-10">予約する</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="hidden cursor-not-allowed bg-white/10 px-8 py-3 text-xs font-bold tracking-[0.2em] text-white/40 lg:inline-flex"
            >
              {bookingLabel}
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 text-white"
          style={{ backgroundColor: "#000000" }}
        >
          <div className="flex h-full flex-col px-8 py-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold">MENU</p>
                <h3 className="mt-2 text-lg font-semibold text-white">メニュー</h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest text-white/70 transition-colors hover:text-gold"
              >
                閉じる
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-6 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-medium tracking-[0.2em] text-white/85 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-white/10 pt-6">
              {bookingUrl ? (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md bg-gold px-4 py-3 text-center text-sm font-bold tracking-[0.3em] text-rich-black transition-all hover:bg-gold-light"
                >
                  予約する
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="block w-full cursor-not-allowed rounded-md bg-white/10 px-4 py-3 text-sm font-bold tracking-[0.3em] text-white/40"
                >
                  {bookingLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
