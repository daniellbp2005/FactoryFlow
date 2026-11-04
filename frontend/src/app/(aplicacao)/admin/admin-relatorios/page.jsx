import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import OperatorReports from "@/components/OperatorReports";
import AdminPageHeading from "@/components/AdminPageHeading";

export default function AdminReportsPage() {
  return (
    <main className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / REGISTROS"
          title="Relatórios"
          description="Acompanhe os relatórios e comentários registrados para os operadores."
        />

        <OperatorReports />
        
        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>

      </section>
    </main>




  );
}