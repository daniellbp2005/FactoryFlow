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
  const [relatorios, setRelatorios] = useState([]);

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  async function carregarOperadores() {
    try {
      const linkApiLimite = await fetchComAuth(`/api/maquinas?pagina=${pagina}&limite=10`);
      const data = await linkApiLimite.json();
      setEmployees(data.dados || []);

      const linkApiTodos = await fetchComAuth(`/api/maquinas?limite=100`);
      const cadastroTodos = await linkApiTodos.json();
      setAux(cadastroTodos.dados || []);

      const relatoriosApi = await fetchComAuth("/api/relatorios?limite=100");
      const relatoriosData = await relatoriosApi.json();
      setRelatorios(relatoriosData.dados || []);console.log(relatoriosData.dados);
      

      if (data.paginacao?.totalPaginas) {
        setTotalPaginas(data.paginacao.totalPaginas);
      }
    } catch (e) {
      console.error("Erro ao consultar o backend:", e);
    }
  }

  async function removerMaquina(id) {
    const confirmar = window.confirm("Deseja realmente remover esta máquina?");
    if (!confirmar) return;

    try {
      const resposta = await fetchComAuth(`/api/maquinas/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível remover a máquina.");
      }

      setEmployees((atuais) =>
        atuais.filter((maquina) => maquina.id !== id)
      );

      setAux((atuais) =>
        atuais.filter((maquina) => maquina.id !== id)
      );
    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    let ativo = true;
    const usuarioLogado = JSON.parse(localStorage.getItem("factoryflow_usuario"));
    setUsuario(usuarioLogado);
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
            todasMaquinas={aux}
            aumentarPagina={aumentarPagina}
            diminuirPagina={diminuirPagina}
            total={aux.length}
            totalPaginas={totalPaginas}
            pagina={pagina}
            remover={removerMaquina}
            onAtualizar={carregarOperadores}
            relatorios={relatorios}
          />
        </div>
        <Footer />
      </section>
    </main>
  );
}
