"use client";

import { useVariant } from "@/hooks/useVariant";

interface WorkshopTitleProps {
  title: string;
  subtitle: string;
}

export function WorkshopTitle({ title, subtitle }: WorkshopTitleProps) {
  const { currentVariant, availableVariants } = useVariant();

  // Solo mostrar la versión si hay múltiples variantes disponibles
  const showVariant = availableVariants.length > 1;

  return (
    <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold">
        <span className="inline-block bg-background text-foreground rounded-xl px-4 py-2 shadow-sm">
          {title}
          {showVariant && (
            <span className="ml-2 text-3xl md:text-4xl font-bold">
              - Versión {currentVariant}
            </span>
          )}
        </span>
      </h1>
      <p className="mt-3">
        <span className="inline-block bg-background text-foreground rounded-full px-3 py-1 shadow-sm">
          {subtitle}
        </span>
      </p>
    </div>
  );
}
