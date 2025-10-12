<!-- 2bfbc8c2-ec1b-4a71-800a-349272c039a6 139d50f7-1e43-4097-aa49-44b67484e2d9 -->
# Plan Técnico: Integración Taller "Werden"

## Arquitectura y Componentes

### 1. Sistema de Validación Contextual (`/src/lib/werden-rules.ts`)

Crear lógica de validación inspirada en `adjective-rules.ts` que maneje:

**Tipos y contextos:**

```typescript
type WerdenFunction = 'verbo-pleno' | 'futuro' | 'pasiva';
type Tense = 'prasens' | 'perfekt' | 'futur';
type Pronoun = 'ich' | 'du' | 'er' | 'sie' | 'es' | 'wir' | 'ihr' | 'sie-formal';

interface WerdenContext {
  pronoun: Pronoun;
  function: WerdenFunction;
  tense: Tense;
  auxiliaryVerb?: string; // para casos como "wird... werden" en pasiva futura
}
```

**Funciones clave:**

- `getWerdenConjugation(pronoun, tense)`: Retorna la conjugación correcta
- `validateWerdenForm(answer, context)`: Valida y retorna feedback detallado
- `generateWerdenHint(context)`: Genera pistas contextuales basadas en función/pronombre
- `detectCommonErrors(answer, context)`: Identifica errores típicos (confusión de tiempos, funciones)

**Tabla de conjugación interna:**

```typescript
const WERDEN_CONJUGATIONS = {
  prasens: { ich: 'werde', du: 'wirst', er: 'wird', ... },
  perfekt_auxiliary: { ich: 'bin', du: 'bist', ... }, // + 'geworden'
  // etc.
}
```

### 2. Componentes de Sección

Crear 4 componentes siguiendo el patrón del taller de adjetivos:

#### `SectionWerdenIntro.tsx`

- Tabla de conjugación en presente (sección 1.2 del markdown)
- Tabla de funciones clave (sección 1.1)
- 4 ejercicios de calentamiento (sección 1.3) con **inputs** + validación
- Usa `useSectionState` hook para tracking
- Botones: Verificar, Pista, Rellenar

#### `ExerciseWerdenCentral.tsx` 

- 6 ejercicios de múltiple opción (sección 2 del markdown)
- Cada ejercicio muestra 3 opciones (a, b, c)
- Input adicional para identificar función (VP/F/P)
- Feedback explica tanto la respuesta correcta como la función
- Botones: Verificar, Pista (explica función), Ver respuesta

#### `NarrativeWerdenCloze.tsx`

- Relato de Julia (sección 3) con **inputs** para completar
- 3 párrafos con ~10 espacios en blanco total
- Similar a `NarrativeCloze.tsx` pero adaptado a conjugaciones
- Validación por párrafo completo
- Botones por párrafo: Verificar, Pistas, Rellenar

#### `ResourcesWerdenList.tsx`

- Adaptar `ResourcesList.tsx` con recursos de sección 4 del markdown
- Recursos enfocados en werden, voz pasiva, Futur I
- Mantener sistema de favoritos

### 3. Rutas y Navegación

**Actualizar menú principal** (`/src/app/page.tsx`):

```typescript
{
  id: "werden",
  title: "⚡ Taller del Verbo WERDEN",
  description: "Nivel A2 | Verbo pleno, Futuro y Pasiva",
  href: "/workshops/werden",
  status: "available"
}
```

**Crear página del taller** (`/src/app/workshops/werden/page.tsx`):

- Estructura idéntica a `adjetivo/page.tsx`
- Header: "Taller Intensivo: Dominando el Verbo WERDEN"
- TopTabs con estructura de 4 secciones
- Footer y botón de regreso

### 4. Sistema de Tipos

**Crear** `/src/types/werden.ts`:

```typescript
export interface WerdenContext { ... }
export interface WerdenValidationResult {
  isCorrect: boolean;
  explanation: string;
  hint: string;
  example: string;
  functionType: WerdenFunction;
  commonError?: string;
}
export interface WerdenExercise {
  id: string;
  sentence: string;
  context: WerdenContext;
  options?: string[]; // para múltiple opción
}
```

