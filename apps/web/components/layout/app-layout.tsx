import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        {children}
      </div>
    </div>
  );
}
