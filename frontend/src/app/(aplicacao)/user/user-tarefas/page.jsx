"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';

export default function Tarefas(){
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / TAREFAS"
                    title="Planejamento de Produção"
                    description="Organize as tarefas e acompanhe a disponibilidade dos equipamentos."
                />
            </section>
        </main>
    )
}