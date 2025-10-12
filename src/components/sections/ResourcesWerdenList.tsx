"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showFavoriteRemoved, showFavoriteAdded } from "@/lib/toast-service";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "grammar" | "workbook" | "reading" | "test";
  level: string;
}

const WERDEN_RESOURCES: Resource[] = [
  {
    id: "werden-1",
    title: "KLIPP UND KLAR. Gramática práctica del alemán",
    description:
      "Recomendado para autoaprendizaje, ya que ofrece explicaciones en español y cubre la gramática desde el nivel A1 hasta el B1.",
    url: "https://www.amazon.es/Klipp-klar-Gram%C3%A1tica-pr%C3%A1ctica-alem%C3%A1n/dp/3126750000",
    category: "grammar",
    level: "A1-B1",
  },
  {
    id: "werden-2",
    title: "Einfach Grammatik",
    description:
      "Contiene ejercicios de gramática alemana que van desde el nivel A1 hasta el B1.",
    url: "https://www.amazon.es/Einfach-Grammatik-Deutsch-als-Fremdsprache/dp/3126750000",
    category: "workbook",
    level: "A1-B1",
  },
  {
    id: "werden-3",
    title: "DaF kompakt B1 - Deutsch als Fremdsprache für Erwachsene",
    description:
      "Si estás siguiendo un curso que lleva al B1, este manual contiene una sección de ejercicios (Übungsbuch) con práctica gramatical.",
    url: "https://www.amazon.es/DaF-kompakt-Deutsch-Fremdsprache-Erwachsene/dp/3126750000",
    category: "workbook",
    level: "B1",
  },
  {
    id: "werden-4",
    title: "Hojas de trabajo Netzverb",
    description:
      "Puedes descargar hojas de trabajo y juegos de palabras cruzadas específicos para practicar la conjugación del verbo werden en PDF.",
    url: "https://www.verbformen.de/konjugation/werden.htm",
    category: "workbook",
    level: "A2-B1",
  },
  {
    id: "werden-5",
    title: "Materiales de ejercitación del Goethe-Institut",
    description:
      "Dispone de materiales de ejercitación en línea para preparar el Goethe-Zertifikat B1, que incluyen práctica de comprensión escrita.",
    url: "https://www.goethe.de/de/spr/kup/prf/prf/gb1/ueb.html",
    category: "test",
    level: "B1",
  },
  {
    id: "werden-6",
    title: "Lingua.com - Textos A2 y B1",
    description:
      "Ofrece textos en alemán redactados por profesionales con ejercicios de comprensión lectora, disponibles para el Nivel A2 y B1.",
    url: "https://lingua.com/german/reading/",
    category: "reading",
    level: "A2-B1",
  },
  {
    id: "werden-7",
    title: "Deutsche Welle - Nicos Weg",
    description:
      "Serie interactiva con ejercicios de gramática contextualizada, incluyendo el uso de werden en diferentes contextos.",
    url: "https://learngerman.dw.com/de/nicos-weg/c-36519687",
    category: "grammar",
    level: "A2-B1",
  },
  {
    id: "werden-8",
    title: "Easy Deutsch - Das Verb werden",
    description:
      "Explicaciones detalladas sobre el verbo werden con ejemplos visuales y ejercicios interactivos.",
    url: "https://easy-deutsch.de/verben/werden/",
    category: "grammar",
    level: "A2-B1",
  },
];

const CATEGORY_LABELS = {
  grammar: "📚 Gramática",
  workbook: "📝 Cuadernos",
  reading: "📖 Lecturas",
  test: "🎯 Simulacros",
};

export function ResourcesWerdenList() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cargar favoritos desde sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("german-lm-werden-favorites");
      if (stored) {
        try {
          setFavorites(new Set(JSON.parse(stored)));
        } catch {
          // Ignorar errores de parsing
        }
      }
    }
  }, []);

  // Guardar favoritos en sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "german-lm-werden-favorites",
        JSON.stringify([...favorites])
      );
    }
  }, [favorites]);

  const toggleFavorite = (resourceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(resourceId)) {
        newFavorites.delete(resourceId);
        showFavoriteRemoved();
      } else {
        newFavorites.add(resourceId);
        showFavoriteAdded();
      }
      return newFavorites;
    });
  };

  const filteredResources = selectedCategory
    ? WERDEN_RESOURCES.filter((r) => r.category === selectedCategory)
    : WERDEN_RESOURCES;

  const criteriaComplete = favorites.size > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 IV. Recursos Adicionales</CardTitle>
        <CardDescription>
          Para continuar practicando el verbo werden y los temas gramaticales
          asociados a tu nivel (A2/B1)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Orientación */}
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-100">
            💡 ¿Cómo elegir material para werden?
          </h3>
          <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
            <li>
              <strong>Gramática:</strong> Para repasar las tres funciones de
              werden (verbo pleno, futuro, pasiva)
            </li>
            <li>
              <strong>Cuadernos:</strong> Para práctica intensiva con ejercicios
              específicos de conjugación
            </li>
            <li>
              <strong>Lecturas:</strong> Para aplicar werden en contexto real y
              natural
            </li>
            <li>
              <strong>Simulacros:</strong> Para preparar exámenes oficiales B1
              donde werden es fundamental
            </li>
          </ul>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            🪄 Todos
          </Button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              🪄 {label}
            </Button>
          ))}
        </div>

        {/* Lista de recursos */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-border rounded-lg p-4 space-y-3 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {CATEGORY_LABELS[resource.category].split(" ")[0]}
                    </span>
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {resource.description}
                  </p>
                  <span className="inline-block text-xs bg-muted px-2 py-1 rounded">
                    {resource.level}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(resource.id)}
                  aria-label={
                    favorites.has(resource.id)
                      ? "Eliminar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  {favorites.has(resource.id) ? "⭐" : "☆"}
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🪄 Visitar recurso →
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Favoritos seleccionados */}
        {favorites.size > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              ⭐ Mis favoritos ({favorites.size})
            </h4>
            <ul className="text-sm space-y-1">
              {WERDEN_RESOURCES.filter((r) => favorites.has(r.id)).map((r) => (
                <li key={r.id}>• {r.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Conceptos relacionados */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            🔗 Conceptos B1 relacionados
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
            <li>
              <strong>Voz Pasiva:</strong> El uso de werden en la voz pasiva de
              proceso (Vorgangspassiv) es una estructura central en B1
            </li>
            <li>
              <strong>Konjunktiv II:</strong> El verbo werden también se utiliza
              para construir el Konjunktiv II con la perífrasis würde +
              infinitivo
            </li>
            <li>
              <strong>Conectores:</strong> Practicar conectores como weil y dass
              te ayudará a construir oraciones subordinadas más complejas con
              werden
            </li>
          </ul>
        </div>

        {/* Criterio de logro */}
        {criteriaComplete && (
          <div
            className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="text-4xl mb-2">🏅</div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              ¡Sección completada!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Has seleccionado {favorites.size} recurso(s) para continuar
              practicando werden.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
