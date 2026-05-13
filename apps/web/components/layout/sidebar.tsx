import { navigationItems } from "../../lib/navigation";
import { Badge } from "../ui/badge";

const badgeVariantMap = {
  REAL: "real",
  "REAL-LITE": "real-lite",
  MOCK: "mock",
  COMING_SOON: "coming-soon"
} as const;

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-eyebrow">Simple HCM SaaS</p>
        <h1>Admin Console</h1>
        <p className="sidebar-description">
          중소기업 관리자용 업무 SaaS 화면을 기준으로 공통 Layout을 구성합니다.
        </p>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navigationItems.map((item, index) => (
          <a
            className={`sidebar-nav-item ${index === 0 ? "is-active" : ""}`.trim()}
            href={item.href}
            key={item.label}
          >
            <span className="sidebar-nav-label">
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </span>
            <Badge variant={badgeVariantMap[item.status]}>{item.status}</Badge>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <strong>MVP Policy</strong>
        <p>REAL, MOCK, COMING_SOON 상태를 분리해 과도한 범위 확장을 막습니다.</p>
      </div>
    </aside>
  );
}
