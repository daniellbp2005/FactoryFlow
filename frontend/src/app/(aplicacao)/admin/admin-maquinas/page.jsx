"use client";

import { useState, useEffect } from "react";
import "../admin.css";
import Header from "@/components/Header";
import MachineForm from "@/components/MachineForm";
import MachineList from "@/components/MachineList";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { fetchComAuth } from "@/utils/api";

export default function AdminMachinesPage() {
  const [employees, setEmployees] = useState([]);
  const [aux, setAux] = useState([]);
  let [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [usuario, setUsuario] = useState(null);

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  useEffect(() => {
    let ativo = true;
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);

    async function carregarOperadores() {
      try {
        const linkApiLimite = await fetchComAuth(`/api/maquinas?pagina=${pagina}&limite=10`);
        const data = await linkApiLimite.json();
        const linkApiTodos = await fetchComAuth(`/api/maquinas?limite=100`);
        const cadastroTodos = await linkApiTodos.json();
        setAux(cadastroTodos.dados || []);

        if (ativo) {
          setEmployees(data.dados || []);
        }
        if (data.paginacao?.totalPaginas) {
          setTotalPaginas(data.paginacao.totalPaginas);
        }
      } catch (e) {
        console.error("Erro ao consultar o backend");
        console.log(e);

      }
    }

    carregarOperadores();

    return () => {
      ativo = false;
    };
  }, [pagina]);

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

  return (
    <main className="admin-page">
      <Sidebar />
      <Header usuario={usuario?.nome ?? "Usuário não logado"} />
      <section className="admin-content">
        <PageHeading
          eyebrow="FACTORYFLOW / OPERAÇÃO"
          title="Máquinas"
          description="Cadastre e visualize os equipamentos da equipe."
        />

        <div className="employee-layout">
          <MachineForm onCreate={addEmployee} />
          <MachineList
            machines={employees}
            aumentarPagina={aumentarPagina}
            diminuirPagina={diminuirPagina}
            total={aux.length}
            totalPaginas={totalPaginas}
            pagina={pagina}
          />
        </div>
        <Footer />
      </section>
    </main>
  );
}
