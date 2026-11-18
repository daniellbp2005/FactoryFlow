'use client';
import "../admin.css";
import Header from "@/components/Header";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import ProductionSchedule from "@/components/ProductionSchedule";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";


export default function AdminPlanningPage() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);
  }, []);
  return (
    <main className="admin-page">
      <Sidebar />
      <Header usuario={usuario?.nome ?? "Usuário não logado"} />
      <section className="admin-content">
        <PageHeading
          eyebrow="FACTORYFLOW / PLANEJAMENTO"
          title="Planejamento da Produção"
          description="Organize as tarefas e acompanhe a disponibilidade dos equipamentos."
        />

        <div className="dashboard-grid">
          <ProductionSchedule />
          <aside className="dashboard-aside">
            <AvailabilityPanel />
          </aside>
        </div>

        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>

      </section>
    </main>
  );
}