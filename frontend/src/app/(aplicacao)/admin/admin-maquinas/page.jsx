import "../admin.css";
import Header from "@/components/Header";
import MachineFleet from "@/components/MachineFleet";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import TabelaRequisicao from "@/components/TabelaRequisicao";

export default function AdminMachinesPage() {
  return (
    <main className="admin-page">
      <Sidebar />
      <Header />
      <section className="admin-content">

        <PageHeading
          eyebrow="FACTORYFLOW / OPERAÇÃO"
          title="Planejamento de Produção"
          description="Programação, equipamentos e produtividade em uma única visão."
        />

          <TabelaRequisicao />

        <footer className="admin-footer">
          FactoryFlow · Desenvolvido por Tech System
        </footer>
      </section>
    </main>
  );
}