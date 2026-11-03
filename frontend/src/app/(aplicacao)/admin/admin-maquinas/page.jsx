import "../admin.css";
import AdminHeader from "@/components/AdminHeader";
import MachineFleet from "@/components/MachineFleet";
import AdminPageHeading from "@/components/AdminPageHeading";

export default function AdminMachinesPage() {
  return (
    <main className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <AdminPageHeading
          eyebrow="FACTORYFLOW / OPERAÇÃO"
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

        <MachineFleet />

        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>
      </section>
    </main>
  );
}