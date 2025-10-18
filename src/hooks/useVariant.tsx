"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VariantContextType {
  currentVariant: number;
  setCurrentVariant: (variant: number) => void;
  availableVariants: number[];
  setAvailableVariants: (variants: number[]) => void;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

export function VariantProvider({ children }: { children: ReactNode }) {
  const [currentVariant, setCurrentVariant] = useState(1);
  const [availableVariants, setAvailableVariants] = useState<number[]>([1]);

  return (
    <VariantContext.Provider
      value={{
        currentVariant,
        setCurrentVariant,
        availableVariants,
        setAvailableVariants,
      }}
    >
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  const context = useContext(VariantContext);
  if (context === undefined) {
    throw new Error("useVariant must be used within a VariantProvider");
  }
  return context;
}
