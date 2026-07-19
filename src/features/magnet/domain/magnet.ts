import bencode from "bencode"
import magnet from "magnet-uri"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface MagnetFileEntry {
  path: string
  name: string
  length: number
}

export interface MagnetParsed {
  infoHash: string
  name?: string
  announce?: string[]
  files?: MagnetFileEntry[]
  pieceLength?: number
  pieces?: string[]
  length?: number
  private?: boolean
  created?: Date
  createdBy?: string
  comment?: string
  urlList?: string[]
  xt?: string[]
}

export interface MagnetHeaderResult {
  original: string
  infoHash: string | null
  hasPrefix: boolean
  stripped: string
  prefixed: string
}

export type MagnetTab = "parse" | "header"

const MAGNET_PREFIX = "magnet:?xt=urn:btih:"
const INFO_HASH_RE = /^[0-9a-fA-F]{40}$/
const MAGNET_RE = /^magnet:\?xt=urn:btih:([0-9a-fA-F]{40})/i
const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1)
  const v = bytes / 1024 ** i
  // Show one decimal place for small values (e.g. "4.2 KB") to avoid
  // ambiguous "0 KB"; round to integer for larger ones.
  const n = v < 10 ? v.toFixed(1) : Math.round(v).toString()
  return `${n.replace(/\.0$/, "")} ${SIZE_UNITS[i]}`
}

/** Convert a hex string to a raw Uint8Array. */
function hexToBytes(hex: string): Uint8Array {
  const b = new Uint8Array(hex.length / 2)
  for (let i = 0; i < b.length; i++) b[i] = Number.parseInt(hex.substr(i * 2, 2), 16)
  return b
}

/** Convert a Uint8Array to a lowercase hex string. */
function bytesToHex(buf: Uint8Array): string {
  return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("")
}

/* ------------------------------------------------------------------ */
/*  Magnet header ops                                                  */
/* ------------------------------------------------------------------ */

export function isMagnetLink(input: string): boolean {
  return MAGNET_RE.test(input.trim())
}

export function isInfoHash(input: string): boolean {
  return INFO_HASH_RE.test(input.trim())
}

export function extractInfoHash(input: string): string | null {
  const s = input.trim()
  const m = MAGNET_RE.exec(s)
  if (m) return m[1].toLowerCase()
  if (INFO_HASH_RE.test(s)) return s.toLowerCase()
  return null
}

export function computeHeaderResult(input: string): MagnetHeaderResult {
  const s = input.trim()
  const hasPrefix = MAGNET_RE.test(s)
  const rawHash = extractInfoHash(s)
  return {
    original: s,
    infoHash: rawHash,
    hasPrefix,
    stripped: rawHash ?? s,
    prefixed: rawHash ? `${MAGNET_PREFIX}${rawHash}` : s,
  }
}

/* ------------------------------------------------------------------ */
/*  Parsing — magnet URI + torrent file                                */
/* ------------------------------------------------------------------ */

export function parseMagnetUri(input: string): MagnetParsed | null {
  const s = input.trim()
  if (INFO_HASH_RE.test(s)) return { infoHash: s.toLowerCase() }
  const decoded = magnet(s)
  if (!decoded || !decoded.infoHash) return null
  const result: MagnetParsed = { infoHash: decoded.infoHash.toLowerCase() }
  if (decoded.name) result.name = decoded.name
  if (decoded.announce?.length) result.announce = [...decoded.announce]
  if (decoded.urlList?.length) result.urlList = [...decoded.urlList]
  if (Array.isArray(decoded.xt) && decoded.xt.length > 1) result.xt = [...decoded.xt]
  return result
}

