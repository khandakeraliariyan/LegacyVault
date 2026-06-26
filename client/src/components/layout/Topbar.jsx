import {
    Bell,
    Search,
    Settings,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function Topbar() {
    const {
        user,
        profile,
    } = useAuth();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
            <label className="relative hidden w-full max-w-md md:block">
                <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    className="h-10 w-full rounded-full bg-slate-100 px-11 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Search your vault..."
                />
            </label>

            <div className="ml-auto flex items-center gap-5">
                <Bell
                    size={18}
                    className="text-slate-600"
                />
                <Settings
                    size={18}
                    className="text-slate-600"
                />

                <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">
                            {profile?.name || user?.displayName || "Vault User"}
                        </p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Premium Member
                        </p>
                    </div>
                    <img
                        src={user?.photoURL || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"}
                        alt=""
                        className="size-10 rounded-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
