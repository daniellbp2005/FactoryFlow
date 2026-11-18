"use client"

import './user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import UserOverviewCards from '@/components/UserOverviewCards';
import UserSchedule from '@/components/UserSchedule';
import { useState, useEffect } from "react";
import Footer from '@/components/Footer';

export default function User() {
  const [usuario,setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);
  }, []);
    return (
        <main className="user-page">
            <SidebarUser />
            <Header usuario={usuario?.nome ?? "Usuário não logado"} />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / PAINEL DO USUÁRIO"
                    title="Planejamento de Produção"
                    description="Programação, equipamentos e produtividade em uma única visão."
                />
                <section className="overview-section" aria-labelledby="overview-title">
                  <h2 id="overview-title">Visão geral</h2>
                  <UserOverviewCards/>
                </section>
                <div className="dashboard-grid">
                    <UserSchedule uid={usuario?.id} />
                </div>
                <Footer />
            </section>
        </main>
    )
}