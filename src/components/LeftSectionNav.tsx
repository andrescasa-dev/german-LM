"use client";

import { useEffect, useMemo, useState } from "react";

type SectionItem = {
  id: string;
  label: string;
};

export default function LeftSectionNav({
  sections,
  offset = 96,
}: {
  sections: SectionItem[];
  offset?: number;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const targets = useMemo(() => sections.map((s) => `#${s.id}`), [sections]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top (positive intersection ratio preferred)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1
          );

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("id");
          if (id) setActiveId(id);
          return;
        }

        // Fallback: find the last section above the viewport
        const tops = entries
          .map((e) => ({
            id: e.target.getAttribute("id"),
            top: e.boundingClientRect.top,
          }))
          .filter((t) => typeof t.id === "string") as {
          id: string;
          top: number;
        }[];
        const above = tops.filter((t) => t.top < offset + 8);
        if (above.length > 0) {
          const closest = above.sort((a, b) => (a.top > b.top ? 1 : -1))[
            above.length - 1
          ];
          setActiveId(closest.id);
        }
      },
      {
        // Root margin to account for sticky header
        rootMargin: `-${offset}px 0px -60% 0px`,
        threshold: [0, 0.2, 0.5, 1],
      }
    );

    const elements = targets
      .map((sel) => document.querySelector(sel))
      .filter((el): el is Element => !!el);

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [targets, offset]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav aria-label="Secciones del contenido" className="text-sm">
      <ul className="space-y-1">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={handleClick(s.id)}
                className={`block rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
