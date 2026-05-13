import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

export function Button({
  children,
  type = "button",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={`ui-button ${variant === "primary" ? "ui-button-primary" : "ui-button-secondary"}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
