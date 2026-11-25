"use client";
import { useState, useEffect } from "react";
import "../admin.css";
import Header from "@/components/Header";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeList from "@/components/EmployeeList";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { fetchComAuth } from "@/utils/api";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [aux, setAux] = useState([]);
  let [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [usuario, setUsuario] = useState(null);

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  async function carregarOperadores() {
    try {
      const linkApiLimite = await fetchComAuth(`/usuarios/listar?pagina=${pagina}&limite=10`);
      const data = await linkApiLimite.json();
      const linkApiTodos = await fetchComAuth(`/usuarios/listar?limite=100`);
      const cadastroTodos = await linkApiTodos.json();
      setAux(cadastroTodos.dados || []);
      setEmployees(data.dados || []);
      if (data.paginacao?.totalPaginas) {
        setTotalPaginas(data.paginacao.totalPaginas);
      }
    } catch (e) {
      console.error("Erro ao consultar o backend");
    }
  }

  async function removerUser(id) {
    const confirmar = window.confirm("Deseja realmente remover este funcionário?");
    if (!confirmar) return;

    try {
      const resposta = await fetchComAuth(`/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível remover o funcionário.");
      }

      setEmployees((atuais) =>
        atuais.filter((usuario) => usuario.id !== id)
      );

      setAux((atuais) =>
        atuais.filter((usuario) => usuario.id !== id)
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
          eyebrow="FACTORYFLOW / EQUIPE"
          title="Funcionários"
          description="Cadastre e visualize os funcionários da equipe."
        />

        <div className="employee-layout">
          <EmployeeForm onCreate={addEmployee} />
          <EmployeeList employees={employees} remover={removerUser} aumentarPagina={aumentarPagina} diminuirPagina={diminuirPagina} cadastroTodos={aux} totalPaginas={totalPaginas} pagina={pagina} />
        </div>
      </section>
    </main>
  );
}