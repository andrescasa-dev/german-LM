# 📋 Tipado TypeScript para Variantes de Ejercicios

## Resumen

Se ha definido un sistema completo de tipado TypeScript que mapea exactamente la estructura de los archivos JSON de variantes (`variant-*.json`) para los talleres de alemán. El tipado está organizado en tres archivos principales que cubren diferentes aspectos del sistema.

## 📁 Archivos de Tipos Creados

### 1. `src/types/workshop-variants.ts`
**Tipos principales del sistema de talleres**

#### Tipos Base Comunes
- `WorkshopId` - Identificadores de talleres ("adjetivo", "preposiciones-temporales", "werden")
- `WorkshopSection` - Secciones disponibles ("warmup", "central", "narrative")
- `BaseExerciseVariant` - Estructura mínima de ejercicios
- `BaseExerciseContext` - Contexto genérico de validación

#### Tipos Específicos de Adjetivos
```typescript
// Tipos de declinación
type AdjectiveDeclensionType = "weak" | "mixed" | "strong";

// Casos gramaticales alemanes
type GermanCase = "nominativ" | "akkusativ" | "dativ" | "genitiv";

// Géneros gramaticales
type GermanGender = "maskulin" | "feminin" | "neutrum";

// Números gramaticales
type GermanNumber = "singular" | "plural";

// Tipos de artículos
type ArticleType = "definite" | "indefinite" | "possessive" | "kein" | "none";

// Estructura completa de ejercicios de adjetivos
interface AdjectiveExercise {
  id: string;
  type: AdjectiveDeclensionType;
  sentence: string;
  adjective: string;
  context: AdjectiveExerciseContext;
  imageAlt: string;
}
```

#### Tipos Específicos de Preposiciones Temporales
```typescript
// Casos para preposiciones
type PrepositionCase = "dativo" | "acusativo" | "dativo... acusativo";

// Unidades de tiempo
type TimeUnit = "mes" | "hora" | "festividad-dia" | "estacion" | 
                "momento-dia" | "fecha" | "duracion" | "secuencia" | 
                "periodo-completo" | "limite" | "dia-semana" | "inicio-periodo";

// Estructura completa de ejercicios de preposiciones
interface PrepositionTemporalExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: PrepositionTemporalContext;
}
```

#### Union Types Genéricos
- `AnyExercise` - Unión de todos los tipos de ejercicios
- `AnyExerciseContext` - Unión de todos los contextos
- `AnyWorkshopVariant` - Unión de todas las variantes
- `AnyValidationResult` - Unión de todos los resultados de validación

### 2. `src/types/workshop-implementation.ts`
**Tipos para implementación y loaders**

#### Tipos para Workshop Loader
```typescript
interface WorkshopDefinition {
  id: WorkshopId;
  hasVariants: boolean;
  variantCount: number;
  loaderFn: WorkshopVariantLoader<AnyWorkshopVariant>;
  vocabularyLoaderFn?: WorkshopVocabularyLoader;
}

type WorkshopVariantLoader<T> = (
  workshopId: WorkshopId,
  variant: number
) => Promise<T>;
```

#### Tipos para Adaptadores
```typescript
type ExerciseAdapter<T> = (exercise: T) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: AnyExerciseContext;
};

type ContextAdapter<T> = (context: T) => AnyExerciseContext;
type ContextExtractor<T> = (baseContext: AnyExerciseContext) => T;
```

#### Tipos para Validadores
```typescript
interface WorkshopValidator<T, R> {
  validate: ValidationFunction<T>;
  generateHint: HintGenerator<T>;
  getCorrectAnswer: AnswerGetter<T>;
}
```

#### Tipos para Componentes Genéricos
```typescript
interface GenericExerciseProps<T> {
  exercise: T;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
}
```

### 3. `src/types/workshop-json.ts`
**Tipos específicos para datos JSON**

