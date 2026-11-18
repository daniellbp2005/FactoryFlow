"use client"

import './user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import UserOverviewCards from '@/components/UserOverviewCards';
import UserSchedule from '@/components/UserSchedule';

export default function User() {
    return (
        <main className="user-page">
            <SidebarUser />
            <Header />
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
                    <UserSchedule />
                </div>
            </section>
        </main>
    )
}