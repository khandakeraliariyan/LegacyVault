import { Outlet } from "react-router-dom";

import DashboardFooter from "../components/layout/DashboardFooter";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-950">
            <Sidebar />

            <main className="flex min-w-0 flex-1 flex-col">
                <Topbar />

                <section className="flex-1 px-6 py-8 lg:px-8">
                    <Outlet />
                </section>

                <DashboardFooter />
            </main>
        </div>
    );
}   
