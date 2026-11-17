"use client";

import { useState } from "react";
import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import EmployeeFormTarefa from "@/components/EmployeeFormTarefa";
import EmployeeList from "@/components/EmployeeList";
import AdminPageHeading from "@/components/AdminPageHeading";
import Sidebar from "@/components/Sidebar";

export default function Tarefas() {
  const [employees, setEmployees] = useState([]);

  function addEmployee(employee) {
    setEmployees((currentEmployees) => [employee, ...currentEmployees]);
  }

  return (
    <main className="admin-page">
      <Sidebar />
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / Tarefa"
          title="Funcionário"
          description="Cadastre e visualize os funcionários da equipe."
        />

        <div className="employee-layout">
          <EmployeeFormTarefa onCreate={addEmployee} />
          <EmployeeList employees={employees} />
        </div>
      </section>
    </main>
  );
}