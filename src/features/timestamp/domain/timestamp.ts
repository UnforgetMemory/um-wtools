export interface TimezoneEntry {
  id: string
  label: string
  city: string
}

export interface TimezoneResult {
  tz: TimezoneEntry
  iso: string
  human: string
}

export interface TimestampResults {
  unixSeconds: number
  unixMilliseconds: number
  isoLocal: string
  timezones: TimezoneResult[]
}

export type InputType = "unix-seconds" | "unix-milliseconds" | "iso" | null

export interface ParseResult {
  type: InputType
  date: Date | null
}

/**
 * Curated list of timezones shown in the timezone table.
 *
 * The second entry uses the browser's local timezone so the table always
 * includes the user's own zone without hardcoding a specific region.
 */
const ALL_TIMEZONES: TimezoneEntry[] = [
  { id: "UTC", label: "UTC", city: "UTC" },
  { id: Intl.DateTimeFormat().resolvedOptions().timeZone, label: "Local", city: "Local" },
  { id: "Asia/Shanghai", label: "Asia/Shanghai", city: "Shanghai" },
  { id: "Asia/Tokyo", label: "Asia/Tokyo", city: "Tokyo" },
  { id: "Asia/Seoul", label: "Asia/Seoul", city: "Seoul" },
  { id: "Asia/Singapore", label: "Asia/Singapore", city: "Singapore" },
  { id: "Asia/Kolkata", label: "Asia/Kolkata", city: "Kolkata" },
  { id: "Asia/Dubai", label: "Asia/Dubai", city: "Dubai" },
  { id: "Europe/London", label: "Europe/London", city: "London" },
  { id: "Europe/Paris", label: "Europe/Paris", city: "Paris" },
  { id: "Europe/Berlin", label: "Europe/Berlin", city: "Berlin" },
  { id: "Europe/Moscow", label: "Europe/Moscow", city: "Moscow" },
  { id: "America/New_York", label: "America/New_York", city: "New York" },
  { id: "America/Chicago", label: "America/Chicago", city: "Chicago" },
  { id: "America/Denver", label: "America/Denver", city: "Denver" },
  { id: "America/Los_Angeles", label: "America/Los_Angeles", city: "Los Angeles" },
  { id: "Australia/Sydney", label: "Australia/Sydney", city: "Sydney" },
  { id: "Pacific/Auckland", label: "Pacific/Auckland", city: "Auckland" },
]

/** Return the full list of timezones used by the timestamp tool. */
export function getAllTimezones(): TimezoneEntry[] {
  return ALL_TIMEZONES
}

/**
 * Parse a raw input string and auto-detect its timestamp format.
 *
 * Detection order:
 * 1. ISO 8601 strings (must start with `YYYY-MM-DD`)
 * 2. Unix milliseconds (13+ digits)
 * 3. Unix seconds (8-12 digits, optional decimal)
 * 4. Negative Unix seconds
 *
 * Returns `null` type when no format matches.
 */
export function parseTimestamp(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { type: null, date: null }

  // ISO 8601
  {
    const d = new Date(trimmed)
    if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return { type: "iso", date: d }
    }
  }

  // Unix milliseconds (length >= 13, all digits)
  if (/^\d{13,}$/.test(trimmed)) {
    const d = new Date(Number(trimmed))
    if (!isNaN(d.getTime())) return { type: "unix-milliseconds", date: d }
  }

  // Unix seconds (length 8-12, all digits, or floating point)
  if (/^\d{8,12}(\.\d+)?$/.test(trimmed)) {
    const ms = Number(trimmed) * 1000
    const d = new Date(ms)
    if (!isNaN(d.getTime())) return { type: "unix-seconds", date: d }
  }

  // Negative Unix seconds — dates before 1970 (e.g. Nov 5 1964)
  if (/^-\d{8,12}(\.\d+)?$/.test(trimmed)) {
    const ms = Number(trimmed) * 1000
    const d = new Date(ms)
    if (!isNaN(d.getTime())) return { type: "unix-seconds", date: d }
  }

  return { type: null, date: null }
}

/** Format an ISO 8601 string for a specific IANA timezone with millisecond precision. */
function isoInTimezone(date: Date, tz: string): string {
  // "en-CA" locale produces YYYY-MM-DD format naturally (the Canadian date standard),
  // which matches ISO 8601 without needing manual date-part extraction.
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZone: tz,
    hourCycle: "h23",
  } as Intl.DateTimeFormatOptions).formatToParts(date)

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}.${get("fractionalSecond")}`
}

/** Format a human-readable date string for a specific IANA timezone. */
function humanInTimezone(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
    hour12: true,
  }).format(date)
}

/** Format both ISO and human-readable representations for a given timezone. */
export function formatInTimezone(date: Date, tz: string): { iso: string; human: string } {
  return {
    iso: isoInTimezone(date, tz),
    human: humanInTimezone(date, tz),
  }
}

/**
 * Compute all timestamp representations for a given date.
 *
 * Includes Unix seconds, Unix milliseconds, local ISO, and a formatted
 * row for each configured timezone.
 */
export function computeResults(date: Date): TimestampResults {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const timezones = getAllTimezones().map((tz) => {
    const fmt = formatInTimezone(date, tz.id)
    return { tz, iso: fmt.iso, human: fmt.human }
  })

  return {
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMilliseconds: date.getTime(),
    isoLocal: isoInTimezone(date, localTz),
    timezones,
  }
}
