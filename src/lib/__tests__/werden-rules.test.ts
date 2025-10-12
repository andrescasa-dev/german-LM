import { describe, it, expect } from "vitest";
import {
  getWerdenConjugation,
  getExpectedAnswer,
  validateWerdenForm,
  generateWerdenHint,
} from "../werden-rules";
import type { WerdenContext } from "@/types/werden";

describe("werden-rules", () => {
  describe("getWerdenConjugation", () => {
    it("should return correct conjugations for present tense", () => {
      expect(getWerdenConjugation("ich", "prasens")).toBe("werde");
      expect(getWerdenConjugation("du", "prasens")).toBe("wirst");
      expect(getWerdenConjugation("er", "prasens")).toBe("wird");
      expect(getWerdenConjugation("wir", "prasens")).toBe("werden");
      expect(getWerdenConjugation("ihr", "prasens")).toBe("werdet");
    });

    it("should return correct conjugations for perfect tense (sein)", () => {
      expect(getWerdenConjugation("ich", "perfekt")).toBe("bin");
      expect(getWerdenConjugation("du", "perfekt")).toBe("bist");
      expect(getWerdenConjugation("er", "perfekt")).toBe("ist");
      expect(getWerdenConjugation("wir", "perfekt")).toBe("sind");
      expect(getWerdenConjugation("ihr", "perfekt")).toBe("seid");
    });

    it("should return correct conjugations for future tense", () => {
      expect(getWerdenConjugation("ich", "futur")).toBe("werde");
      expect(getWerdenConjugation("du", "futur")).toBe("wirst");
      expect(getWerdenConjugation("er", "futur")).toBe("wird");
    });
  });

  describe("getExpectedAnswer", () => {
    it("should return correct answer for verbo pleno in present", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };
      expect(getExpectedAnswer(context)).toBe("werde");
    });

    it("should return correct answer for verbo pleno in perfect", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "perfekt",
      };
      expect(getExpectedAnswer(context)).toBe("bin");
    });

    it("should return correct answer for futuro with infinitive", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
        isInfinitive: true,
      };
      expect(getExpectedAnswer(context)).toBe("gehen");
    });

    it("should return correct answer for futuro conjugation", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
      };
      expect(getExpectedAnswer(context)).toBe("werde");
    });

    it("should return correct answer for pasiva with participle", () => {
      const context: WerdenContext = {
        pronoun: "es",
        function: "pasiva",
        tense: "prasens",
        mainVerb: "machen",
        isInfinitive: true,
      };
      expect(getExpectedAnswer(context)).toBe("gemacht");
    });
  });

  describe("validateWerdenForm", () => {
    it("should validate correct verbo pleno answers", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };

      const result = validateWerdenForm("werde", context);
      expect(result.isCorrect).toBe(true);
      expect(result.functionType).toBe("verbo-pleno");
      expect(result.explanation).toContain("Correcto");
    });

    it("should validate incorrect verbo pleno answers", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };

      const result = validateWerdenForm("wirst", context);
      expect(result.isCorrect).toBe(false);
      expect(result.explanation).toContain("Incorrecto");
      expect(result.commonError).toContain('para "ich" se usa "werde"');
    });

    it("should validate correct futuro answers", () => {
      const context: WerdenContext = {
        pronoun: "wir",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
      };

      const result = validateWerdenForm("werden", context);
      expect(result.isCorrect).toBe(true);
      expect(result.functionType).toBe("futuro");
    });

    it("should validate correct futuro infinitive", () => {
      const context: WerdenContext = {
        pronoun: "wir",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
        isInfinitive: true,
      };

      const result = validateWerdenForm("gehen", context);
      expect(result.isCorrect).toBe(true);
    });

    it("should validate correct pasiva answers", () => {
      const context: WerdenContext = {
        pronoun: "es",
        function: "pasiva",
        tense: "prasens",
        mainVerb: "machen",
      };

      const result = validateWerdenForm("wird", context);
      expect(result.isCorrect).toBe(true);
      expect(result.functionType).toBe("pasiva");
    });

    it("should handle case insensitive answers", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };

      const result = validateWerdenForm("WERDE", context);
      expect(result.isCorrect).toBe(true);
    });

    it("should handle answers with extra spaces", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };

      const result = validateWerdenForm("  werde  ", context);
      expect(result.isCorrect).toBe(true);
    });
  });

  describe("generateWerdenHint", () => {
    it("should generate appropriate hints for verbo pleno", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "prasens",
      };

      const hint = generateWerdenHint(context);
      expect(hint).toContain("verbo pleno");
      expect(hint).toContain("yo");
    });

    it("should generate appropriate hints for futuro", () => {
      const context: WerdenContext = {
        pronoun: "wir",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
      };

      const hint = generateWerdenHint(context);
      expect(hint).toContain("futuro");
      expect(hint).toContain("nosotros");
      expect(hint).toContain("infinitivo");
    });

    it("should generate appropriate hints for pasiva", () => {
      const context: WerdenContext = {
        pronoun: "es",
        function: "pasiva",
        tense: "prasens",
        mainVerb: "machen",
      };

      const hint = generateWerdenHint(context);
      expect(hint).toContain("pasiva");
      expect(hint).toContain("participio");
    });

    it("should generate appropriate hints for perfect tense", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "verbo-pleno",
        tense: "perfekt",
      };

      const hint = generateWerdenHint(context);
      expect(hint).toContain("Perfekt");
      expect(hint).toContain("sein");
      expect(hint).toContain("geworden");
    });

    it("should generate appropriate hints for infinitive forms", () => {
      const context: WerdenContext = {
        pronoun: "ich",
        function: "futuro",
        tense: "prasens",
        mainVerb: "gehen",
        isInfinitive: true,
      };

      const hint = generateWerdenHint(context);
      expect(hint).toContain("infinitivo");
      expect(hint).toContain("verbo principal");
    });
  });
});
