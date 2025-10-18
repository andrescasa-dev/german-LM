/**
 * Interfaz común para validadores de talleres
 * Define el contrato estándar que todos los validadores deben implementar
 */

import type { BaseContext, BaseValidationResult } from "@/types/workshop-base";

/**
 * Interfaz base para validadores de talleres
 */
export interface WorkshopValidator<
  TContext = BaseContext,
  TResult = BaseValidationResult
> {
  /**
   * Valida una respuesta del usuario contra el contexto del ejercicio
   */
  validate(answer: string, context: TContext): TResult;

  /**
   * Genera una pista basada en el contexto del ejercicio
   */
  generateHint(context: TContext): string;

  /**
   * Obtiene la respuesta correcta basada en el contexto
   */
  getCorrectAnswer(context: TContext): string;
}

/**
 * Tipo genérico para funciones de validación
 */
export type ValidationFunction<TContext, TResult> = (
  answer: string,
  context: TContext
) => TResult;

/**
 * Tipo genérico para funciones de generación de pistas
 */
export type HintFunction<TContext> = (context: TContext) => string;

/**
 * Tipo genérico para funciones de obtención de respuesta correcta
 */
export type AnswerFunction<TContext> = (context: TContext) => string;

/**
 * Factory para crear validadores estándar
 */
export function createWorkshopValidator<TContext, TResult>(
  validateFn: ValidationFunction<TContext, TResult>,
  hintFn: HintFunction<TContext>,
  answerFn: AnswerFunction<TContext>
): WorkshopValidator<TContext, TResult> {
  return {
    validate: validateFn,
    generateHint: hintFn,
    getCorrectAnswer: answerFn,
  };
}

/**
 * Validador base que puede ser extendido por talleres específicos
 */
export abstract class BaseWorkshopValidator<
  TContext = BaseContext,
  TResult = BaseValidationResult
> implements WorkshopValidator<TContext, TResult>
{
  abstract validate(answer: string, context: TContext): TResult;
  abstract generateHint(context: TContext): string;
  abstract getCorrectAnswer(context: TContext): string;

  /**
   * Normaliza una respuesta para comparación
   */
  protected normalizeAnswer(answer: string): string {
    return answer.trim().toLowerCase();
  }

  /**
   * Crea un resultado de validación correcto
   */
  protected createCorrectResult(
    explanation: string,
    markerInfo?: string
  ): TResult {
    return {
      isCorrect: true,
      explanation,
      markerInfo,
    } as TResult;
  }

  /**
   * Crea un resultado de validación incorrecto
   */
  protected createIncorrectResult(
    explanation: string,
    example?: string,
    markerInfo?: string
  ): TResult {
    return {
      isCorrect: false,
      explanation,
      example,
      markerInfo,
    } as TResult;
  }
}
