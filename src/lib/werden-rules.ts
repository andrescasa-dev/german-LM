import type {
  WerdenContext,
  WerdenValidationResult,
  WerdenFunction,
  Tense,
  Pronoun,
} from "@/types/werden";

// Tabla de conjugación de werden
const WERDEN_CONJUGATIONS: Record<Tense, Record<Pronoun, string>> = {
  prasens: {
    ich: "werde",
    du: "wirst",
    er: "wird",
    sie: "wird",
    es: "wird",
    wir: "werden",
    ihr: "werdet",
    "sie-formal": "werden",
    "sie-plural": "werden",
  },
  perfekt: {
    ich: "bin",
    du: "bist",
    er: "ist",
    sie: "ist",
    es: "ist",
    wir: "sind",
    ihr: "seid",
    "sie-formal": "sind",
    "sie-plural": "sind",
  },
  futur: {
    ich: "werde",
    du: "wirst",
    er: "wird",
    sie: "wird",
    es: "wird",
    wir: "werden",
    ihr: "werdet",
    "sie-formal": "werden",
    "sie-plural": "werden",
  },
};

// Función para obtener la conjugación correcta
export function getWerdenConjugation(pronoun: Pronoun, tense: Tense): string {
  return WERDEN_CONJUGATIONS[tense][pronoun];
}

// Función para generar participios pasados (simplificada)
function getPastParticiple(verb: string): string {
  // Para verbos regulares, agregar ge- al inicio y -t al final
  if (verb.endsWith("en")) {
    const stem = verb.slice(0, -2);
    return `ge${stem}t`;
  }
  // Para verbos que terminan en -ieren (como studieren)
  if (verb.endsWith("ieren")) {
    const stem = verb.slice(0, -5);
    return `${stem}iert`;
  }
  // Fallback para otros casos
  return `ge${verb}t`;
}

// Función para obtener la respuesta esperada basada en el contexto
export function getExpectedAnswer(context: WerdenContext): string {
  if (context.isInfinitive) {
    if (context.function === "futuro" && context.mainVerb) {
      return context.mainVerb;
    }
    if (context.function === "verbo-pleno") {
      return "werden";
    }
    if (context.function === "pasiva") {
      return context.mainVerb ? getPastParticiple(context.mainVerb) : "werden";
    }
  }

  if (context.tense === "perfekt" && context.function === "verbo-pleno") {
    return getWerdenConjugation(context.pronoun, "perfekt");
  }

  return getWerdenConjugation(context.pronoun, context.tense);
}

// Función para validar la respuesta del usuario
export function validateWerdenForm(
  answer: string,
  context: WerdenContext
): WerdenValidationResult {
  const expectedAnswer = getExpectedAnswer(context);
  const normalizedAnswer = answer.trim().toLowerCase();
  const normalizedExpected = expectedAnswer.toLowerCase();

  const isCorrect = normalizedAnswer === normalizedExpected;

  // Generar explicación
  const explanation = generateExplanation(context, isCorrect, normalizedAnswer);

  // Generar hint
  const hint = generateWerdenHint(context);

  // Generar ejemplo
  const example = generateExample(context);

  // Detectar errores comunes
  const commonError = detectCommonErrors(normalizedAnswer, context);

  // Información sobre marcadores
  const markerInfo = generateMarkerInfo(context);

  return {
    isCorrect,
    explanation,
    hint,
    example,
    functionType: context.function,
    commonError,
    markerInfo,
  };
}

// Función para generar explicación
function generateExplanation(
  context: WerdenContext,
  isCorrect: boolean,
  userAnswer: string
): string {
  const expectedAnswer = getExpectedAnswer(context);

  if (isCorrect) {
    return `¡Correcto! Para "${context.pronoun}" en ${getFunctionLabel(
      context.function
    )}, se usa "${expectedAnswer}".`;
  }

  const functionLabel = getFunctionLabel(context.function);
  const tenseLabel = getTenseLabel(context.tense);

  if (context.isInfinitive) {
    return `Incorrecto. Para ${functionLabel}, necesitas el infinitivo "${expectedAnswer}".`;
  }

  return `Incorrecto. Para "${context.pronoun}" en ${functionLabel} (${tenseLabel}), se usa "${expectedAnswer}".`;
}

