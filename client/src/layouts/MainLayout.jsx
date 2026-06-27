import { NavLink, Outlet } from "react-router-dom";

import BrandLogo from "../components/common/BrandLogo";

export default function MainLayout() {
    return (
        <div className="app-shell min-h-screen bg-[#f7f9fb] text-slate-950">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur">
                <div className="public-shell flex h-16 items-center justify-between">
                    <BrandLogo
                        iconClassName="h-9 w-9"
                        textClassName="text-xl"
                    />

                    <div className="flex items-center gap-3">
                        <NavLink
                            to="/claim"
                            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Claim
                        </NavLink>
                        <NavLink
                            to="/login"
                            className="inline-flex h-10 items-center rounded-lg bg-[#235842] px-5 text-sm font-bold text-white transition hover:bg-[#194634]"
                        >
                            Get Started
                        </NavLink>
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="border-t border-slate-200 bg-white">
                <div className="public-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <BrandLogo
                            iconClassName="h-7 w-7"
                            textClassName="text-base"
                        />
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
