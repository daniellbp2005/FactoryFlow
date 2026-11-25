"use client";

import './user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import UserOverviewCards from '@/components/UserOverviewCards';
import UserSchedule from '@/components/UserSchedule';
import { useState, useEffect } from "react";
import Footer from '@/components/Footer';
import { fetchComAuth } from "@/utils/api";

export default function User() {
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState([]);
  const [listarUser, setListarUser] = useState([]);
  const [visao, setVisao] = useState("Apenas meu");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);

    async function listarRelatorios() {
      try {
        const linkApi = await fetchComAuth("/api/relatorios?limite=100");
        const json = await linkApi.json();
        setData(json.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend (relatórios):", e);
      }
    }

    async function listarUsuarios() {
      try {
        const linkApi = await fetchComAuth("/usuarios/listar?limite=100");
        const json = await linkApi.json();
        setListarUser(json.dados || []);
      } catch (e) {
        console.error("Erro ao consultar o backend (usuários):", e);
      }
    }

    listarRelatorios();
    listarUsuarios();
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <h2 id="overview-title" style={{ margin: 0 }}>Visão geral</h2>
            <div className="period-switch" style={{ display: "flex", flexDirection: "row" }} aria-label="Filtro de visão">
              <button
                type="button"
                onClick={() => setVisao("Apenas meu")}
                className={visao === "Apenas meu" ? "selected" : ""}
              >
                Apenas meu
              </button>
              <button
                type="button"
                onClick={() => setVisao("Todos")}
                className={visao === "Todos" ? "selected" : ""}
              >
                Todos
              </button>
            </div>
          </div>

          <UserOverviewCards
            data={data}
            user={listarUser}
            usuarioLogadoId={usuario?.id}
            visao={visao}
          />
        </section>

        <div className="dashboard-grid">
          <UserSchedule
            uid={usuario?.id}
            visao={visao}
            onMudarVisao={setVisao}
          />
        </div>

        <Footer />
      </section>
    </main>
  );
}