#### Tipos JSON de Adjetivos
```typescript
// Mapea exactamente la estructura del JSON
interface AdjectiveCentralExerciseJSON {
  id: string;
  type: "weak" | "mixed" | "strong";
  sentence: string;
  adjective: string;
  context: AdjectiveExerciseContextJSON;
  imageAlt: string;
}

interface AdjectiveWorkshopVariantJSON {
  workshopId: "adjetivo";
  sections: {
    central: AdjectiveCentralExerciseJSON[];
    narrative: AdjectiveNarrativeParagraphJSON[];
  };
}
```

#### Tipos JSON de Preposiciones Temporales
```typescript
// Mapea exactamente la estructura del JSON
interface PrepositionTemporalExerciseJSON {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: PrepositionTemporalContextJSON;
}

interface PrepositionTemporalWorkshopVariantJSON {
  workshopId: "preposiciones-temporales";
  sections: {
    warmup: PrepositionTemporalExerciseJSON[];
    central: PrepositionTemporalExerciseJSON[];
    narrative: PrepositionTemporalNarrativeParagraphJSON[];
  };
}
```

#### Tipos de Transformación JSON → TypeScript
```typescript
type JSONToTSExerciseTransformer<TJSON, TTS> = (jsonExercise: TJSON) => TTS;
type JSONToTSContextTransformer<TJSON, TTS> = (jsonContext: TJSON) => TTS;
type JSONToTSNarrativeTransformer<TJSON, TTS> = (jsonParagraph: TJSON) => TTS;
```

### 4. `src/types/index.ts`
**Índice organizado de todos los tipos**

#### Re-exportaciones Organizadas
- Tipos base y comunes
- Tipos específicos de adjetivos
- Tipos específicos de preposiciones temporales
- Tipos genéricos y union types
- Tipos para implementación y loaders
- Tipos para datos JSON

#### Constantes de Tipos para Runtime
```typescript
export const WORKSHOP_IDS = ["adjetivo", "preposiciones-temporales", "werden"] as const;
export const WORKSHOP_SECTIONS = ["warmup", "central", "narrative"] as const;
export const ADJECTIVE_DECLENSION_TYPES = ["weak", "mixed", "strong"] as const;
export const GERMAN_CASES = ["nominativ", "akkusativ", "dativ", "genitiv"] as const;
export const GERMAN_GENDERS = ["maskulin", "feminin", "neutrum"] as const;
export const GERMAN_NUMBERS = ["singular", "plural"] as const;
export const ARTICLE_TYPES = ["definite", "indefinite", "possessive", "kein", "none"] as const;
export const PREPOSITION_CASES = ["dativo", "acusativo", "dativo... acusativo"] as const;
export const TIME_UNITS = ["mes", "hora", "festividad-dia", "estacion", ...] as const;
```

#### Utilidades de Tipos
```typescript
// Extrae el tipo de ejercicio de una variante
type ExtractExerciseType<T extends AnyWorkshopVariant> = 
  T extends AdjectiveWorkshopVariant 
    ? AdjectiveExercise
    : T extends PrepositionTemporalWorkshopVariant
    ? PrepositionTemporalExercise
    : never;

// Mapeo de workshop ID a tipo de variante
interface WorkshopIdToVariantMap {
  "adjetivo": AdjectiveWorkshopVariant;
  "preposiciones-temporales": PrepositionTemporalWorkshopVariant;
  "werden": never; // TODO: Implementar cuando esté disponible
}
```

## 🎯 Mapeo JSON → TypeScript

### Estructura de Adjetivos (variant-1.json)
```json
{
  "workshopId": "adjetivo",
  "sections": {
    "central": [
      {
        "id": "akk-weak",
        "type": "weak",
        "sentence": "Ich sehe den _____ Wagen.",
        "adjective": "neu",
        "context": {
          "determiner": {
            "word": "den",
            "type": "definite",
            "case": "akkusativ",
            "gender": "maskulin",
            "number": "singular"
          },
          "case": "akkusativ",
          "gender": "maskulin",
          "number": "singular"
        },
        "imageAlt": "Un coche nuevo con artículo definido"
      }
    ],
    "narrative": [...]
  }
}
```

**Mapea a:**
```typescript
AdjectiveWorkshopVariantJSON {
  workshopId: "adjetivo";
  sections: {
    central: AdjectiveCentralExerciseJSON[];
    narrative: AdjectiveNarrativeParagraphJSON[];
  };
}
```

