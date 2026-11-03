import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import AvailabilityPanel from "@/components/AvailabilityPanel";
import ProductionSchedule from "@/components/ProductionSchedule";
import AdminPageHeading from "@/components/AdminPageHeading";

export default function AdminPlanningPage() {
  return (
    <main className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
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
      </section>
    </main>
  );
}