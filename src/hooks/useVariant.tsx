"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface VariantContextType {
  currentVariant: number;
  setCurrentVariant: (variant: number) => void;
  availableVariants: number[];
  setAvailableVariants: (variants: number[]) => void;
  onVariantChange?: (variant: number) => void;
  setOnVariantChange: (callback: (variant: number) => void) => void;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

export function VariantProvider({ children }: { children: ReactNode }) {
  const [currentVariant, setCurrentVariant] = useState(1);
  const [availableVariants, setAvailableVariants] = useState<number[]>([1]);
  const [onVariantChange, setOnVariantChange] = useState<
    ((variant: number) => void) | undefined
  >();

  // Use ref to track previous variant to detect changes
  const prevVariantRef = useRef(currentVariant);

  // Execute callback after render when variant changes
  useEffect(() => {
    if (prevVariantRef.current !== currentVariant && onVariantChange) {
      onVariantChange(currentVariant);
    }

    // Always dispatch reset event when variant changes (except initial load)
    if (prevVariantRef.current !== currentVariant) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("resetAllSections"));
      }, 0);
    }

    prevVariantRef.current = currentVariant;
  }, [currentVariant, onVariantChange]);

  const handleSetCurrentVariant = useCallback((variant: number) => {
    setCurrentVariant(variant);
  }, []);

  return (
    <VariantContext.Provider
      value={{
        currentVariant,
        setCurrentVariant: handleSetCurrentVariant,
        availableVariants,
        setAvailableVariants,
        onVariantChange,
        setOnVariantChange,
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
