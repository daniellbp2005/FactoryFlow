"use client"
import '../user.css';
import Header from "@/components/Header";
import SidebarUser from "@/components/Sidebar-user";
import PageHeading from '@/components/PageHeading';

export default function Planejamento(){
    return(
        <main className='user-page'>
            <SidebarUser />
            <Header />
        </main>
    )
}