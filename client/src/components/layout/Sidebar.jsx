import { NavLink } from "react-router-dom";
import { userSidebar } from "../../constants/sidebar";

export default function Sidebar() {
    return (
        <aside className="w-72 border-r bg-white">
            <div className="border-b p-6">
                <h1 className="text-2xl font-bold text-emerald-600">
                    LegacyVault
                </h1>
            </div>

            <nav className="space-y-2 p-4">
                {userSidebar.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl p-3 transition ${isActive
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={20} />

                            {item.title}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}