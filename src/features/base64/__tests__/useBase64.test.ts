import { describe, it, expect } from "vitest"
import { useBase64 } from "../application/useBase64"

describe("useBase64", () => {
  const { encode, decode, autoDetect } = useBase64()

  describe("encode", () => {
    it("encodes simple text", () => {
      const r = encode("Hello")
      expect(r.isValid).toBe(true)
      expect(r.output).toBe("SGVsbG8=")
    })

    it("encodes empty string with custom rounds", () => {
      const r = encode("", 5)
      expect(r.isValid).toBe(true)
      expect(r.rounds).toBe(5)
    })
  })

  describe("decode", () => {
    it("decodes base64", () => {
      const r = decode("SGVsbG8=")
      expect(r.isValid).toBe(true)
      expect(r.output).toBe("Hello")
    })

    it("rejects invalid input", () => {
      const r = decode("!!!")
      expect(r.isValid).toBe(false)
    })

    it("rejects empty input", () => {
      const r = decode("")
      expect(r.isValid).toBe(false)
    })
  })

  describe("autoDetect", () => {
    it("detects single layer", () => {
      const r = autoDetect("SGVsbG8=")
      expect(r.isValid).toBe(true)
      expect(r.rounds).toBe(1)
    })
  })
})
