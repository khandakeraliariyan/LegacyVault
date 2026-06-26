import {
    Briefcase,
    Edit3,
    Heart,
    Lock,
    Plus,
    Shield,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";

const wishes = [
    {
        title: "Memorial Service Music",
        category: "Personal",
        tagClass: "bg-emerald-50 text-emerald-700",
        icon: Lock,
        body: "I would like 'A Case of You' by Joni Mitchell played during the ceremony. It holds significant meaning for our family gatherings over the last three decades.",
        updated: "Updated Oct 12, 2023",
    },
    {
        title: "The Summer Cottage Key",
        category: "Family",
        tagClass: "bg-blue-50 text-blue-700",
        icon: Users,
        body: "The physical spare key is hidden in the false rock near the North-East corner of the foundation. Sarah should manage the rental schedule for siblings.",
        updated: "Updated Sep 05, 2023",
    },
    {
        title: "Agency Succession Plan",
        category: "Business",
        tagClass: "bg-blue-50 text-blue-700",
        icon: Briefcase,
        body: "Review the partnership agreement dated Jan 2022. Mark is the primary contact for client handovers. All cloud credentials are in the 'Assets' vault.",
        updated: "Updated Nov 30, 2023",
    },
    {
        title: "Charitable Endowments",
        category: "Assets",
        tagClass: "bg-emerald-50 text-emerald-700",
        icon: Heart,
        body: "Distribute 15% of the remaining liquid assets to the 'Green Future Initiative' and 5% to the local library arts fund.",
        updated: "Updated Dec 14, 2023",
    },
];

const filters = ["All Wishes", "Personal", "Family", "Business"];

export default function FinalWishes() {
    const [activeFilter, setActiveFilter] = useState("All Wishes");

    const filtered = wishes.filter(
        (wish) => activeFilter === "All Wishes" || wish.category === activeFilter
    );

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Final Wishes</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Document your legacy, personal preferences, and final instructions. These will be securely shared with your chosen successors when the time is right.
                    </p>
                </div>
                <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                    <Plus size={18} />
                    Quick Add
                </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-6 py-2 text-sm font-bold transition ${
                            activeFilter === filter
                                ? "bg-emerald-700 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((wish) => {
                    const Icon = wish.icon;

                    return (
                        <article
                            key={wish.title}
                            className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                        >
                            <div className="flex items-start justify-between">
                                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${wish.tagClass}`}>
                                    {wish.category}
                                </span>
                                <div className="flex gap-3 text-slate-500">
                                    <Edit3 size={15} className="cursor-pointer hover:text-emerald-700" />
                                    <Trash2 size={15} className="cursor-pointer hover:text-red-600" />
                                </div>
                            </div>
                            <h2 className="mt-5 text-lg font-bold">{wish.title}</h2>
                            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{wish.body}</p>
                            <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                                <Icon size={12} className="text-emerald-700" />
                                {wish.updated}
                            </div>
                        </article>
                    );
                })}

                <button className="flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-7 text-center transition hover:border-emerald-300 hover:bg-emerald-50/30">
                    <span className="grid size-14 place-items-center rounded-full bg-blue-50 text-emerald-700">
                        <Plus size={28} />
                    </span>
                    <p className="mt-4 font-bold text-slate-800">Create New Wish</p>
                    <p className="mt-2 text-sm text-slate-500">Add a personal instruction or legacy note.</p>
                </button>

                <article className="relative overflow-hidden rounded-2xl bg-emerald-700 p-7 text-white shadow-lg">
                    <Shield className="absolute -right-4 -top-4 size-32 text-emerald-600/40" />
                    <h2 className="text-xl font-bold">Peace of Mind</h2>
                    <p className="mt-4 text-sm leading-6 text-emerald-50">
                        Your wishes are protected with military-grade 256-bit AES encryption.
                    </p>
                    <button className="mt-8 rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-800">
                        Learn About Security
                    </button>
                </article>
            </div>

            <button className="fixed bottom-8 right-8 grid size-14 place-items-center rounded-full bg-emerald-700 text-white shadow-lg lg:hidden">
                <Plus size={24} />
            </button>
        </div>
    );
}
