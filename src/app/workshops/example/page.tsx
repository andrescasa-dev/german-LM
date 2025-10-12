import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExampleWorkshop() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="relative border-b overflow-hidden">
          <div className="absolute inset-0">
            <div className="h-full w-full bg-[url('/banner.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 pt-4 flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Volver al menú
              </Link>
            </Button>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="inline-block bg-background text-foreground rounded-xl px-4 py-2 shadow-sm">
                Example Workshop
              </span>
            </h1>
            <p className="mt-3">
              <span className="inline-block bg-background text-foreground rounded-full px-3 py-1 shadow-sm">
                Taller en desarrollo
              </span>
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Construction className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Estamos trabajando en ello
              </h2>
              <p className="text-muted-foreground text-lg">
                Este taller está en desarrollo. Pronto estará disponible con
                contenido interactivo y ejercicios.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">¿Qué puedes esperar?</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Ejercicios interactivos</li>
                <li>• Contenido educativo estructurado</li>
                <li>• Retroalimentación inmediata</li>
                <li>• Progreso personalizado</li>
              </ul>
            </div>

            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Volver al menú principal
              </Link>
            </Button>
          </div>
        </main>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Talleres interactivos de alemán | MCER B1</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
