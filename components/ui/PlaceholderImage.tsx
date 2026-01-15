import React from "react"

type PlaceholderImageProps = {
  alt: string
  src?: string | null
  size?: number
  className?: string
}

const placeholderSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f4f4f5"/>
        <stop offset="100%" stop-color="#e4e4e7"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="16" fill="url(#g)"/>
    <circle cx="80" cy="68" r="22" fill="#d4d4d8"/>
    <path d="M40 124c10-20 30-30 40-30s30 10 40 30" fill="#d4d4d8"/>
  </svg>`
)

const placeholderDataUrl = `data:image/svg+xml;utf8,${placeholderSvg}`

export default function PlaceholderImage({
  alt,
  src,
  size = 160,
  className,
}: PlaceholderImageProps) {
  const imageSrc = src && src.trim() ? src : placeholderDataUrl
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  )
}
