const machines = [
  { name: "CNC-01", status: "Em uso · 3/4", percentage: 75, description: "Ana Costa", tone: "online" },
  { name: "CNC-02", status: "Em uso · 4/4", percentage: 90, description: "Bruno Lima", tone: "online" },
  { name: "MILL-01", status: "Quebrada", percentage: 12, description: "Parada · Carla Souza", tone: "broken" },
  { name: "CNC-03", status: "Disponível", percentage: 50, description: "Sem operador", tone: "available" },
];

export default function AvailabilityPanel() {
  return (
    <section className="panel availability-panel" aria-labelledby="availability-title">
      <div className="panel-heading">
        <div>
          <h2 id="availability-title">Disponibilidade</h2>
          <p>Estado atual ilustrativo</p>
        </div>
      </div>
      <div className="machine-list">
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
