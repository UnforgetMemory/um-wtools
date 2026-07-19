import { describe, it, expect } from "vitest"
import { md5 } from "../domain/md5"

describe("MD5 Domain", () => {
  describe("md5", () => {
    it("hashes empty string", () => {
      expect(md5("")).toBe("d41d8cd98f00b204e9800998ecf8427e")
    })

    it("hashes simple text", () => {
      expect(md5("Hello")).toBe("8b1a9953c4611296a827abf8c47804d7")
    })

    it("hashes a sentence", () => {
      expect(md5("The quick brown fox jumps over the lazy dog"))
        .toBe("9e107d9d372bb6826bd81d3542a419d6")
    })

    it("hashes Unicode text", () => {
      expect(md5("Hello 世界")).toBe("af91c2603879085df0cb545dd0366dcd")
    })

    it("produces consistent results for the same input", () => {
      const input = "test input 123!@#"
      expect(md5(input)).toBe(md5(input))
    })

    it("produces different results for different inputs", () => {
      expect(md5("abc")).not.toBe(md5("abd"))
    })

    it("handles long text", () => {
      const long = "a".repeat(10000)
      const result = md5(long)
      expect(result).toHaveLength(32)
      expect(/^[0-9a-f]{32}$/.test(result)).toBe(true)
    })
  })
})