### 5. Sistema de Contenido Configurable (JSON)

**El JSON solo describe las actividades interactivas (ejercicios), no contenido estático.**

**Crear** `/src/data/workshops/werden-exercises.json`:

```json
{
  "workshopId": "werden",
  "sections": {
    "warmup": [
      {
        "id": "warm-1",
        "sentence": "Ich ___ Ingenieur.",
        "expectedAnswer": "werde",
        "context": {
          "pronoun": "ich",
          "function": "verbo-pleno",
          "tense": "prasens"
        }
      },
      {
        "id": "warm-2",
        "sentence": "Du ___ dick, wenn du nur Süßigkeiten isst.",
        "expectedAnswer": "wirst",
        "context": {
          "pronoun": "du",
          "function": "verbo-pleno",
          "tense": "prasens"
        }
      },
      {
        "id": "warm-3",
        "sentence": "Die Autos ___ immer teurer.",
        "expectedAnswer": "werden",
        "context": {
          "pronoun": "sie-plural",
          "function": "verbo-pleno",
          "tense": "prasens"
        }
      },
      {
        "id": "warm-4",
        "sentence": "Wir ___ jetzt Erwachsene.",
        "expectedAnswer": "werden",
        "context": {
          "pronoun": "wir",
          "function": "verbo-pleno",
          "tense": "prasens"
        }
      }
    ],
    "central": [
      {
        "id": "mc-1",
        "sentence": "Morgen ___ wir ins Kino ___ (gehen).",
        "options": [
          "werden... gehen",
          "sind... gegangen",
          "werden... gegangen"
        ],
        "correctAnswer": "werden... gehen",
        "correctFunction": "F",
        "context": {
          "pronoun": "wir",
          "function": "futuro",
          "tense": "prasens",
          "mainVerb": "gehen"
        }
      },
      {
        "id": "mc-2",
        "sentence": "Die Hausaufgaben ___ von den Schülern ___ (machen).",
        "options": [
          "werden... gemacht",
          "werden... machen",
          "sind... geworden"
        ],
        "correctAnswer": "werden... gemacht",
        "correctFunction": "P",
        "context": {
          "pronoun": "sie-plural",
          "function": "pasiva",
          "tense": "prasens",
          "mainVerb": "machen"
        }
      },
      {
        "id": "mc-3",
        "sentence": "Er ___ ein guter Sänger.",
        "options": [
          "hat",
          "wird",
          "ist"
        ],
        "correctAnswer": "wird",
        "correctFunction": "VP",
        "context": {
          "pronoun": "er",
          "function": "verbo-pleno",
          "tense": "prasens"
        }
      },
      {
        "id": "mc-4",
        "sentence": "Nächste Woche ___ ich meine Eltern ___ (besuchen).",
        "options": [
          "werde... besucht",
          "werde... besuchen",
          "bin... geworden"
        ],
        "correctAnswer": "werde... besuchen",
        "correctFunction": "F",
        "context": {
          "pronoun": "ich",
          "function": "futuro",
          "tense": "prasens",
          "mainVerb": "besuchen"
        }
      },
      {
        "id": "mc-5",
        "sentence": "Ich ___ krank ___ (werden in Perfekt).",
        "options": [
          "werde... geworden",
          "bin... geworden",
          "habe... geworden"
        ],
        "correctAnswer": "bin... geworden",
        "correctFunction": "VP",
        "context": {
          "pronoun": "ich",
          "function": "verbo-pleno",
          "tense": "perfekt"
        }
      },
      {
        "id": "mc-6",
        "sentence": "Die Rechnung ___ bald ___ (bezahlen - Futuro Pasivo).",
        "options": [
          "wird... bezahlt werden",
          "wird... bezahlt",
          "ist... bezahlt"
        ],
        "correctAnswer": "wird... bezahlt werden",
        "correctFunction": "P/F",
        "context": {
          "pronoun": "sie-singular",
          "function": "pasiva",
          "tense": "futur",
          "mainVerb": "bezahlen"
        }
      }
    ],
    "narrative": [
      {
        "id": "para-1",
        "germanText": "Julia hat 25 Jahre alt und ist abgengt von ihrem jetzigen Job. Sie {0} eine neue Karriere {1}. Nächstes Jahr {2} sie in Berlin {3}. Sie {4} bestimmt eine tolle Ärztin.",
        "clozes": [
          {
            "id": "cloze-1",
            "expectedAnswer": "wird",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "starten" }
          },
          {
            "id": "cloze-2",
            "expectedAnswer": "starten",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "starten", "isInfinitive": true }
          },
          {
            "id": "cloze-3",
            "expectedAnswer": "wird",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "studieren" }
          },
          {
            "id": "cloze-4",
            "expectedAnswer": "studieren",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "studieren", "isInfinitive": true }
          },
          {
            "id": "cloze-5",
            "expectedAnswer": "wird",
            "context": { "pronoun": "sie", "function": "verbo-pleno", "tense": "prasens" }
          }
        ]
      },
      {
        "id": "para-2",
        "germanText": "Sie weiß, dass das Studium schwer {0}. Aber sie {1} sich nicht {2}. Zuerst {3} sie eine kleine Wohnung {4}.",
        "clozes": [
          {
            "id": "cloze-6",
            "expectedAnswer": "wird",
            "context": { "pronoun": "es", "function": "verbo-pleno", "tense": "prasens" }
          },
          {
            "id": "cloze-7",
            "expectedAnswer": "wird",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "ärgern" }
          },
          {
            "id": "cloze-8",
            "expectedAnswer": "ärgern",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "ärgern", "isInfinitive": true }
          },
          {
            "id": "cloze-9",
            "expectedAnswer": "wird",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "suchen" }
          },
          {
            "id": "cloze-10",
            "expectedAnswer": "suchen",
            "context": { "pronoun": "sie", "function": "futuro", "tense": "prasens", "mainVerb": "suchen", "isInfinitive": true }
          }
        ]
      },
      {
        "id": "para-3",
        "germanText": "Ihre Freunde fragen: „Was {0} aus dir {1}?" Julia antwortet: „Ich {2} eine glückliche Frau {3}."",
        "clozes": [
          {
            "id": "cloze-11",
            "expectedAnswer": "wird",
            "context": { "pronoun": "es", "function": "verbo-pleno", "tense": "prasens" }
          },
          {
            "id": "cloze-12",
            "expectedAnswer": "werden",
            "context": { "pronoun": "du", "function": "verbo-pleno", "tense": "prasens", "isInfinitive": true }
          },
          {
            "id": "cloze-13",
            "expectedAnswer": "werde",
            "context": { "pronoun": "ich", "function": "futuro", "tense": "prasens", "mainVerb": "werden" }
          },
          {
            "id": "cloze-14",
            "expectedAnswer": "werden",
            "context": { "pronoun": "ich", "function": "futuro", "tense": "prasens", "mainVerb": "werden", "isInfinitive": true }
          }
        ]
      }
    ]
  }
}
```

