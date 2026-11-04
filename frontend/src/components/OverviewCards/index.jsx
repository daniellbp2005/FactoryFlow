import { Activity, CalendarDays, CircleAlert, UsersRound } from "lucide-react";

const metrics = [
  {
    label: "Tarefas programadas",
    value: "05",
    detail: "Nesta demonstração",
    icon: CalendarDays,
    tone: "teal",
  },
  {
    label: "Utilização média",
    value: "78%",
    detail: "Capacidade estimada",
    icon: Activity,
    tone: "teal",
  },
  {
    label: "Operadores ativos",
    value: "04",
    detail: "Equipe de exemplo",
    icon: UsersRound,
    tone: "teal",
  },
  {
    label: "Ocorrências",
    value: "01",
    detail: "Requer atenção",
    icon: CircleAlert,
    tone: "warning",
  },
];

export default function OverviewCards() {
  return (
    <div className="overview-cards">
      {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
        <article className="metric-card" key={label}>
          <span className="metric-icon">
            <Icon size={15} aria-hidden="true" />
          </span>
          <p className="metric-label">{label}</p>
          <strong className="metric-value">{value}</strong>
          <span className={`metric-detail ${tone}`}>{detail}</span>
        </article>
      ))}
    </div>
  );
}
