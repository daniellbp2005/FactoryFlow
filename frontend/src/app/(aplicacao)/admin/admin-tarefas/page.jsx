"use client";

import { useState, useEffect } from "react";
import "../admin.css";
import Header from "@/components/Header";
import EmployeeFormTarefa from "@/components/EmployeeFormTarefa";
import EmployeeListTarefa from "@/components/EmployeeListTarefa";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { fetchComAuth } from "@/utils/api";

export default function Tarefas() {
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
        const linkApiLimite = await fetchComAuth(`/api/tarefas?pagina=${pagina}&limite=10`);
        const data = await linkApiLimite.json();
        const linkApiTodos = await fetchComAuth(`/api/tarefas?limite=100`);
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
          eyebrow="FACTORYFLOW / Tarefa"
          title="Funcionário"
          description="Cadastre e visualize os funcionários da equipe."
        />

        <div className="employee-layout">
          <EmployeeFormTarefa onSuccess={addEmployee} />
          <EmployeeListTarefa employees={employees} aumentarPagina={aumentarPagina} diminuirPagina={diminuirPagina} cadastroTodos={aux} />
        </div>
      </section>
    </main>
  );
}