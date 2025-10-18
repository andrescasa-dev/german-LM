<!-- 69542c48-3e7a-466b-82d9-0ba113553410 7d29b3a0-50ef-420a-bf6a-38ccf64fcefe -->
# Refactorización de Reusabilidad de Talleres

## Resumen

Mejorar la reusabilidad del código mediante:

- Componentes base + wrappers específicos (opción 1-b)
- Tipos específicos + adaptadores de transformación (opción 2-b)
- Layout común con páginas individuales (opción 3-c)

## 1. Sistema de Tipos Base y Adaptadores

### Crear tipos base comunes

**Archivo**: `src/types/workshop-base.ts`

Definir interfaces genéricas que todos los talleres deben implementar:

- `BaseExercise` - estructura mínima para ejercicios
- `BaseContext` - contexto genérico de validación
- `BaseParagraph` - estructura para narrativas
- `BaseValidationResult` - resultado estándar de validación
- `WorkshopConfig` - configuración de taller

### Crear adaptadores de transformación

**Archivo**: `src/lib/workshop-adapters.ts`

Funciones que transforman entre tipos específicos y base:

- `adaptAdjectiveToBase()` - convertir ejercicios de adjetivos a formato base
- `adaptWerdenToBase()` - convertir ejercicios werden a formato base
- `adaptPreposicionesToBase()` - convertir preposiciones a formato base
- `extractExerciseFromBase()` - extraer datos específicos del formato base

Esto mantiene flexibilidad específica mientras permite operaciones genéricas.

## 2. Componentes Base Reutilizables

### 2.1 BaseExerciseSection (componente wrapper)

**Archivo**: `src/components/sections/BaseExerciseSection.tsx`

Componente genérico que encapsula:

- Header con título, descripción, emoji configurable
- Barra de progreso
- Estado con `useSectionState`
- Lógica de carga de variantes
- Sistema de reset
- Estadísticas (respuestas correctas, pistas usadas)

Props:

```typescript
{
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  workshopId: string;
  loadExercises: (variant: number) => Promise<T[]>;
  renderExercise: (exercise: T, handlers: ExerciseHandlers) => ReactNode;
}
```

### 2.2 BaseNarrativeSection

**Archivo**: `src/components/sections/BaseNarrativeSection.tsx`

Componente base para secciones narrativas:

- Carga de párrafos por variante
- Estado de respuestas y verificación
- Botones de verificar/pistas por párrafo
- Renderizado de texto con clozes

Props similares a BaseExerciseSection pero específico para narrativas.

### 2.3 BaseIntroSection

**Archivo**: `src/components/sections/BaseIntroSection.tsx`

Componente para secciones de repaso/diagnóstico:

- Estructura de encuesta inicial
- Preguntas de práctica
- Feedback visual consistente

### 2.4 Componente de botón "Rellenar" genérico

**Archivo**: `src/components/workshop/FillAnswerButton.tsx`

Botón reutilizable con lógica estándar:

```typescript
<FillAnswerButton
  exerciseId={exercise.id}
  getAnswer={() => getCorrectAnswer(exercise.context)}
  onFill={(answer) => setAnswers(prev => ({...prev, [id]: answer}))}
/>
```

## 3. Hook de Validación Genérico

### useExerciseValidation

**Archivo**: `src/hooks/useExerciseValidation.ts`

Hook que abstrae la lógica de validación común:

```typescript
const {
  answers,
  setAnswers,
  handleSubmit,
  handleHint,
  handleFill
} = useExerciseValidation({
  sectionId,
  exercises,
  validateFn,
  getHintFn,
  getAnswerFn,
  recordAnswer,
  recordHintUsed
});
```

## 4. Sistema de Reglas de Validación Estandarizado

### Interfaz común para rules

**Archivo**: `src/lib/validation-interface.ts`

Definir interfaz estándar que todos los `*-rules.ts` deben implementar:

```typescript
interface WorkshopValidator<TContext, TResult> {
  validate(answer: string, context: TContext): TResult;
  generateHint(context: TContext): string;
  getCorrectAnswer(context: TContext): string;
}
```

Refactorizar `adjective-rules.ts`, `werden-rules.ts`, `preposiciones-rules.ts` para implementar esta interfaz.

## 5. Layout de Workshop Común

### WorkshopLayout

**Archivo**: `src/components/workshop/WorkshopLayout.tsx`

Componente que encapsula la estructura común de todas las páginas:

- Header con banner, botón de volver, theme toggle
- WorkshopTitle
- TopTabs con configuración
- Footer
- Toaster
- VariantProvider

Props:

```typescript
{
  title: string;
  subtitle: string;
  workshopId: string;
  introSection: ReactNode;
  centralSection: ReactNode;
  narrativeSection: ReactNode;
  resourcesSection: ReactNode;
  contentSections: {id: string, label: string}[];
}
```

### Refactorizar páginas existentes

Simplificar `src/app/workshops/*/page.tsx` para usar `WorkshopLayout`:

