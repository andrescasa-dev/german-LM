import { describe, it, expect } from "vitest";
import {
  getDeclensionType,
  getAdjectiveEnding,
  validateAdjectiveEnding,
  generateHint,
} from "../adjective-rules";
import type { AdjectiveContext } from "@/types/adjective";

describe("adjective-rules", () => {
  describe("getDeclensionType", () => {
    it('should return "weak" for definite articles', () => {
      expect(getDeclensionType("definite")).toBe("weak");
    });

    it('should return "mixed" for indefinite articles', () => {
      expect(getDeclensionType("indefinite")).toBe("mixed");
    });

    it('should return "mixed" for possessive articles', () => {
      expect(getDeclensionType("possessive")).toBe("mixed");
    });

    it('should return "mixed" for kein', () => {
      expect(getDeclensionType("kein")).toBe("mixed");
    });

    it('should return "strong" for no article', () => {
      expect(getDeclensionType("none")).toBe("strong");
      expect(getDeclensionType(null)).toBe("strong");
    });
  });

  describe("getAdjectiveEnding - Weak declension", () => {
    it('should return "en" for accusative masculine singular with definite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("en");
    });

    it('should return "e" for nominative masculine singular with definite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "der",
          type: "definite",
          case: "nominativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "nominativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("e");
    });

    it('should return "en" for plural nominative with definite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "die",
          type: "definite",
          case: "nominativ",
          gender: "maskulin", // El género no importa en plural
          number: "plural",
        },
        case: "nominativ",
        gender: "maskulin", // El género no importa en plural
        number: "plural",
      };
      // Para plural, la clave es solo "nominativ-plural", sin género
      // Pero nuestra función construye "nominativ-maskulin-plural"
      // Necesitamos ajustar la lógica para manejar plural correctamente
      const ending = getAdjectiveEnding(context);
      // El plural nominativo débil debe ser "en"
      expect(ending).toBe("en");
    });
  });

  describe("getAdjectiveEnding - Mixed declension", () => {
    it('should return "er" for nominative masculine singular with indefinite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "ein",
          type: "indefinite",
          case: "nominativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "nominativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("er");
    });

    it('should return "en" for accusative masculine singular with indefinite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "einen",
          type: "indefinite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("en");
    });

    it('should return "es" for nominative neuter singular with indefinite article', () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "ein",
          type: "indefinite",
          case: "nominativ",
          gender: "neutrum",
          number: "singular",
        },
        case: "nominativ",
        gender: "neutrum",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("es");
    });
  });

  describe("getAdjectiveEnding - Strong declension", () => {
    it('should return "er" for nominative masculine singular without article', () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "nominativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("er");
    });

    it('should return "en" for accusative masculine singular without article', () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("en");
    });

    it('should return "es" for nominative neuter singular without article', () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "nominativ",
        gender: "neutrum",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("es");
    });

    it('should return "e" for nominative feminine singular without article', () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "nominativ",
        gender: "feminin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("e");
    });

    it('should return "e" for plural nominative without article', () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "nominativ",
        gender: "maskulin",
        number: "plural",
      };
      expect(getAdjectiveEnding(context)).toBe("e");
    });
  });

  describe("validateAdjectiveEnding", () => {
    it("should validate correct answer for accusative masculine with definite article", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const result = validateAdjectiveEnding("en", context);
      expect(result.isCorrect).toBe(true);
      expect(result.expectedEnding).toBe("en");
      expect(result.declensionType).toBe("weak");
    });

    it("should reject incorrect answer", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const result = validateAdjectiveEnding("er", context);
      expect(result.isCorrect).toBe(false);
      expect(result.expectedEnding).toBe("en");
    });

    it("should be case-insensitive", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const result = validateAdjectiveEnding("EN", context);
      expect(result.isCorrect).toBe(true);
    });

    it("should trim whitespace", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const result = validateAdjectiveEnding(" en ", context);
      expect(result.isCorrect).toBe(true);
    });

    it("should include explanation and example in result", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const result = validateAdjectiveEnding("en", context);
      expect(result.explanation).toBeTruthy();
      expect(result.example).toBeTruthy();
      expect(result.markerInfo).toBeTruthy();
    });
  });

  describe("generateHint", () => {
    it("should generate hint for weak declension", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "den",
          type: "definite",
          case: "akkusativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      };
      const hint = generateHint(context);
      expect(hint).toContain("Declinación débil");
      expect(hint).toContain("acusativo");
      expect(hint).toContain("masculino");
    });

    it("should generate hint for mixed declension", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "ein",
          type: "indefinite",
          case: "nominativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "nominativ",
        gender: "maskulin",
        number: "singular",
      };
      const hint = generateHint(context);
      expect(hint).toContain("Declinación mixta");
      expect(hint).toContain("nominativo");
      expect(hint).toContain("masculino");
    });

    it("should generate hint for strong declension", () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "nominativ",
        gender: "neutrum",
        number: "singular",
      };
      const hint = generateHint(context);
      expect(hint).toContain("Declinación fuerte");
      expect(hint).toContain("nominativo");
      expect(hint).toContain("neutro");
    });
  });

  describe("Edge cases", () => {
    it("should handle dative case correctly", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "dem",
          type: "definite",
          case: "dativ",
          gender: "maskulin",
          number: "singular",
        },
        case: "dativ",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("en");
    });

    it("should handle genitive case correctly", () => {
      const context: AdjectiveContext = {
        determiner: {
          word: "des",
          type: "definite",
          case: "genitiv",
          gender: "maskulin",
          number: "singular",
        },
        case: "genitiv",
        gender: "maskulin",
        number: "singular",
      };
      expect(getAdjectiveEnding(context)).toBe("en");
    });

    it("should handle plural with strong declension", () => {
      const context: AdjectiveContext = {
        determiner: null,
        case: "akkusativ",
        gender: "maskulin",
        number: "plural",
      };
      expect(getAdjectiveEnding(context)).toBe("e");
    });
  });
});