#### Loader y Parser

**Crear** `/src/lib/workshop-loader.ts`:

```typescript
import werdenExercises from '@/data/workshops/werden-exercises.json';

export type WorkshopExercises = typeof werdenExercises;

export function loadWorkshopExercises(workshopId: string) {
  const workshops = { werden: werdenExercises };
  return workshops[workshopId];
}

// Helpers para acceder a ejercicios específicos
export function getWarmupExercises(workshopId: string) {
  return loadWorkshopExercises(workshopId).sections.warmup;
}

export function getCentralExercises(workshopId: string) {
  return loadWorkshopExercises(workshopId).sections.central;
}

export function getNarrativeExercises(workshopId: string) {
  return loadWorkshopExercises(workshopId).sections.narrative;
}
```

#### Componentes con JSON

Los componentes importan y usan los ejercicios del JSON:

```typescript
// SectionWerdenIntro.tsx
import { getWarmupExercises } from '@/lib/workshop-loader';

export function SectionWerdenIntro() {
  const exercises = getWarmupExercises('werden');
  
  // Contenido estático (tablas, títulos) hardcodeado en el componente
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 I. Repaso y Diagnóstico</CardTitle>
        {/* Tabla de funciones - hardcodeada */}
        {/* Tabla de conjugación - hardcodeada */}
      </CardHeader>
      <CardContent>
        {/* Ejercicios dinámicos desde JSON */}
        {exercises.map(ex => <ExerciseInput key={ex.id} exercise={ex} />)}
      </CardContent>
    </Card>
  );
}
```

