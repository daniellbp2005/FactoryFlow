"use client";

import { useState } from "react";

export default function DowntimeImpact() {
  const [productionRate, setProductionRate] = useState("4500");
  const [downtime, setDowntime] = useState("5");
  const [lostPieces, setLostPieces] = useState(375);

  function calculateImpact(event) {
    event.preventDefault();
    setLostPieces(Math.round((Number(productionRate) * Number(downtime)) / 60));
  }

  return (
    <section className="panel impact-panel" aria-labelledby="impact-title">
      <div className="panel-heading">
        <div>
          <h2 id="impact-title">Impacto de parada</h2>
          <p>Estime peças não produzidas.</p>
        </div>
      </div>
      <form className="impact-form" onSubmit={calculateImpact}>
        <label>
          Meta (peças por hora)
          <input
            min="0"
            onChange={(event) => setProductionRate(event.target.value)}
            type="number"
            value={productionRate}
          />
        </label>
        <label>
          Tempo de parada (minutos)
          <input
            min="0"
            onChange={(event) => setDowntime(event.target.value)}
            type="number"
            value={downtime}
          />
        </label>
        <button className="button button-primary" type="submit">Calcular impacto</button>
      </form>
      <div className="impact-result" aria-live="polite">
        <span>Peças não produzidas</span>
        <strong>{lostPieces}</strong>
        <small>{productionRate} × {downtime} ÷ 60 minutos</small>
      </div>
    </section>
  );
}
