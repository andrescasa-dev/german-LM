"use client";

import { useState } from "react";

export default function TopTabs({
  content,
  vocabulary,
}: {
  content: React.ReactNode;
  vocabulary: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"contenido" | "vocabulario">(
    "contenido"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
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
      </div>

      {activeTab === "contenido" ? content : vocabulary}
    </div>
  );
}
