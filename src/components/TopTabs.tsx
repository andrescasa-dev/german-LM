"use client";

import { useCallback, useState, useEffect } from "react";
import LeftSectionNav from "@/components/LeftSectionNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "lucide-react";
import { useVariant } from "@/hooks/useVariant";
import { getAvailableVariants } from "@/lib/workshop-loader";

export default function TopTabs({
  content,
  vocabulary,
  contentSections,
  workshopId,
}: {
  content: React.ReactNode;
  vocabulary: React.ReactNode;
  contentSections?: { id: string; label: string }[];
  workshopId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"contenido" | "vocabulario">(
    "contenido"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const {
    currentVariant,
    setCurrentVariant,
    availableVariants,
    setAvailableVariants,
  } = useVariant();

  // Initialize available variants when workshopId changes
  useEffect(() => {
    if (workshopId) {
      const variants = getAvailableVariants(workshopId);
      setAvailableVariants(variants);
      // Reset to variant 1 when switching workshops
      setCurrentVariant(1);
    }
  }, [workshopId, setAvailableVariants, setCurrentVariant]);

  const openMobile = useCallback(() => {
    setDrawerMounted(true);
    // Permite que el panel monte antes de iniciar la animación
    requestAnimationFrame(() => setMobileOpen(true));
  }, []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    // Espera a que la transición termine antes de desmontar
    setTimeout(() => setDrawerMounted(false), 200);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4">
        <div className="inline-flex rounded-xl border border-border bg-background overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "contenido"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
            onClick={() => setActiveTab("contenido")}
            aria-label="Ver contenido"
          >
            Contenido
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-border ${
              activeTab === "vocabulario"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
            onClick={() => setActiveTab("vocabulario")}
            aria-label="Ver vocabulario"
          >
            Vocabulario
          </button>
        </div>

        {/* Variant Selector - only show if there are multiple variants */}
        {availableVariants.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Variante:</span>
            <Select
              value={currentVariant.toString()}
              onValueChange={(value) => setCurrentVariant(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableVariants.map((variant) => (
                  <SelectItem key={variant} value={variant.toString()}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Contenido - siempre montado pero oculto cuando no está activo */}
      <div className={activeTab === "contenido" ? "block" : "hidden"}>
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Abrir menú de secciones"
            className="fixed left-4 top-4 z-50"
            onClick={openMobile}
          >
            <Menu />
          </Button>
        </div>

        {drawerMounted ? (
          <div aria-hidden={false} className="md:hidden">
            <div
              className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${
                mobileOpen ? "opacity-100 bg-black/50" : "opacity-0 bg-black/50"
              }`}
              onClick={closeMobile}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={`fixed left-0 top-0 z-50 h-full w-[80%] max-w-xs bg-background border-r shadow-xl flex flex-col transform transition-transform duration-200 ease-out ${
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <span className="text-sm font-medium">Navegación</span>
                <ThemeToggle />
              </div>
              <div
                className="p-2 overflow-y-auto"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a")) {
                    closeMobile();
                  }
                }}
              >
                {contentSections && contentSections.length > 0 ? (
                  <LeftSectionNav sections={contentSections} />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="hidden md:block">
            {contentSections && contentSections.length > 0 ? (
              <div className="sticky top-24">
                <LeftSectionNav sections={contentSections} />
              </div>
            ) : null}
          </aside>
          <div>{content}</div>
        </div>
      </div>

      {/* Vocabulario - siempre montado pero oculto cuando no está activo */}
      <div className={activeTab === "vocabulario" ? "block" : "hidden"}>
        {vocabulary}
      </div>
    </div>
  );
}