**Ventajas del enfoque JSON solo para ejercicios:**

1. **Separación clara**: Código (UI/lógica) vs Datos (ejercicios)
2. **Fácil mantenimiento**: Cambiar ejercicios sin tocar React
3. **Escalabilidad**: Agregar más ejercicios o variantes
4. **Testing**: Fácil crear tests con diferentes sets de ejercicios
5. **Futura migración**: Podría moverse a una API/base de datos

### 6. Datos de Ejercicios

**Migración del contenido del markdown a JSON:**

- Parsear `werden.md` y convertir a estructura JSON
- 4 ejercicios de calentamiento → `warmupExercises`
- 6 ejercicios centrales → `exercises` con múltiple opción
- Relato de Julia → `paragraphs` con `clozes`
- Recursos → `resources` array

### 7. Tests

**Crear** `/src/lib/__tests__/werden-rules.test.ts`:

- Test de conjugación para todos los pronombres
- Test de validación con diferentes contextos
- Test de generación de hints
- Test de detección de errores comunes

## Implementación Step-by-Step

1. Crear sistema de tipos (`werden.ts`)
2. Implementar lógica de validación (`werden-rules.ts`)
3. Escribir tests para validación
4. Crear componente `SectionWerdenIntro`
5. Crear componente `ExerciseWerdenCentral` (híbrido múltiple opción)
6. Crear componente `NarrativeWerdenCloze` (inputs)
7. Crear componente `ResourcesWerdenList`
8. Crear página del taller (`/workshops/werden/page.tsx`)
9. Actualizar menú principal (reemplazar "Example" con "WERDEN")
10. Eliminar ruta `/workshops/example`
11. Testing manual de flujo completo

## Consideraciones de UX

- Mantener consistencia visual con taller de adjetivos
- Usar mismo sistema de progreso y badges
- Hints deben explicar la función (VP/F/P) además de la conjugación
- Feedback diferenciado: error de conjugación vs error de función
- En ejercicio central, mostrar explicación de función al verificar
- En relato, permitir completar párrafo por párrafo

## Reutilización de Código

- Hook `useSectionState`: sin cambios
- Componentes UI (Card, Button, Input, Progress): sin cambios
- Patrón de estructura de secciones: igual que adjetivos
- Sistema de toast para feedback: igual

### To-dos

- [ ] Crear archivo de tipos /src/types/werden.ts con interfaces WerdenContext, WerdenValidationResult, WerdenExercise
- [ ] Implementar /src/lib/werden-rules.ts con funciones de validación, conjugación, hints y detección de errores
- [ ] Crear /src/lib/__tests__/werden-rules.test.ts con tests de validación y conjugación
- [ ] Crear componente /src/components/sections/SectionWerdenIntro.tsx con tabla de conjugación y 4 ejercicios de calentamiento
- [ ] Crear componente /src/components/sections/ExerciseWerdenCentral.tsx con 6 ejercicios de múltiple opción híbridos
- [ ] Crear componente /src/components/sections/NarrativeWerdenCloze.tsx con relato de Julia e inputs para completar
- [ ] Crear componente /src/components/sections/ResourcesWerdenList.tsx adaptado con recursos específicos de werden
- [ ] Crear página /src/app/workshops/werden/page.tsx integrando todos los componentes con TopTabs
- [ ] Actualizar /src/app/page.tsx reemplazando tarjeta 'Example' con tarjeta de taller 'WERDEN'
- [ ] Eliminar directorio /src/app/workshops/example y su contenido
- [ ] Testing manual del flujo completo: navegación, ejercicios, validación, hints, progreso