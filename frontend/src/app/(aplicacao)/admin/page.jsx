'use client'
import "./admin.css";
import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import OverviewCards from "@/components/OverviewCards";
import ProductionSchedule from "@/components/ProductionSchedule";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import AdminPageHeading from "@/components/AdminPageHeading";
import Sidebar from "@/components/Sidebar";

export default function AdminPage() {
  const [data, setData] = useState([])
  const [listarUser, setListarUser] = useState([]);
  useEffect(() => {
    async function listarRelatorios() {
      try {
        const linkApi = await fetch("http://localhost:8080/api/relatorios");
        const data = await linkApi.json();

        setData(data.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
  
    async function listarUsuarios() {
      try {
        const linkApi = await fetch("http://localhost:8080/usuarios/listar");
        const data = await linkApi.json();

        setListarUser(data.dados || []);
        // console.log(listarUser);
        
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }
    listarRelatorios()
    listarUsuarios();
  }, []);
  return (
    <main className="admin-page">
      <Sidebar />
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / MÊS"
          title="Planejamento de Produção"
          description="Programação, equipamentos e produtividade em uma única visão."
        />

        <section className="overview-section" aria-labelledby="overview-title">
          <h2 id="overview-title">Visão geral</h2>
          <OverviewCards data={data} user={listarUser}/>
        </section>

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
