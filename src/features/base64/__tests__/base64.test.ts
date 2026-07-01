import { describe, it, expect } from "vitest"
import { encode, decode, autoDetect } from "../domain/base64"

describe("Base64 Domain", () => {
  describe("encode", () => {
    it("encodes simple text", () => {
      const r = encode("Hello")
      expect(r.isValid).toBe(true)
      expect(r.output).toBe("SGVsbG8=")
    })
    it("encodes Unicode", () => {
      const r = encode("Hello 世界")
      expect(r.isValid).toBe(true)
      expect(r.output).toBe("SGVsbG8g5LiW55WM")
    })
    it("caps rounds at 20", () => {
      expect(encode("Hi", 30).isValid).toBe(true)
    })
  })

  describe("decode", () => {
    it("decodes base64", () => {
      const r = decode("SGVsbG8=")
      expect(r.isValid).toBe(true)
      expect(r.output).toBe("Hello")
    })
    it("rejects invalid", () => {
      expect(decode("!!!").isValid).toBe(false)
    })
    it("rejects empty", () => {
      expect(decode("").isValid).toBe(false)
    })
  })

  describe("autoDetect", () => {
    it("detects single layer", () => {
      const r = autoDetect("SGVsbG8=")
      expect(r.isValid).toBe(true)
      expect(r.rounds).toBe(1)
      expect(r.output).toBe("Hello")
    })
    it("detects multi-layer", () => {
      const e2 = encode(encode("Hello", 1).output, 1).output
      const r = autoDetect(encode(e2, 1).output)
      expect(r.isValid).toBe(true)
      expect(r.rounds).toBe(3)
      expect(r.output).toBe("Hello")
    })
  })

  describe("round-trip", () => {
    for (const rounds of [1, 2, 5, 10]) {
      it(`round-trips ${rounds} round(s)`, () => {
        const original = "Test message 123!"
        const encoded = encode(original, rounds)
        expect(encoded.isValid).toBe(true)
        const decoded = decode(encoded.output, rounds)
        expect(decoded.isValid).toBe(true)
        expect(decoded.output).toBe(original)
      })
    }
  })
})