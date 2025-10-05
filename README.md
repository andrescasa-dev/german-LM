# Taller de Declinación del Adjetivo Alemán

Herramienta interactiva para estudiantes de alemán nivel A2.2–B1, enfocada en la consolidación de la declinación del adjetivo alemán (reglas débil, mixta y fuerte) mediante un enfoque comunicativo.

## 🎯 Características

- **4 secciones interactivas:**
  1. Repaso de los Tipos de Declinación
  2. Ejercicio Central: Acusativo Masculino
  3. Relato Contextualizado (Cloze)
  4. Recursos para Práctica Continua

- **Estado aislado por sección** con persistencia en `sessionStorage`
- **Feedback formativo inmediato** con explicaciones detalladas
- **Sistema de pistas** contextual
- **Accesibilidad completa** (WCAG 2.1 AA, soporte de teclado, ARIA)
- **Progreso visual** con medallas al completar con ≥80%

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js 20+ 
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd german-lm

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Construcción para producción

```bash
# Construir
npm run build

# Iniciar servidor de producción
npm start
```

## 🛠️ Stack tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Componentes:** shadcn/ui (Radix UI primitives)
- **Notificaciones:** Sonner
- **Linting:** ESLint

## 📁 Estructura del proyecto

```
german-lm/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Página principal
│   │   └── globals.css
│   ├── components/
│   │   ├── sections/          # Componentes de secciones
│   │   │   ├── SectionIntro.tsx
│   │   │   ├── ExerciseAkkusativMasculine.tsx
│   │   │   ├── NarrativeCloze.tsx
│   │   │   └── ResourcesList.tsx
│   │   └── ui/                # Componentes shadcn/ui
│   ├── hooks/
│   │   └── useSectionState.ts # Hook de estado por sección
│   ├── lib/
│   │   ├── adjective-rules.ts # Lógica de reglas de declinación
│   │   └── utils.ts
│   └── types/
│       └── adjective.ts       # Tipos TypeScript
├── context/                   # Documentación del proyecto
│   ├── Spec.md
│   ├── Actor_german_teacher.md
│   ├── German_activity.md
│   └── Criterios_de_Aceptacion.md
└── public/                    # Recursos estáticos
```

## 🎓 Uso pedagógico

### Sección I: Repaso
- Micro-sondeo inicial (2 preguntas)
- Tabla comparativa de reglas
- Práctica controlada (4 ejercicios)
- Criterio de logro: ≥2/3 correctas

### Sección II: Ejercicio Central
- Demostración guiada
- 3 escenarios (débil/mixta/fuerte)
- Feedback formativo por intento
- Criterio de logro: 3/3 o 2/3 con explicación vista

### Sección III: Relato
- Narrativa contextualizada por párrafos
- Verificación progresiva
- Pistas opcionales por bloque
- Criterio de logro: ≥80% aciertos

### Sección IV: Recursos
- Lista curada A2–B1
- Favoritos persistentes
- Plan de estudio personalizable
- Criterio de logro: ≥1 recurso seleccionado + plan guardado

## ♿ Accesibilidad

- Contraste WCAG 2.1 AA
- Navegación completa por teclado
- Atributos ARIA en todos los controles
- Anuncios `aria-live` para feedback
- Soporte `prefers-reduced-motion`

## 🧪 Pruebas

```bash
# Ejecutar linter
npm run lint
```

## 📚 Referencias

- `context/Spec.md` - Especificación completa del taller
- `context/Actor_german_teacher.md` - Perfil del actor pedagógico
- `context/German_activity.md` - Contenido detallado de la actividad
- `context/Criterios_de_Aceptacion.md` - Criterios de aceptación técnicos

## 📄 Licencia

Este proyecto es material educativo para el aprendizaje del alemán.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, revisa los criterios de aceptación en `context/Criterios_de_Aceptacion.md` antes de contribuir.