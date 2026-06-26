import {
    NavLink,
    Outlet,
} from "react-router-dom";
import {
    Bell,
    Search,
    Settings,
    Zap,
} from "lucide-react";

import DashboardFooter from "../components/layout/DashboardFooter";
import { adminSidebar } from "../constants/adminSidebar";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-950">
            <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                <div className="px-5 py-5">
                    <h1 className="text-lg font-bold text-emerald-700">LegacyVault</h1>
                    <p className="mt-1 text-xs font-medium text-slate-600">Admin Console</p>
                </div>

                <nav className="space-y-2 p-2">
                    {adminSidebar.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/admin"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 border-l-4 px-5 py-4 text-sm font-medium transition ${isActive
                                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                                        : "border-transparent text-slate-700 hover:bg-slate-50"
                                    }`
                                }
                            >
                                <Icon size={17} />
                                {item.title}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-auto p-5">
                    <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-bold text-white shadow-sm">
                        <Zap size={15} />
                        Upgrade to Pro
                    </button>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
                    <label className="relative hidden w-full max-w-md md:block">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="h-10 w-full rounded-full bg-slate-100 px-11 text-sm outline-none placeholder:text-slate-400"
                            placeholder="Search claims, successors..."
                        />
                    </label>
                    <div className="ml-auto flex items-center gap-5">
                        <Bell size={18} className="text-slate-600" />
                        <Settings size={18} className="text-slate-600" />
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">Admin Console</p>
                                <p className="text-[10px] font-bold uppercase text-slate-400">Super User</p>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                                alt=""
                                className="size-10 rounded-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <section className="flex-1 px-6 py-8 lg:px-8">
                    <Outlet />
                </section>

                <DashboardFooter />
            </main>
        </div>
    );
}
