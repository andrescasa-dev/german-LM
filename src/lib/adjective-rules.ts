/**
 * Lógica de reglas de declinación del adjetivo alemán
 * Implementa las reglas débil, mixta y fuerte según MCER B1
 */

import type {
  AdjectiveContext,
  DeclensionType,
  ValidationResult,
  ArticleType,
} from "@/types/adjective";

/**
 * Terminaciones para declinación DÉBIL (con artículo definido)
 * El artículo definido lleva la marca fuerte
 */
const WEAK_ENDINGS: Record<string, string> = {
  // Nominativo
  "nominativ-maskulin-singular": "e",
  "nominativ-feminin-singular": "e",
  "nominativ-neutrum-singular": "e",
  "nominativ-plural": "en",
  // Akkusativ
  "akkusativ-maskulin-singular": "en",
  "akkusativ-feminin-singular": "e",
  "akkusativ-neutrum-singular": "e",
  "akkusativ-plural": "en",
  // Dativ
  "dativ-maskulin-singular": "en",
  "dativ-feminin-singular": "en",
  "dativ-neutrum-singular": "en",
  "dativ-plural": "en",
  // Genitiv
  "genitiv-maskulin-singular": "en",
  "genitiv-feminin-singular": "en",
  "genitiv-neutrum-singular": "en",
  "genitiv-plural": "en",
};

/**
 * Terminaciones para declinación MIXTA (con ein, kein, posesivos)
 * El adjetivo asume marca fuerte donde el determinante no marca
 */
const MIXED_ENDINGS: Record<string, string> = {
  // Nominativo - el adjetivo marca porque ein/kein no marcan género claramente
  "nominativ-maskulin-singular": "er",
  "nominativ-feminin-singular": "e",
  "nominativ-neutrum-singular": "es",
  "nominativ-plural": "en",
  // Akkusativ
  "akkusativ-maskulin-singular": "en", // ein marca aquí con -en
  "akkusativ-feminin-singular": "e",
  "akkusativ-neutrum-singular": "es",
  "akkusativ-plural": "en",
  // Dativ - todos -en
  "dativ-maskulin-singular": "en",
  "dativ-feminin-singular": "en",
  "dativ-neutrum-singular": "en",
  "dativ-plural": "en",
  // Genitiv - todos -en
  "genitiv-maskulin-singular": "en",
  "genitiv-feminin-singular": "en",
  "genitiv-neutrum-singular": "en",
  "genitiv-plural": "en",
};

/**
 * Terminaciones para declinación FUERTE (sin artículo)
 * El adjetivo porta la marca completa de caso/género/número
 */
const STRONG_ENDINGS: Record<string, string> = {
  // Nominativo
  "nominativ-maskulin-singular": "er",
  "nominativ-feminin-singular": "e",
  "nominativ-neutrum-singular": "es",
  "nominativ-plural": "e",
  // Akkusativ
  "akkusativ-maskulin-singular": "en",
  "akkusativ-feminin-singular": "e",
  "akkusativ-neutrum-singular": "es",
  "akkusativ-plural": "e",
  // Dativ
  "dativ-maskulin-singular": "em",
  "dativ-feminin-singular": "er",
  "dativ-neutrum-singular": "em",
  "dativ-plural": "en",
  // Genitiv
  "genitiv-maskulin-singular": "en",
  "genitiv-feminin-singular": "er",
  "genitiv-neutrum-singular": "en",
  "genitiv-plural": "er",
};

/**
 * Determina el tipo de declinación según el contexto
 */
export function getDeclensionType(
  articleType: ArticleType | null
): DeclensionType {
  if (!articleType || articleType === "none") {
    return "strong";
  }
  if (articleType === "definite") {
    return "weak";
  }
  // indefinite, possessive, kein
  return "mixed";
}

/**
 * Obtiene la terminación correcta del adjetivo
 */
export function getAdjectiveEnding(context: AdjectiveContext): string {
  const { case: grammaticalCase, gender, number } = context;

  // Para plural, no incluimos el género en la clave
  const key =
    number === "plural"
      ? `${grammaticalCase}-${number}`
      : `${grammaticalCase}-${gender}-${number}`;

  const declensionType = getDeclensionType(context.determiner?.type ?? null);

  let endings: Record<string, string>;
  switch (declensionType) {
    case "weak":
      endings = WEAK_ENDINGS;
      break;
    case "mixed":
      endings = MIXED_ENDINGS;
      break;
    case "strong":
      endings = STRONG_ENDINGS;
      break;
  }

  return endings[key] || "e";
}

/**
 * Valida la respuesta del usuario
 */
