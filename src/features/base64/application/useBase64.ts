import { encode, decode, autoDetect } from "../domain/base64"
import type { Base64Result } from "../../../toolkit/types"

/**
 * Base64 composable that wraps the domain-layer pure functions.
 *
 * Provides a single entry point for components, making it easy to inject
 * shared state or error handling logic later without changing callers.
 */
export function useBase64() {
  function wrappedEncode(text: string, rounds?: number): Base64Result { return encode(text, rounds) }
  function wrappedDecode(text: string, rounds?: number): Base64Result { return decode(text, rounds) }
  function wrappedAutoDetect(text: string, maxRounds?: number): Base64Result { return autoDetect(text, maxRounds) }
  return { encode: wrappedEncode, decode: wrappedDecode, autoDetect: wrappedAutoDetect }
}