"use client";

import { useState } from "react";
import { fetchComAuth } from "@/utils/api";

export default function MachineForm({ onCreate }) {
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("Disponível");

  function onClickCriar(e) {
    e.preventDefault();
    try {
      criarMaquina();
    } catch (e) {
      console.error("Erro ao criar a máquina");
    }
  }

  async function criarMaquina() {
    fetchComAuth("/api/maquinas", {
      method: "POST",
      body: JSON.stringify({
        nome,
        estado,
      }),
    })
      .then((res) => {
        if (!res.ok) return;
        onCreate({
          nome: nome,
          estado: estado,
        });
        setNome("");
        setEstado("Disponível");
        alert("Sucesso");
      });
  }

  return (
    <section className="panel employee-form-panel" aria-labelledby="employee-form-title">
      <div className="panel-heading">
        <div>
          <h2 id="employee-form-title">Nova máquina</h2>
          <p>Preencha os dados para adicionar à equipe.</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={onClickCriar}>
        <label>
          Nome da máquina
          <input
            autoComplete="name"
            maxLength={100}
            name="name"
            placeholder="Ex.: Torno CNC"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        <label>
          Estado operacional
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Disponível">Disponível</option>
            <option value="Em Operação">Em Operação</option>
            <option value="Em Manutenção">Em Manutenção</option>
            <option value="Inativa">Inativa</option>
          </select>
        </label>

        <button className="button button-primary" type="submit">
          Cadastrar máquina
        </button>
      </form>
    </section>
  );
}
