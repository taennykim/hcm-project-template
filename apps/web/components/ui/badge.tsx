import type { ReactNode } from "react";

type BadgeVariant = "real" | "real-lite" | "mock" | "coming-soon";

const variantClassName: Record<BadgeVariant, string> = {
  real: "ui-badge ui-badge-real",
  "real-lite": "ui-badge ui-badge-real-lite",
  mock: "ui-badge ui-badge-mock",
  "coming-soon": "ui-badge ui-badge-coming-soon"
};

export function Badge({
  children,
  variant
}: {
  children: ReactNode;
  variant: BadgeVariant;
}) {
  return <span className={variantClassName[variant]}>{children}</span>;
}
