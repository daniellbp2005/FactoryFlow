import "../admin.css";
import Header from "@/components/Header";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import ProductionSchedule from "@/components/ProductionSchedule";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";


export default function AdminPlanningPage() {
  return (
    <main className="admin-page">
      <Sidebar />
      <Header />
      <section className="admin-content">
        <PageHeading
          eyebrow="FACTORYFLOW / PLANEJAMENTO"
          title="Planejamento da Produção"
          description="Organize as tarefas e acompanhe a disponibilidade dos equipamentos."
        />

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