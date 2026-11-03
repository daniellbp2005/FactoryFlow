import { CircleUserRound } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="admin-topbar">
      <div className="topbar-context">
        <span className="topbar-pill">Produção</span>
        <span>Visão operacional</span>
      </div>
      <div className="topbar-user">
        <span>Equipe Tech System</span>
        <CircleUserRound size={18} aria-hidden="true" />
      </div>
    </header>
  );
}
