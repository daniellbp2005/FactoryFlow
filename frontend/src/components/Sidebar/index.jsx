"use client";

import {
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Factory,
  LayoutDashboard,
  LogOut,
  ClipboardCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { label: "Painel" , icon: LayoutDashboard, href: "/admin" },
  { label: "Planejamento", icon: ClipboardList, href: "/admin/admin-planejamento" },
  { label: "Tarefas", icon: ClipboardCheck  , href: "/admin/admin-tarefas" },
  { label: "Operadores", icon: UsersRound, href: "/admin/admin-operadores" },
  { label: "Máquinas", icon: Factory, href: "/admin/admin-maquinas" },
  { label: "Relatórios", icon: ChartNoAxesColumnIncreasing, href: "/admin/admin-relatorios" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <Link className="sidebar-brand" href="/" aria-label="FactoryFlow início">
        <Image
          alt=""
          className="brand-logo"
          height={70}
          priority
          src="/images/logotype/logotype.png"
          width={70}
        />
        <span className="brand-copy">
          <strong>FactoryFlow</strong>
        </span>
      </Link>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        {links.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`sidebar-link${active ? " active" : ""}`}
              href={href}
              key={label}
            >
              <Icon size={25} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="sidebar-footer">
        <Link className="sidebar-logout" href="/" aria-label="Sair e voltar ao início">
          <LogOut size={20} aria-hidden="true" />
          <span>Sair</span>
        </Link>
      </footer>
    </aside>
  );
}
