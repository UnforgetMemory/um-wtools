import type { Base64Result } from "../../../toolkit/types"

function utf8ToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function isBase64(str: string): boolean {
  if (!str || str.length === 0) return false
  const trimmed = str.trim()
  return /^[A-Za-z0-9+/]*={0,2}$/.test(trimmed)
}

function clampRounds(r: number): number {
  return Math.max(1, Math.min(20, r))
}

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? `${fallback}: ${err.message}` : fallback
}

export function encode(text: string, rounds: number = 1): Base64Result {
  rounds = clampRounds(rounds)
  try {
    let current = text
    for (let i = 0; i < rounds; i++) {
      const bytes = utf8ToBytes(current)
      current = bytesToBase64(bytes)
    }
    return { output: current, rounds, isValid: true }
  } catch (err) {
    return { output: "", rounds, isValid: false, errorCode: "encodeFailed", error: toErrorMessage(err, "Encode failed") }
  }
}

export function decode(text: string, rounds: number = 1): Base64Result {
  rounds = clampRounds(rounds)
  const trimmed = text.trim()
  if (!trimmed) {
    return { output: "", rounds, isValid: false, errorCode: "empty", error: "Input is empty" }
  }
  if (!isBase64(trimmed)) {
    return { output: "", rounds, isValid: false, errorCode: "invalid", error: "Input contains non-Base64 characters" }
  }
  try {
    let current = trimmed
    for (let i = 0; i < rounds; i++) {
      const bytes = base64ToBytes(current)
      current = bytesToUtf8(bytes)
    }
    return { output: current, rounds, isValid: true }
  } catch (err) {
    return { output: "", rounds, isValid: false, errorCode: "decodeFailed", error: toErrorMessage(err, "Decode failed") }
  }
}

export function autoDetect(text: string, maxRounds: number = 20): Base64Result {
  maxRounds = Math.min(20, maxRounds)
  const trimmed = text.trim()
  if (!trimmed) {
    return { output: "", rounds: 0, isValid: false, errorCode: "empty", error: "Input is empty" }
  }
  let current = trimmed
  let roundCount = 0
  for (let i = 0; i < maxRounds; i++) {
    if (!isBase64(current)) break
    try {
      const bytes = base64ToBytes(current)
      const decoded = bytesToUtf8(bytes)
      // Stop if decoding produced the same output — prevents infinite loop
      // when the input happens to be both valid Base64 and valid UTF-8.
      if (decoded === current) break
      current = decoded
      roundCount++
    } catch { break }
  }
  if (roundCount === 0) {
    return { output: current, rounds: 0, isValid: false, errorCode: "notBase64", error: "Input is not valid Base64 or could not be decoded" }
  }
  return { output: current, rounds: roundCount, isValid: true }
}