```tsx
export default function AdjetivoWorkshop() {
  return (
    <WorkshopLayout
      title="🧙‍♀️ Taller de Declinación del Adjetivo Alemán"
      subtitle="Nivel A2.2–B1 | Enfoque comunicativo"
      workshopId="adjetivo"
      introSection={<SectionIntro />}
      centralSection={<ExerciseAkkusativMasculine />}
      narrativeSection={<NarrativeCloze />}
      resourcesSection={<ResourcesList />}
      contentSections={[...]}
    />
  );
}
```

## 6. Workshop Loader Mejorado

### Refactorizar workshop-loader

**Archivo**: `src/lib/workshop-loader.ts`

Mejorar con:

- Sistema de registro de talleres más declarativo
- Factory functions genéricas para cargar variantes
- Cache de variantes cargadas
- Mejor tipado con generics
```typescript
interface WorkshopDefinition {
  id: string;
  hasVariants: boolean;
  variantCount: number;
  loaderFn: (variant: number) => Promise<any>;
}

const WORKSHOP_REGISTRY: Record<string, WorkshopDefinition> = {
  adjetivo: {
    id: 'adjetivo',
    hasVariants: true,
    variantCount: 20,
    loaderFn: loadAdjectiveVariant
  },
  // ...
};
```


## 7. Utilidades Compartidas

### ExerciseUtils

**Archivo**: `src/lib/exercise-utils.ts`

Funciones comunes extraídas:

- `normalizeAnswer(answer: string)` - normalización de respuestas
- `calculateProgress(answers, total)` - cálculo de progreso
- `formatFeedback(result)` - formateo de feedback
- `handleKeyPress(event, onSubmit)` - manejo de teclas común

## 8. Actualizar Guía de Implementación

**Archivo**: `.cursor/rules/workshop-implementation.mdc`

Actualizar la guía con:

- Referencias a nuevos componentes base
- Patrón de uso de adaptadores
- Ejemplo de implementación simplificada
- Checklist actualizado con menos pasos

## Archivos Principales a Crear/Modificar

### Nuevos archivos

- `src/types/workshop-base.ts`
- `src/lib/workshop-adapters.ts`
- `src/lib/validation-interface.ts`
- `src/lib/exercise-utils.ts`
- `src/components/sections/BaseExerciseSection.tsx`
- `src/components/sections/BaseNarrativeSection.tsx`
- `src/components/sections/BaseIntroSection.tsx`
- `src/components/workshop/WorkshopLayout.tsx`
- `src/components/workshop/FillAnswerButton.tsx`
- `src/hooks/useExerciseValidation.ts`

### Archivos a refactorizar

- `src/lib/workshop-loader.ts` - mejorar con registry
- `src/lib/adjective-rules.ts` - implementar interfaz común
- `src/lib/werden-rules.ts` - implementar interfaz común
- `src/lib/preposiciones-rules.ts` - implementar interfaz común
- `src/app/workshops/adjetivo/page.tsx` - usar WorkshopLayout
- `src/app/workshops/werden/page.tsx` - usar WorkshopLayout
- `src/app/workshops/preposiciones-temporales/page.tsx` - usar WorkshopLayout
- `.cursor/rules/workshop-implementation.mdc` - actualizar guía

## Beneficios de esta Arquitectura

1. **Reducción de código duplicado**: ~60% menos código en nuevos talleres
2. **Consistencia**: Comportamiento uniforme entre talleres
3. **Flexibilidad**: Cada taller mantiene su lógica específica
4. **Mantenibilidad**: Cambios en lógica común se propagan automáticamente
5. **Escalabilidad**: Agregar nuevos talleres requiere mínimo código
6. **Testing**: Componentes base facilitan testing unitario

## Orden de Implementación

1. Crear tipos base y adaptadores (fundación)
2. Crear interfaces de validación y refactorizar rules
3. Crear utilidades compartidas
4. Crear componentes base (BaseExerciseSection, etc.)
5. Crear hooks genéricos (useExerciseValidation)
6. Crear WorkshopLayout
7. Refactorizar workshop-loader con registry
8. Migrar páginas existentes a usar WorkshopLayout
9. Actualizar documentación
10. Testing y validación

### To-dos

- [ ] Crear tipos base y sistema de adaptadores (workshop-base.ts, workshop-adapters.ts)
- [ ] Crear interfaz de validación común y refactorizar *-rules.ts para implementarla
- [ ] Crear utilidades compartidas (exercise-utils.ts) con funciones comunes
- [ ] Crear componentes base (BaseExerciseSection, BaseNarrativeSection, BaseIntroSection)
- [ ] Crear hooks genéricos (useExerciseValidation, etc.)
- [ ] Crear WorkshopLayout y FillAnswerButton componentes
- [ ] Refactorizar workshop-loader con sistema de registry declarativo
- [ ] Migrar páginas de talleres existentes para usar WorkshopLayout
- [ ] Actualizar workshop-implementation.mdc con nuevos patrones
- [ ] Validar que todos los talleres funcionan correctamente y ejecutar tests