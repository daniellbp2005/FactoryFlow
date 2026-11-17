import { CircleUserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="nav-topbar">
      <div className="topbar-context">
        <span className="topbar-pill">Bem-vindo</span>
        <span>Nome do Usuário</span>
      </div>
      <div className="topbar-user">
        <span>Equipe Tech System</span>
      </div>
    </header>
  );
}
