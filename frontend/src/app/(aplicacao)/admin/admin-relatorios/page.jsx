'use client';
import Footer from "@/components/Footer";
import "../admin.css";
import Header from "@/components/Header";
import OperatorReports from "@/components/OperatorReports";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { fetchComAuth } from "@/utils/api";

export default function AdminReportsPage() {
  const [usuario, setUsuario] = useState(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  async function listarRelatorios() {
    try {
      const linkApi = await fetchComAuth("/api/relatorios");
      if (!linkApi.ok) {
        const erro = await linkApi.json().catch(() => null);
        throw new Error(erro?.erro || erro?.message || `Erro HTTP ${linkApi.status}`);
      }
      const data = await linkApi.json();
      setTotalPaginas(data.paginacao?.totalPaginas || 1);
      setPagina(data.paginacao?.pagina || 1);

      setData(data.dados || []);
    } catch (e) {
      console.error("Erro ao consultar o backend:", e);
    }
  }

  function aumentarPagina() {
    if (pagina < totalPaginas) {
      setPagina((prev) => prev + 1);
    }
  }

  function diminuirPagina() {
    if (pagina > 1) {
      setPagina((prev) => prev - 1);
    }
  }

  useEffect(() => {
    let ativo = true;
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);
    listarRelatorios();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="admin-page admin-reports-page">
      <Sidebar />
      <Header usuario={usuario?.nome ?? "Usuário não logado"} />
      <section className="admin-content">
        <PageHeading
          eyebrow="FACTORYFLOW / REGISTROS"
          title="Relatórios"
          description="Acompanhe os relatórios e comentários registrados para os operadores."
        />

        <OperatorReports data={data} query={query} setQuery={setQuery} pagina={pagina} totalPaginas={totalPaginas} aumentarPagina={aumentarPagina} diminuirPagina={diminuirPagina} />

        <Footer />
      </section>
    </main>
  );
}