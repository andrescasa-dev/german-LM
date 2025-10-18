import ThemeToggle from "@/components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const workshops = [
    {
      id: "adjetivo",
      title: "🧙‍♀️ Taller de Declinación del Adjetivo Alemán",
      description: "Nivel A2.2–B1 | Enfoque comunicativo",
      href: "/workshops/adjetivo",
      status: "available",
    },
    {
      id: "werden",
      title: "⚡ Taller del Verbo WERDEN",
      description: "Nivel A2 | Verbo pleno, Futuro y Pasiva",
      href: "/workshops/werden",
      status: "not-available",
    },
    {
      id: "preposiciones-temporales",
      title: "⏰ Taller de Preposiciones Temporales",
      description: "Nivel A2 | Preposiciones de tiempo en alemán",
      href: "/workshops/preposiciones-temporales",
      status: "available",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="relative border-b overflow-hidden">
          <div className="absolute inset-0">
            <div className="h-full w-full bg-[url('/banner.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 pt-4 flex justify-end">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="inline-block bg-background text-foreground rounded-xl px-4 py-2 shadow-sm">
                Talleres de Alemán
              </span>
            </h1>
            <p className="mt-3">
              <span className="inline-block bg-background text-foreground rounded-full px-3 py-1 shadow-sm">
                Selecciona un taller para comenzar
              </span>
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {workshops.map((workshop) => (
              <Link key={workshop.id} href={workshop.href}>
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {workshop.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {workshop.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          workshop.status === "available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {workshop.status === "available"
                          ? "Disponible"
                          : "Próximamente"}
                      </span>
                      <span className="text-2xl">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Talleres interactivos de alemán | MCER B1</p>
          </div>
        </footer>
      </div>
    </>
  );
}
