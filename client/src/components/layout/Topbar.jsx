import {
    Bell,
    ChevronDown,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function Topbar() {
    const {
        user,
        profile,
    } = useAuth();

    return (
        <header className="flex h-[68px] shrink-0 items-center justify-end border-b border-slate-200 bg-white px-6 lg:px-7">
            <div className="ml-auto flex items-center gap-5">
                <Bell
                    size={17}
                    className="text-slate-600"
                />

                <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                    <img
                        src={user?.photoURL || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"}
                        alt={profile?.name || user?.displayName || "Vault User"}
                        className="size-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="hidden pr-1 sm:block">
                        <p className="text-sm font-semibold text-slate-800">
                            {profile?.name || user?.displayName || "Vault User"}
                        </p>
                    </div>
                    <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
                </div>
            </div>
        </header>
    );
}
