"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';

export default function Maquinas(){
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header />
            <section className="user-content">
                <PageHeading
                    eyebrow="FACTORYFLOW / OPERAÇÃO"
                    title="Máquinas"
                    description="Acompanhe a disponibilidade e o estado dos equipamentos."
                />
            </section>
        </main>
    )
}