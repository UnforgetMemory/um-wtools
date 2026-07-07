import { describe, it, expect } from "vitest"
import { parseTimestamp, getAllTimezones, formatInTimezone, computeResults } from "../domain/timestamp"

describe("parseTimestamp", () => {
  it("returns null for empty input", () => {
    const r = parseTimestamp("")
    expect(r.type).toBeNull()
    expect(r.date).toBeNull()
  })

  it("parses Unix seconds", () => {
    const r = parseTimestamp("1700000000")
    expect(r.type).toBe("unix-seconds")
    expect(r.date).toBeInstanceOf(Date)
    expect(r.date!.getTime()).toBe(1700000000_000)
  })

  it("parses Unix seconds with decimal", () => {
    const r = parseTimestamp("1700000000.500")
    expect(r.type).toBe("unix-seconds")
    expect(r.date!.getTime()).toBe(1700000000_500)
  })

  it("parses Unix milliseconds", () => {
    const r = parseTimestamp("1700000000000")
    expect(r.type).toBe("unix-milliseconds")
    expect(r.date!.getTime()).toBe(1700000000_000)
  })

  it("parses ISO 8601", () => {
    const r = parseTimestamp("2024-01-15T10:30:00Z")
    expect(r.type).toBe("iso")
    expect(r.date!.toISOString()).toBe("2024-01-15T10:30:00.000Z")
  })

  it("parses ISO 8601 without Z", () => {
    const r = parseTimestamp("2024-06-15T14:30:00")
    expect(r.type).toBe("iso")
    expect(r.date).toBeInstanceOf(Date)
  })

  it("returns null for invalid input", () => {
    const r = parseTimestamp("not a timestamp")
    expect(r.type).toBeNull()
    expect(r.date).toBeNull()
  })

  it("returns null for gibberish", () => {
    const r = parseTimestamp("abc123xyz")
    expect(r.type).toBeNull()
  })
})

describe("getAllTimezones", () => {
  it("returns 18 timezone entries", () => {
    const tzs = getAllTimezones()
    expect(tzs.length).toBe(18)
  })

  it("includes UTC and major cities", () => {
    const tzs = getAllTimezones()
    expect(tzs.some((t) => t.id === "UTC")).toBe(true)
    expect(tzs.some((t) => t.id === "Asia/Shanghai")).toBe(true)
    expect(tzs.some((t) => t.id === "America/New_York")).toBe(true)
  })

  it("each entry has id, label, city", () => {
    for (const tz of getAllTimezones()) {
      expect(tz.id).toBeTruthy()
      expect(tz.label).toBeTruthy()
      expect(tz.city).toBeTruthy()
    }
  })
})

describe("formatInTimezone", () => {
  it("formats a known UTC date", () => {
    const d = new Date("2024-01-15T12:00:00Z")
    const r = formatInTimezone(d, "UTC")
    expect(r.iso).toMatch(/^2024-01-15T12:00:00\.\d{3}$/)
  })

  it("formats Shanghai timezone correctly (UTC+8)", () => {
    const d = new Date("2024-01-15T12:00:00Z")
    const r = formatInTimezone(d, "Asia/Shanghai")
    // Shanghai is UTC+8, so 12:00 UTC = 20:00 Shanghai
    expect(r.iso).toMatch(/^2024-01-15T20:00:00\.\d{3}$/)
  })
})

describe("computeResults", () => {
  it("returns all fields for a valid date", () => {
    const d = new Date("2024-01-15T12:00:00Z")
    const r = computeResults(d)
    expect(r.unixSeconds).toBe(1705320000)
    expect(r.unixMilliseconds).toBe(1705320000000)
    expect(r.timezones.length).toBe(18)
  })

  it("every timezone has iso and human", () => {
    const d = new Date()
    const r = computeResults(d)
    for (const tz of r.timezones) {
      expect(tz.iso).toBeTruthy()
      expect(tz.human).toBeTruthy()
    }
  })
})
