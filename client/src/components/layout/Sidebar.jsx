import {
    NavLink,
} from "react-router-dom";
import {
    Shield,
    Zap,
} from "lucide-react";

import {
    userSidebar,
} from "../../constants/sidebar";
import BrandLogo from "../common/BrandLogo";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
    const { profile } = useAuth();

    return (
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
            <div className="px-5 py-5">
                <BrandLogo
                    iconClassName="h-8 w-8"
                    textClassName="text-lg text-emerald-700"
                />
                <p className="mt-1 text-xs font-medium text-slate-600">
                    Secure Digital Estate
                </p>
            </div>

            <nav className="space-y-2 p-2">
                {userSidebar.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
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
                {profile?.role === "ADMIN" ? (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center gap-3 border-l-4 px-5 py-4 text-sm font-medium transition ${isActive
                                ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                                : "border-transparent text-slate-700 hover:bg-slate-50"
                            }`
                        }
                    >
                        <Shield size={17} />
                        Admin Console
                    </NavLink>
                ) : null}
            </nav>

            <div className="mt-auto p-5">
                <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-bold text-white shadow-sm">
                    <Zap size={15} />
                    Upgrade to Pro
                </button>
            </div>
        </aside>
    );
}
