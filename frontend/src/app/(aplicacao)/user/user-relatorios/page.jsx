"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';
import UserReports from '@/components/OperatorReports';

export default function Relatorios(){
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / REGISTROS"
                    title="Relatórios"
                    description="Acompanhe os relatórios e comentários registrados para os operadores."
                />

                <UserReports/>
            </section>
        </main>
    )
}