import "./admin.css";
import AdminHeader from "@/components/AdminHeader";
import OverviewCards from "@/components/OverviewCards";
import ProductionSchedule from "@/components/ProductionSchedule";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import AdminPageHeading from "@/components/AdminPageHeading";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / MÊS"
          title="Planejamento de Produção"
          description="Programação, equipamentos e produtividade em uma única visão."
          actions={
            <>
            <button type="button" className="button button-outline">
              Ver calendário
            </button>
            <button type="button" className="button button-primary">
              Calcular produção
            </button>
            </>
          }
        />

        <section className="overview-section" aria-labelledby="overview-title">
          <h2 id="overview-title">Visão geral</h2>
          <OverviewCards />
        </section>

        <div className="dashboard-grid">
          <ProductionSchedule />
          <aside className="dashboard-aside">
            <AvailabilityPanel />
          </aside>
        </div>

        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>
      </section>
    </main>
  );
}
