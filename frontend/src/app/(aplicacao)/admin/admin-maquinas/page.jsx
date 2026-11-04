import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import MachineFleet from "@/components/MachineFleet";
import AdminPageHeading from "@/components/AdminPageHeading";
import Sidebar from "@/components/Sidebar";

export default function AdminMachinesPage() {
  return (
    <main className="admin-page">
      <Sidebar />
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / OPERAÇÃO"
          title="Planejamento de Produção"
          description="Programação, equipamentos e produtividade em uma única visão."
        />

        <MachineFleet />

        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>
      </section>
    </main>
  );
}