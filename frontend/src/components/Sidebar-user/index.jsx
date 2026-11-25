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
import { limparSessao } from "@/utils/api";

const links = [
  { label: "Painel" , icon: LayoutDashboard, href: "/user" },
  { label: "Tarefas", icon: ClipboardCheck, href: "/user/user-tarefas" },
  { label: "Máquinas", icon: Factory, href: "/user/user-maquinas" },
  { label: "Relatórios", icon: ChartNoAxesColumnIncreasing, href: "/user/user-relatorios" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
    <aside className="mobile-sidebar">
      <Link className="mobile-brand" href="/" aria-label="FactoryFlow início">
        <Image
          alt=""
          className="brand-logo"
          height={70}
          priority
          src="/images/logotype/logotype.png"
          width={70}
        />
        <span className="brand-copy">
          <strong>Factory Flow</strong>
        </span>
      </Link>

      <footer className="sidebar-footer">
        <Link className="sidebar-logout" href="/" onClick={limparSessao} aria-label="Sair e voltar ao início">
          <LogOut size={20} aria-hidden="true" />
          <span>Sair</span>
        </Link>
      </footer>
    </aside>

    <aside className="app-sidebar">
      <div className="desktop-sidebar">
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
            <strong>Factory Flow</strong>
          </span>
        </Link>
      </div>

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
      
      <div className="desktop-footer">
        <footer className="sidebar-footer">
          <Link className="sidebar-logout" href="/" onClick={limparSessao} aria-label="Sair e voltar ao início">
            <LogOut size={20} aria-hidden="true" />
            <span>Sair</span>
          </Link>
        </footer>
      </div>
    </aside>
    </>
  );
}
