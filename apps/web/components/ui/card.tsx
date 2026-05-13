import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`ui-card ${className}`.trim()}>{children}</section>;
}

export function CardHeader({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <header className={`ui-card-header ${className}`.trim()}>{children}</header>;
}

export function CardTitle({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={`ui-card-title ${className}`.trim()}>{children}</h3>;
}

export function CardDescription({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`ui-card-description ${className}`.trim()}>{children}</p>;
}

export function CardContent({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`ui-card-content ${className}`.trim()}>{children}</div>;
}

export function CardActions({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
}) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
