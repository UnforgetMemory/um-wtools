import { describe, it, expect, vi } from "vitest"
import bencode from "bencode"
import {
  isMagnetLink, isInfoHash, extractInfoHash, computeHeaderResult,
  parseMagnetUri, parseTorrentFile, torrentToMagnetUri,
  formatBytes,
} from "../domain/magnet"

describe("isMagnetLink", () => {
  it("detects a valid magnet link", () => {
    expect(isMagnetLink("magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")).toBe(true)
  })
  it("rejects bare info hash", () => {
    expect(isMagnetLink("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")).toBe(false)
  })
  it("rejects empty", () => { expect(isMagnetLink("")).toBe(false) })
})

describe("isInfoHash", () => {
  it("accepts 40-char hex", () => {
    expect(isInfoHash("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")).toBe(true)
  })
  it("rejects wrong length", () => {
    expect(isInfoHash("d2474e86c95b19b8bcfdb92bc12c9d44667cfa3")).toBe(false)
  })
})

describe("computeHeaderResult", () => {
  it("detects magnet link", () => {
    const r = computeHeaderResult("magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r.hasPrefix).toBe(true)
    expect(r.infoHash).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r.stripped).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r.prefixed).toBe("magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
  })
  it("handles bare hash", () => {
    const r = computeHeaderResult("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r.hasPrefix).toBe(false)
    expect(r.infoHash).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r.prefixed).toBe("magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
  })
})

describe("parseMagnetUri", () => {
  it("parses bare info hash", () => {
    const r = parseMagnetUri("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r?.infoHash).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
  })
  it("parses full magnet link", () => {
    const r = parseMagnetUri("magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Test&tr=http://t.com/announce")
    expect(r?.infoHash).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(r?.name).toBe("Test")
    expect(r?.announce).toEqual(["http://t.com/announce"])
  })
  it("returns null for invalid input", () => {
    expect(parseMagnetUri("not a magnet")).toBeNull()
  })
})

describe("parseTorrentFile", () => {
  function makeTorrent(name: string, length: number): Uint8Array {
    return new Uint8Array(bencode.encode({
      info: { name, "piece length": 16384, length, pieces: new Uint8Array(20) },
      announce: "http://tracker.example.com/announce",
    }))
  }
  it("parses a minimal single-file torrent", async () => {
    const buf = makeTorrent("test.txt", 12345)
    const r = await parseTorrentFile(buf)
    expect(r).not.toBeNull()
    expect(r!.infoHash).toHaveLength(40)
    expect(r!.name).toBe("test.txt")
    expect(r!.length).toBe(12345)
    expect(r!.files).toHaveLength(1)
  })
  it("returns null for invalid buffer", async () => {
    expect(await parseTorrentFile(new Uint8Array([1,2,3]))).toBeNull()
  })
})

describe("torrentToMagnetUri", () => {
  it("generates URI from parsed data", () => {
    const uri = torrentToMagnetUri({
      infoHash: "d2474e86c95b19b8bcfdb92bc12c9d44667cfa36",
      name: "test.txt",
      announce: ["http://t.com/announce"],
      length: 12345,
    })
    expect(uri).toContain("urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(uri).toContain("dn=test.txt")
    expect(uri).toContain("tr=http%3A%2F%2Ft.com%2Fannounce")
    expect(uri).toContain("xl=12345")
  })
})

describe("formatBytes", () => {
  it('formats 0 as "0 B"', () => expect(formatBytes(0)).toBe("0 B"))
  it('formats KB', () => expect(formatBytes(2048)).toBe("2 KB"))
  it('formats MB', () => expect(formatBytes(5 * 1024 * 1024)).toBe("5 MB"))
  it('formats GB', () => expect(formatBytes(1500 * 1024 * 1024)).toMatch(/1\.5 GB/))
})
