const JST_OFFSET_MINUTES = 9 * 60

export function getTodayStartUtcISOString(): string {
  const now = new Date()
  const jstNow = new Date(now.getTime() + JST_OFFSET_MINUTES * 60 * 1000)
  const y = jstNow.getUTCFullYear()
  const m = jstNow.getUTCMonth()
  const d = jstNow.getUTCDate()
  const jstMidnightUtcMs =
    Date.UTC(y, m, d, 0, 0, 0) - JST_OFFSET_MINUTES * 60 * 1000
  return new Date(jstMidnightUtcMs).toISOString()
}

export function formatJstDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatJstTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  })
}
