"use client";

import { useEffect, useState } from "react";
import { fetchComAuth } from "@/utils/api";

export default function AvailabilityPanel() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMaquinas() {
      try {
        const res = await fetchComAuth("/api/maquinas?limite=10");
        const data = await res.json();
        const lista = (data.dados || []).map((m) => {
          const status = m.estado || "Disponível";
          let tone = "available";
          let pct = 0;
          if (status === "Em Operação") {
            tone = "online";
            pct = 75;
          } else if (status === "Em Manutenção" || status === "Inativa") {
            tone = "broken";
            pct = 20;
          }
          const desc = m.operador_nome ? m.operador_nome : "Sem operador";
          return {
            name: m.nome,
            status,
            percentage: pct,
            description: desc,
            tone,
          };
        });
        setMachines(lista);
      } catch (err) {
        console.error("Erro ao carregar disponibilidade:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarMaquinas();
  }, []);

  return (
    <section className="panel availability-panel" aria-labelledby="availability-title">
      <div className="panel-heading">
        <div>
          <h2 id="availability-title">Disponibilidade</h2>
          <p>Estado atual da frota</p>
        </div>
      </div>
      <div className="machine-list">
        {machines.length === 0 && !loading && (
          <p style={{ padding: "12px", color: "#8a9ba8" }}>Nenhuma máquina cadastrada.</p>
        )}
        {machines.map((machine) => (
          <article className="machine-card" key={machine.name}>
            <div className="machine-heading">
              <strong>{machine.name}</strong>
              <span className={machine.tone}>{machine.status}</span>
            </div>
            <div className="machine-meter" aria-label={`${machine.percentage}% de utilização`}>
              <span className={machine.tone} style={{ width: `${machine.percentage}%` }} />
            </div>
            <p>{machine.percentage}% · {machine.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
