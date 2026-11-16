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

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  useEffect(() => {
    let ativo = true;

    async function carregarOperadores() {
      try {
        const linkApi = await fetchComAuth("/usuarios/listar");
        const data = await linkApi.json();

        if (ativo) {
          setEmployees(data.dados || []);
        }
      } catch (e) {
        console.error("Erro ao consultar o backend");
      }
    }

    carregarOperadores();

    return () => {
      ativo = false;
    };
  }, []);

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
          <EmployeeList employees={employees}/>
        </div>
      </section>
    </main>
  );
}