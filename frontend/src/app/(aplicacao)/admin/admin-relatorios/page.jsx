'use client';
import Footer from "@/components/Footer";
import "../admin.css";
import Header from "@/components/Header";
import OperatorReports from "@/components/OperatorReports";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { useState,useEffect } from "react";

export default function AdminReportsPage() {
  const [usuario,setUsuario] = useState(null);

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
          eyebrow="FACTORYFLOW / REGISTROS"
          title="Relatórios"
          description="Acompanhe os relatórios e comentários registrados para os operadores."
        />

        <OperatorReports />

        <Footer />
      </section>
    </main>
  );
}