### Estructura de Preposiciones Temporales (variant-1.json)
```json
{
  "workshopId": "preposiciones-temporales",
  "sections": {
    "warmup": [
      {
        "id": "warm-1",
        "sentence": "Ich habe Geburtstag ____ Mai.",
        "expectedAnswer": "im",
        "context": {
          "preposition": "im",
          "case": "dativo",
          "timeUnit": "mes",
          "explanation": "Meses usan 'im'"
        }
      }
    ],
    "central": [...],
    "narrative": [...]
  }
}
```

**Mapea a:**
```typescript
PrepositionTemporalWorkshopVariantJSON {
  workshopId: "preposiciones-temporales";
  sections: {
    warmup: PrepositionTemporalExerciseJSON[];
    central: PrepositionTemporalExerciseJSON[];
    narrative: PrepositionTemporalNarrativeParagraphJSON[];
  };
}
```

## 🔧 Uso en la Implementación

### 1. Para Loaders
```typescript
import type { 
  AdjectiveWorkshopVariantJSON,
  WorkshopVariantJSONLoader 
} from "@/types";

const loadAdjectiveVariant: WorkshopVariantJSONLoader<AdjectiveWorkshopVariantJSON> = 
  async (workshopId, variant) => {
    const data = await import(`@/data/workshops/adjective-exercises/variant-${variant}.json`);
    return data.default;
  };
```

### 2. Para Adaptadores
```typescript
import type { 
  AdjectiveCentralExerciseJSON,
  AdjectiveExercise,
  ExerciseAdapter 
} from "@/types";

const adaptAdjectiveToBase: ExerciseAdapter<AdjectiveCentralExerciseJSON> = 
  (jsonExercise) => ({
    id: jsonExercise.id,
    sentence: jsonExercise.sentence,
    expectedAnswer: jsonExercise.adjective, // Mapeo específico
    context: {
      explanation: "Contexto de adjetivo",
      ...jsonExercise.context
    }
  });
```

### 3. Para Validadores
```typescript
import type { 
  AdjectiveExerciseContext,
  AdjectiveValidationResult,
  WorkshopValidator 
} from "@/types";

class AdjectiveValidator implements WorkshopValidator<AdjectiveExerciseContext, AdjectiveValidationResult> {
  validate(answer: string, context: AdjectiveExerciseContext): AdjectiveValidationResult {
    // Implementación específica
  }
  
  generateHint(context: AdjectiveExerciseContext): string {
    // Implementación específica
  }
  
  getCorrectAnswer(context: AdjectiveExerciseContext): string {
    // Implementación específica
  }
}
```

### 4. Para Componentes Genéricos
```typescript
import type { 
  GenericExerciseProps,
  AnyExercise 
} from "@/types";

function ExerciseRenderer<T extends AnyExercise>({
  exercise,
  answer,
  onAnswerChange,
  onSubmit,
  onHint,
  onFill,
  disabled = false
}: GenericExerciseProps<T>) {
  // Implementación genérica
}
```

## ✅ Beneficios del Tipado

1. **Type Safety Completo**: Previene errores en tiempo de compilación
2. **IntelliSense Mejorado**: Autocompletado preciso en IDEs
3. **Refactoring Seguro**: Cambios se propagan automáticamente
4. **Documentación Automática**: Los tipos documentan la estructura
5. **Validación de Datos**: Estructura JSON validada contra tipos
6. **Escalabilidad**: Fácil agregar nuevos talleres siguiendo el patrón
7. **Mantenibilidad**: Cambios en estructura se detectan inmediatamente

## 🚀 Próximos Pasos

1. **Implementar Loaders**: Usar los tipos para crear loaders type-safe
2. **Crear Adaptadores**: Implementar transformaciones JSON → TypeScript
3. **Refactorizar Validadores**: Usar la interfaz común `WorkshopValidator`
4. **Actualizar Componentes**: Migrar a tipos genéricos
5. **Testing**: Crear tests que validen la estructura JSON contra tipos

El sistema de tipado está completo y listo para ser usado en toda la implementación del sistema de talleres.