export function validateAdjectiveEnding(
  userAnswer: string,
  context: AdjectiveContext
): ValidationResult {
  const expectedEnding = getAdjectiveEnding(context);
  const declensionType = getDeclensionType(context.determiner?.type ?? null);
  const isCorrect = userAnswer.toLowerCase().trim() === expectedEnding;

  const markerInfo = getMarkerExplanation(declensionType, context);
  const explanation = getExplanation(declensionType, context, expectedEnding);
  const example = getExample(declensionType, context);

  return {
    isCorrect,
    expectedEnding,
    declensionType,
    explanation,
    example,
    markerInfo,
  };
}

/**
 * Genera explicación sobre quién lleva la marca fuerte
 */
function getMarkerExplanation(
  declensionType: DeclensionType,
  context: AdjectiveContext
): string {
  const { determiner } = context;

  switch (declensionType) {
    case "weak":
      return `El artículo definido "${determiner?.word}" lleva la marca fuerte, por lo que el adjetivo usa terminación débil.`;
    case "mixed":
      return `El determinante "${determiner?.word}" no marca claramente en algunos casos, por lo que el adjetivo asume la marca fuerte donde sea necesario.`;
    case "strong":
      return "Sin artículo, el adjetivo debe portar la marca completa de caso, género y número.";
  }
}

/**
 * Genera explicación detallada de la regla aplicada
 */
function getExplanation(
  declensionType: DeclensionType,
  context: AdjectiveContext,
  ending: string
): string {
  const { case: grammaticalCase, gender, number } = context;
  const caseNames = {
    nominativ: "nominativo",
    akkusativ: "acusativo",
    dativ: "dativo",
    genitiv: "genitivo",
  };
  const genderNames = {
    maskulin: "masculino",
    feminin: "femenino",
    neutrum: "neutro",
  };
  const numberNames = {
    singular: "singular",
    plural: "plural",
  };

  const caseName = caseNames[grammaticalCase];
  const genderName = genderNames[gender];
  const numberName = numberNames[number];

  switch (declensionType) {
    case "weak":
      return `Declinación débil: En ${caseName} ${genderName} ${numberName} con artículo definido, el adjetivo termina en "-${ending}".`;
    case "mixed":
      return `Declinación mixta: En ${caseName} ${genderName} ${numberName} con "${context.determiner?.word}", el adjetivo termina en "-${ending}".`;
    case "strong":
      return `Declinación fuerte: Sin artículo en ${caseName} ${genderName} ${numberName}, el adjetivo termina en "-${ending}" para marcar completamente.`;
  }
}

/**
 * Genera un ejemplo correcto
 */
function getExample(
  declensionType: DeclensionType,
  context: AdjectiveContext
): string {
  const { case: grammaticalCase, gender, number } = context;

  // Ejemplos por tipo de declinación y contexto
  const examples: Record<string, Record<string, string>> = {
    weak: {
      "nominativ-maskulin-singular": "der neue Wagen",
      "akkusativ-maskulin-singular": "den neuen Wagen",
      "nominativ-feminin-singular": "die neue Tasche",
      "akkusativ-neutrum-singular": "das neue Auto",
    },
    mixed: {
      "nominativ-maskulin-singular": "ein neuer Wagen",
      "akkusativ-maskulin-singular": "einen neuen Wagen",
      "nominativ-neutrum-singular": "ein neues Auto",
      "akkusativ-feminin-singular": "eine neue Tasche",
    },
    strong: {
      "nominativ-maskulin-singular": "neuer Wagen",
      "akkusativ-maskulin-singular": "neuen Wagen",
      "nominativ-neutrum-singular": "neues Auto",
      "nominativ-feminin-singular": "neue Tasche",
    },
  };

  const key = `${grammaticalCase}-${gender}-${number}`;
  return examples[declensionType]?.[key] || "Ejemplo no disponible";
}

/**
 * Genera una pista para el usuario
 */
export function generateHint(context: AdjectiveContext): string {
  const declensionType = getDeclensionType(context.determiner?.type ?? null);
  const { case: grammaticalCase, gender } = context;

  const caseNames = {
    nominativ: "nominativo",
    akkusativ: "acusativo",
    dativ: "dativo",
    genitiv: "genitivo",
  };
  const genderNames = {
    maskulin: "masculino",
    feminin: "femenino",
    neutrum: "neutro",
  };

  const hints = {
    weak: `💡 Pista: Declinación débil (artículo definido marca). Caso: ${caseNames[grammaticalCase]}, género: ${genderNames[gender]}.`,
    mixed: `💡 Pista: Declinación mixta (con "${context.determiner?.word}"). Caso: ${caseNames[grammaticalCase]}, género: ${genderNames[gender]}.`,
    strong: `💡 Pista: Declinación fuerte (sin artículo, el adjetivo marca todo). Caso: ${caseNames[grammaticalCase]}, género: ${genderNames[gender]}.`,
  };

  return hints[declensionType];
}
