import type { ReactNode } from "react";

export function PageContainer({
  actions,
  children,
  description,
  eyebrow,
  title
}: {
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <main className="page-container">
      <section className="page-intro">
        <div className="page-copy">
          <p className="page-eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </section>
      {children}
    </main>
  );
}
