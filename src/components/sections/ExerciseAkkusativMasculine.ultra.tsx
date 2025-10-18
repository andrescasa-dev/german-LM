/**
 * Ejercicio de Adjetivos - Versión Ultra Simplificada
 * Demuestra la máxima reutilización posible
 *
 * COMPARACIÓN:
 * - Versión original: ~380 líneas
 * - Versión refactorizada: ~150 líneas
 * - Versión ultra: ~15 líneas
 *
 * Reducción del 96% del código!
 */

"use client";

import { UniversalExercise } from "@/components/workshop/UniversalExercise";
import { adjectiveExerciseConfig } from "./exercises.config";

/**
 * TODO el componente es una sola línea
 * Toda la complejidad está abstraída en configuración y componentes reutilizables
 */
export function ExerciseAkkusativMasculineUltra() {
  return <UniversalExercise config={adjectiveExerciseConfig} />;
}
