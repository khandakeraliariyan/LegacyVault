import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const publicNav = [
    {
        label: "Features",
        href: "/#features",
    },
    {
        label: "Security",
        href: "/#security",
    },
    {
        label: "Pricing",
        href: "/#pricing",
    },
];

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#f7f9fb] text-slate-950">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-900">
                        <LockKeyhole size={19} className="text-[#0f5139]" />
                        <span className="text-xl font-bold tracking-[-0.02em]">LegacyVault</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {publicNav.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-slate-600 transition hover:text-[#0f5139]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <NavLink
                            to="/login"
                            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 md:inline-flex"
                        >
                            Log In
                        </NavLink>
                        <NavLink
                            to="/register"
                            className="inline-flex h-10 items-center rounded-lg bg-[#235842] px-5 text-sm font-bold text-white transition hover:bg-[#194634]"
                        >
                            Get Started
                        </NavLink>
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-900">
                            <ShieldCheck size={18} className="text-[#235842]" />
                            <span className="font-bold">LegacyVault</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Secure digital inheritance for documents, wishes, and family continuity.
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-5 text-sm text-slate-500">
                        <a href="/#features" className="transition hover:text-slate-900">Features</a>
                        <a href="/#security" className="transition hover:text-slate-900">Security</a>
                        <a href="/#pricing" className="transition hover:text-slate-900">Pricing</a>
                        <NavLink to="/login" className="transition hover:text-slate-900">Log In</NavLink>
                    </nav>

                    <p className="text-sm text-slate-400">
                        © 2026 LegacyVault. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
