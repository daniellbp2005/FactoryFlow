"use client";

import { useState, useEffect } from "react";
import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeList from "@/components/EmployeeList";
import AdminPageHeading from "@/components/AdminPageHeading";
import Sidebar from "@/components/Sidebar";
import { fetchComAuth } from "@/utils/api";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [aux, setAux] = useState([]);
  let [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  useEffect(() => {
    let ativo = true;

    async function carregarOperadores() {
      try {
        const linkApiLimite = await fetchComAuth(`/usuarios/listar?pagina=${pagina}&limite=10`);
        const data = await linkApiLimite.json();
        const linkApiTodos = await fetchComAuth(`/usuarios/listar?limite=100`);
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
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / EQUIPE"
          title="Funcionários"
          description="Cadastre e visualize os funcionários da equipe."
        />

        <div className="employee-layout">
          <EmployeeForm onCreate={addEmployee} />
          <EmployeeList employees={employees} aumentarPagina={aumentarPagina} diminuirPagina={diminuirPagina} cadastroTodos={aux} />
        </div>
      </section>
    </main>
  );
}