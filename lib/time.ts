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

export function toJstDatetimeLocalValue(isoString: string): string {
  if (!isoString) return ""
  const date = new Date(isoString)
  const jstMs = date.getTime() + JST_OFFSET_MINUTES * 60 * 1000
  const jstDate = new Date(jstMs)
  const yyyy = jstDate.getUTCFullYear()
  const mm = String(jstDate.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(jstDate.getUTCDate()).padStart(2, "0")
  const hh = String(jstDate.getUTCHours()).padStart(2, "0")
  const min = String(jstDate.getUTCMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

export function jstDatetimeLocalToUtcIso(value: string): string {
  if (!value) return ""
  const [datePart, timePart] = value.split("T")
  if (!datePart || !timePart) return ""
  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute] = timePart.split(":").map(Number)
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return ""
  }
  const utcMs =
    Date.UTC(year, month - 1, day, hour, minute, 0) -
    JST_OFFSET_MINUTES * 60 * 1000
  return new Date(utcMs).toISOString()
}
