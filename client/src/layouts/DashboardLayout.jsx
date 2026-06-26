import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <main className="flex flex-1 flex-col overflow-hidden">
                <Topbar />

                <section className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}   