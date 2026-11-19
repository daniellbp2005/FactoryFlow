'use client'
import Footer from "@/components/Footer";
import "../admin.css";
import Header from "@/components/Header";
import MachineFleet from "@/components/MachineFleet";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import TabelaRequisicao from "@/components/TabelaRequisicao";
import { useState, useEffect } from "react";

export default function AdminMachinesPage() {
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
          eyebrow="FACTORYFLOW / OPERAÇÃO"
          title="Gestão de Máquinas e Ocupação"
          description="Acompanhe equipamentos, operadores vinculados e requisições em uma única visão."
        />

        <MachineFleet />

        <TabelaRequisicao />

        <Footer />
      </section>
    </main>
  );
}