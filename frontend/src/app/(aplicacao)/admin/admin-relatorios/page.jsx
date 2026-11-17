import "../admin.css";
import Header from "@/components/Header";
import OperatorReports from "@/components/OperatorReports";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";

export default function AdminReportsPage() {
  return (
    <main className="admin-page">
      <Sidebar />
      <Header />
      <section className="admin-content">
        <PageHeading
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