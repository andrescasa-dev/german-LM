"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      duration={4500}
      toastOptions={{
        classNames: {
          toast: "bg-background text-foreground border border-border shadow-lg",
          title: "font-semibold",
          description: "text-foreground/90",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "text-muted-foreground hover:text-foreground",
          success: "",
          error: "",
          warning: "",
          info: "",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
