import { Badge } from "../ui/badge";

export function Header() {
  return (
    <header className="app-header">
      <div className="header-title">
        <h2>Simple HCM SaaS Workspace</h2>
        <p>Sidebar, Header, Card, Table 중심의 Modern Enterprise HCM Admin Console</p>
      </div>
      <div className="header-meta">
        <span className="header-chip">AWS EC2 + Docker Compose</span>
        <Badge variant="real-lite">Dashboard</Badge>
      </div>
    </header>
  );
}
