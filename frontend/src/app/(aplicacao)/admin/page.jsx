'use client'
import "./admin.css";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AdminOverviewCards from "@/components/AdminOverviewCards";
import ProductionSchedule from "@/components/ProductionSchedule";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { fetchComAuth } from "@/utils/api";

export default function AdminPage() {
  const [data, setData] = useState([])
  const [listarUser, setListarUser] = useState([]);
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);
    async function listarRelatorios() {
      try {
        const linkApi = await fetchComAuth("/api/relatorios?limite=100");
        const data = await linkApi.json();

        setData(data.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }

    async function listarUsuarios() {
      try {
        const linkApi = await fetchComAuth("/usuarios/listar?limite=100");
        const data = await linkApi.json();

        setListarUser(data.dados || []);
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
      <Header usuario={usuario?.nome ?? "Usuário não logado"} />
      <section className="admin-content">
        <PageHeading
          eyebrow="FACTORYFLOW / MÊS"
          title="Planejamento de Produção"
          description="Programação, equipamentos e produtividade em uma única visão."
        />

        <section className="overview-section" aria-labelledby="overview-title">
          <h2 id="overview-title">Visão geral</h2>
          <AdminOverviewCards data={data} user={listarUser} />
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
