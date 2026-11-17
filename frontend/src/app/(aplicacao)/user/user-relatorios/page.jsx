"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';

export default function Relatorios(){
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / MÊS"
                    title="Planejamento de Produção"
                    description="Programação, equipamentos e produtividade em uma única visão."
                />
            </section>
        </main>
    )
}