// Función para generar hints contextuales
export function generateWerdenHint(context: WerdenContext): string {
  const pronounLabel = getPronounLabel(context.pronoun);
  const functionLabel = getFunctionLabel(context.function);
  const tenseLabel = getTenseLabel(context.tense);

  if (context.isInfinitive) {
    if (context.function === "futuro") {
      return `En futuro, después de werden conjugado va el infinitivo del verbo principal.`;
    }
    if (context.function === "verbo-pleno") {
      return `Como verbo pleno, werden se usa en infinitivo después de otro verbo auxiliar.`;
    }
    if (context.function === "pasiva") {
      return `En pasiva, después de werden va el participio pasado del verbo principal.`;
    }
  }

  if (context.tense === "perfekt" && context.function === "verbo-pleno") {
    return `En Perfekt, werden como verbo pleno usa "sein" como auxiliar + "geworden".`;
  }

  if (context.function === "futuro") {
    return `Para futuro: ${pronounLabel} + werden conjugado + infinitivo al final.`;
  }

  if (context.function === "pasiva") {
    return `Para pasiva: ${pronounLabel} + werden conjugado + participio pasado.`;
  }

  return `Para ${functionLabel}: ${pronounLabel} + werden conjugado en ${tenseLabel}.`;
}

// Función para generar ejemplos
function generateExample(context: WerdenContext): string {
  const conjugation = getWerdenConjugation(context.pronoun, context.tense);

  switch (context.function) {
    case "verbo-pleno":
      if (context.tense === "perfekt") {
        return `Ejemplo: ${context.pronoun} ${conjugation} Lehrer geworden.`;
      }
      return `Ejemplo: ${context.pronoun} ${conjugation} Lehrer.`;

    case "futuro":
      return `Ejemplo: ${context.pronoun} ${conjugation} morgen arbeiten.`;

    case "pasiva":
      if (context.tense === "futur") {
        return `Ejemplo: Das Buch ${conjugation} gelesen werden.`;
      }
      return `Ejemplo: Das Buch ${conjugation} gelesen.`;

    default:
      return `Ejemplo: ${context.pronoun} ${conjugation}...`;
  }
}

// Función para detectar errores comunes
function detectCommonErrors(
  answer: string,
  context: WerdenContext
): string | undefined {
  const expectedAnswer = getExpectedAnswer(context);

  // Error de tiempo
  if (answer === "wurde" && context.tense === "prasens") {
    return 'Cuidado: "wurde" es pasado (Präteritum), necesitas presente.';
  }

  if (answer === "werde" && context.pronoun === "du") {
    return 'Cuidado: para "du" se usa "wirst", no "werde".';
  }

  if (answer === "wirst" && context.pronoun === "ich") {
    return 'Cuidado: para "ich" se usa "werde", no "wirst".';
  }

  // Error de función
  if (context.function === "futuro" && answer.includes("geworden")) {
    return 'Cuidado: "geworden" es para verbo pleno en Perfekt, no para futuro.';
  }

  if (
    context.function === "verbo-pleno" &&
    answer.includes("werden") &&
    context.tense === "prasens"
  ) {
    return "Cuidado: en presente como verbo pleno, werden se conjuga, no se usa en infinitivo.";
  }

  return undefined;
}

// Función para generar información sobre marcadores
function generateMarkerInfo(context: WerdenContext): string {
  switch (context.function) {
    case "futuro":
      return "Marcadores de futuro: morgen, nächste Woche, bald, etc.";
    case "pasiva":
      return "Marcadores de pasiva: von + dativo, o ausencia de sujeto activo.";
    case "verbo-pleno":
      return "Marcadores de verbo pleno: cambio de estado, profesión, características.";
    default:
      return "";
  }
}

// Funciones auxiliares para etiquetas
function getFunctionLabel(functionType: WerdenFunction): string {
  switch (functionType) {
    case "verbo-pleno":
      return "verbo pleno";
    case "futuro":
      return "futuro";
    case "pasiva":
      return "pasiva";
  }
}

function getTenseLabel(tense: Tense): string {
  switch (tense) {
    case "prasens":
      return "presente";
    case "perfekt":
      return "perfekt";
    case "futur":
      return "futuro";
  }
}

function getPronounLabel(pronoun: Pronoun): string {
  switch (pronoun) {
    case "ich":
      return "yo";
    case "du":
      return "tú";
    case "er":
      return "él";
    case "sie":
      return "ella";
    case "es":
      return "ello";
    case "wir":
      return "nosotros";
    case "ihr":
      return "vosotros";
    case "sie-formal":
      return "usted";
    case "sie-plural":
      return "ellos/ellas";
  }
}
