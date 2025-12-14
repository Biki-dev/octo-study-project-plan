import { updateSRS, getQualityFromCorrect, isCardDue } from "../srs"

describe("SRS Algorithm", () => {
  describe("updateSRS", () => {
    it("should reset card on low quality review", () => {
      const card = {
        ef: 2.5,
        interval: 10,
        reps: 5,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 2 })

      expect(result.reps).toBe(0)
      expect(result.interval).toBe(1)
    })

    it("should increase interval on first successful review", () => {
      const card = {
        ef: 2.5,
        interval: 1,
        reps: 0,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 4 })

      expect(result.reps).toBe(1)
      expect(result.interval).toBe(1)
    })

    it("should increase interval on second successful review", () => {
      const card = {
        ef: 2.5,
        interval: 1,
        reps: 1,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 4 })

      expect(result.reps).toBe(2)
      expect(result.interval).toBe(6)
    })

    it("should multiply interval by EF after second review", () => {
      const card = {
        ef: 2.5,
        interval: 6,
        reps: 2,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 4 })

      expect(result.reps).toBe(3)
      expect(result.interval).toBe(Math.round(6 * 2.5))
    })

    it("should update easiness factor based on quality", () => {
      const card = {
        ef: 2.5,
        interval: 1,
        reps: 0,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 4 })

      // EF should be adjusted
      expect(result.ef).not.toBe(2.5)
      expect(result.ef).toBeGreaterThan(1.3)
    })

    it("should not let EF go below 1.3", () => {
      const card = {
        ef: 1.4,
        interval: 1,
        reps: 1,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 0 })

      expect(result.ef).toBeGreaterThanOrEqual(1.3)
    })

    it("should set next_due in the future", () => {
      const card = {
        ef: 2.5,
        interval: 5,
        reps: 2,
        next_due: new Date().toISOString(),
      }

      const result = updateSRS(card, { quality: 4 })

      const nextDue = new Date(result.next_due)
      const now = new Date()
      expect(nextDue.getTime()).toBeGreaterThan(now.getTime())
    })

    it("should throw error on invalid quality", () => {
      const card = {
        ef: 2.5,
        interval: 1,
        reps: 0,
        next_due: new Date().toISOString(),
      }

      expect(() => updateSRS(card, { quality: 5 })).toThrow()
      expect(() => updateSRS(card, { quality: -1 })).toThrow()
    })
  })

  describe("getQualityFromCorrect", () => {
    it("should return 0 for incorrect answer", () => {
      expect(getQualityFromCorrect(false)).toBe(0)
    })

    it("should return 3 for correct with low confidence", () => {
      expect(getQualityFromCorrect(true, "low")).toBe(3)
    })

    it("should return 4 for correct with medium confidence", () => {
      expect(getQualityFromCorrect(true, "medium")).toBe(4)
    })

    it("should return 4 for correct with high confidence", () => {
      expect(getQualityFromCorrect(true, "high")).toBe(4)
    })
  })

  describe("isCardDue", () => {
    it("should return true for past dates", () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isCardDue(pastDate.toISOString())).toBe(true)
    })

    it("should return true for current time", () => {
      const now = new Date().toISOString()
      expect(isCardDue(now)).toBe(true)
    })

    it("should return false for future dates", () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isCardDue(futureDate.toISOString())).toBe(false)
    })
  })
})