export async function parseTorrentFile(buffer: Uint8Array): Promise<MagnetParsed | null> {
  // Decode raw (no encoding) so binary fields stay as Uint8Array
  let raw: Record<string, unknown>
  try {
    raw = bencode.decode(buffer) as Record<string, unknown>
  } catch {
    return null
  }

  const rawInfo = raw.info as Record<string, unknown> | undefined
  if (!rawInfo || typeof rawInfo !== "object") return null

  // Compute infoHash: SHA-1 of the bencoded info dict
  let infoHash: string
  try {
    const infoBytes = bencode.encode(rawInfo)
    const hashBuffer = await crypto.subtle.digest("SHA-1", infoBytes)
    infoHash = bytesToHex(new Uint8Array(hashBuffer))
  } catch {
    return null
  }

  // Helper: convert byte-string field to string
  const dec = new TextDecoder()
  const decodeStr = (v: unknown): string | undefined => {
    if (typeof v === "string") return v
    if (v instanceof Uint8Array) return dec.decode(v)
    return undefined
  }

  const result: MagnetParsed = { infoHash }

  const name = decodeStr(rawInfo.name)
  if (name) result.name = name

  if (typeof rawInfo["piece length"] === "number") {
    result.pieceLength = rawInfo["piece length"] as number
  }

  // Pieces — concatenated 20-byte SHA-1 hashes
  const rawPieces = rawInfo.pieces
  if (rawPieces instanceof Uint8Array) {
    const pieces: string[] = []
    for (let i = 0; i < rawPieces.length; i += 20) {
      pieces.push(bytesToHex(rawPieces.subarray(i, i + 20)))
    }
    result.pieces = pieces
  }

  // Announce
  const announce = decodeStr(raw.announce)
  if (announce) result.announce = [announce]

  // Announce-list (multi-tier, optional)
  const announceList = raw["announce-list"]
  if (Array.isArray(announceList)) {
    const flat: string[] = []
    for (const tier of announceList) {
      if (Array.isArray(tier)) {
        for (const u of tier) {
          const s = decodeStr(u)
          if (s && !flat.includes(s)) flat.push(s)
        }
      }
    }
    if (flat.length > 0) result.announce = flat
  }

  // URL list (web seeds)
  const urlList = raw["url-list"]
  if (Array.isArray(urlList)) {
    result.urlList = urlList.map((u) => decodeStr(u)).filter((u): u is string => !!u)
  } else {
    const s = decodeStr(urlList)
    if (s) result.urlList = [s]
  }

  // Creation date
  if (typeof raw["creation date"] === "number" && (raw["creation date"] as number) > 0) {
    result.created = new Date((raw["creation date"] as number) * 1000)
  }

  // Created by
  const createdBy = decodeStr(raw["created by"])
  if (createdBy) result.createdBy = createdBy

  // Comment
  const comment = decodeStr(raw.comment)
  if (comment) result.comment = comment

  // Private flag
  if (typeof rawInfo.private === "number") {
    result.private = (rawInfo.private as number) === 1
  }

  // Single file mode
  if (typeof rawInfo.length === "number") {
    result.length = rawInfo.length as number
    const n = name ?? "unknown"
    result.files = [{ path: n, name: n, length: rawInfo.length as number }]
  }

  // Multi-file mode
  const fileList = rawInfo.files
  if (Array.isArray(fileList)) {
    const entries: MagnetFileEntry[] = []
    let totalLength = 0
    for (const f of fileList) {
      const p = (f as Record<string, unknown>).path
      const path = Array.isArray(p)
        ? (p as unknown[]).map((s) => decodeStr(s) ?? String(s)).join("/")
        : decodeStr(p) ?? String(p)
      const len = typeof (f as Record<string, unknown>).length === "number"
        ? ((f as Record<string, unknown>).length as number)
        : 0
      const fname = path.split("/").pop() ?? path
      entries.push({ path, name: fname, length: len })
      totalLength += len
    }
    result.files = entries
    if (entries.length > 0) result.length = totalLength
  }

  return result
}

/**
 * Generate a magnet URI from parsed torrent data.
 */
export function torrentToMagnetUri(parsed: MagnetParsed): string {
  let uri = `${MAGNET_PREFIX}${parsed.infoHash}`
  if (parsed.name) uri += `&dn=${encodeURIComponent(parsed.name)}`
  if (parsed.announce) {
    for (const tr of parsed.announce) uri += `&tr=${encodeURIComponent(tr)}`
  }
  if (parsed.length != null) uri += `&xl=${parsed.length}`
  return uri
}

export async function parseMagnetOrTorrent(
  input: string | Uint8Array,
): Promise<MagnetParsed | null> {
  if (typeof input === "string") return parseMagnetUri(input)
  return parseTorrentFile(input)
}
