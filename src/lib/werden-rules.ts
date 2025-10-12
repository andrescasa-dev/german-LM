import type {
  Pronoun,
  Tense,
  WerdenContext,
  WerdenFunction,
  WerdenValidationResult,
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
  const explanation = generateExplanation(context, isCorrect);

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
  isCorrect: boolean
): string {
  if (isCorrect) {
    const expectedAnswer = getExpectedAnswer(context);
    return `¡Correcto! Para "${context.pronoun}" en ${getFunctionLabel(
      context.function
    )}, se usa "${expectedAnswer}".`;
  }

  // Para respuestas incorrectas, generar explicación educativa sin mostrar la respuesta correcta
  const functionLabel = getFunctionLabel(context.function);
  const tenseLabel = getTenseLabel(context.tense);
  const pronounLabel = getPronounLabel(context.pronoun);

  if (context.isInfinitive) {
    switch (context.function) {
      case "futuro":
        return `En futuro, después de werden conjugado siempre va el infinitivo del verbo principal al final de la oración.`;
      case "verbo-pleno":
        return `Como verbo pleno, werden se usa en infinitivo después de otro verbo auxiliar (como en Perfekt).`;
      case "pasiva":
        return `En pasiva, después de werden conjugado va el participio pasado del verbo principal.`;
      default:
        return `Para ${functionLabel}, necesitas el infinitivo del verbo.`;
    }
  }

  // Explicaciones para conjugaciones incorrectas
  switch (context.function) {
    case "verbo-pleno":
      if (context.tense === "perfekt") {
        return `En Perfekt como verbo pleno, werden usa "sein" como auxiliar + "geworden". Para ${pronounLabel} se usa la conjugación de "sein".`;
      }
      return `Como verbo pleno, werden se conjuga normalmente. Para ${pronounLabel} en ${tenseLabel}, revisa la conjugación.`;

    case "futuro":
      return `En futuro, werden se conjuga según el pronombre y el verbo principal va al final en infinitivo. Para ${pronounLabel}, revisa la conjugación de werden.`;

    case "pasiva":
      return `En pasiva, werden se conjuga según el pronombre y el verbo principal va en participio pasado. Para ${pronounLabel}, revisa la conjugación.`;

    default:
      return `Para ${pronounLabel} en ${functionLabel} (${tenseLabel}), revisa la conjugación de werden.`;
  }
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
  const pronounLabel = getPronounLabel(context.pronoun);

  // Error de tiempo
  if (answer === "wurde" && context.tense === "prasens") {
    return '"wurde" es pasado (Präteritum). En presente necesitas la conjugación de werden.';
  }

  if (answer === "werde" && context.pronoun === "du") {
    return `Para "du" se usa "wirst", no "werde". Recuerda: du wirst, er/sie/es wird.`;
  }

  if (answer === "wirst" && context.pronoun === "ich") {
    return `Para "ich" se usa "werde", no "wirst". Recuerda: ich werde, du wirst.`;
  }

  if (
    answer === "wird" &&
    (context.pronoun === "ich" || context.pronoun === "du")
  ) {
    return `"wird" es para er/sie/es. Para ${pronounLabel} necesitas la conjugación correcta.`;
  }

  // Error de función
  if (context.function === "futuro" && answer.includes("geworden")) {
    return '"geworden" es para verbo pleno en Perfekt. En futuro necesitas werden + infinitivo.';
  }

  if (
    context.function === "futuro" &&
    answer.includes("gemacht") &&
    context.mainVerb === "machen"
  ) {
    return 'En futuro necesitas "machen" (infinitivo), no "gemacht" (participio).';
  }

  if (
    context.function === "pasiva" &&
    answer.includes("machen") &&
    context.mainVerb === "machen"
  ) {
    return 'En pasiva necesitas "gemacht" (participio), no "machen" (infinitivo).';
  }

  if (
    context.function === "verbo-pleno" &&
    answer.includes("werden") &&
    context.tense === "prasens"
  ) {
    return "En presente como verbo pleno, werden se conjuga según el pronombre, no se usa en infinitivo.";
  }

  // Errores específicos de Perfekt
  if (context.tense === "perfekt" && context.function === "verbo-pleno") {
    if (answer.includes("habe") || answer.includes("hat")) {
      return 'Werden como verbo pleno en Perfekt usa "sein" como auxiliar, no "haben".';
    }
    if (answer.includes("werden") && !answer.includes("geworden")) {
      return 'En Perfekt como verbo pleno necesitas "sein" + "geworden".';
    }
  }

  // Errores de futuro pasivo
  if (context.function === "pasiva" && context.tense === "futur") {
    if (answer.includes("bezahlt") && !answer.includes("werden")) {
      return 'En futuro pasivo necesitas "werden" + participio + "werden" al final.';
    }
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
