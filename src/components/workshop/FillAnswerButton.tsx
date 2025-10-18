"use client";

import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface FillAnswerButtonProps {
  exerciseId: string;
  getAnswer: () => string;
  onFill: (answer: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Botón reutilizable para rellenar la respuesta correcta
 * Implementa la funcionalidad estándar requerida en todos los ejercicios
 */
export function FillAnswerButton({
  exerciseId,
  getAnswer,
  onFill,
  disabled = false,
  className = "",
}: FillAnswerButtonProps) {
  const handleFill = () => {
    const correctAnswer = getAnswer();
    onFill(correctAnswer);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleFill}
      disabled={disabled}
      className={`w-full md:w-auto ${className}`}
      aria-label={`Rellenar respuesta correcta para ejercicio ${exerciseId}`}
    >
      <Wand2 className="h-4 w-4 mr-2" />
      Rellenar
    </Button>
  );
}
