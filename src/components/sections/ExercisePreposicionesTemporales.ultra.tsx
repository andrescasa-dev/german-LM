/**
 * Ejercicio de Preposiciones - Versión Ultra Simplificada
 * Demuestra la máxima reutilización posible
 *
 * COMPARACIÓN:
 * - Versión original: ~300 líneas
 * - Versión refactorizada: ~120 líneas
 * - Versión ultra: ~15 líneas
 *
 * Reducción del 95% del código!
 */

"use client";

import { UniversalExercise } from "@/components/workshop/UniversalExercise";
import { preposicionesExerciseConfig } from "./exercises.config";

/**
 * TODO el componente es una sola línea
 * Demuestra que ambos talleres comparten el 100% de la lógica
 * Solo cambian los datos de configuración
 */
export function ExercisePreposicionesTemporalesUltra() {
  return <UniversalExercise config={preposicionesExerciseConfig} />;
}
