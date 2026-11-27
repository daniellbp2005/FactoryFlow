"use client";

import { useState } from "react";
import { fetchComAuth } from "@/utils/api";
import {CheckCircle2, AlertCircle } from 'lucide-react';


export default function MachineForm({ onCreate }) {
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("Disponível");
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function onClickCriar(e) {
    e.preventDefault();
    try {
      criarMaquina();
    } catch (e) {
      console.error("Erro ao criar a máquina");
    }
  }

  async function criarMaquina() {
    try {
      fetchComAuth("/api/maquinas", {
        method: "POST",
        body: JSON.stringify({
          nome,
          estado,
        }),
      })
        .then(async (res) => {
          const resultado = await res.json();

          if (!res.ok) {
            throw new Error(resultado.message || "Erro ao cadastrar máquina.");
          }

          onCreate(resultado.dados);

          setNome("");
          setEstado("Disponível");
          setSucesso(true);
          setTimeout(() => {
            setSucesso(false);
          }, 3500);
        });
    } catch (e) {
      console.error(e);
      setErro(e.message || "Não foi possível cadastrar a máquina.");
    }
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
      {sucesso && (
        <div className="form-alert form-alert-success" style={{ marginTop: "12px" }}>
          <CheckCircle2 size={16} />
          <span>Máquina cadastrada com sucesso!</span>
        </div>
      )}

      {erro && (
        <div className="form-alert form-alert-error" style={{ marginTop: "12px" }}>
          <AlertCircle size={16} />
          <span>{erro}</span>
        </div>
      )}
    </section>
  );
}
