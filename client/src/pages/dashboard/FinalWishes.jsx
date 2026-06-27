import {
    ArrowRight,
    CalendarClock,
    FileText,
    Heart,
    PawPrint,
    Plus,
    ScrollText,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import DashboardToolbar from "../../components/dashboard/DashboardToolbar";
import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createFinalWish,
    deleteFinalWish,
    getFinalWishes,
    updateFinalWish,
} from "../../services/finalWish.service";
import { formatDate } from "../../utils/format";

const wishGroups = [
    {
        key: "PERSONAL",
        title: "Ceremony Details",
        description: "Preferences for memorial services, locations, and attendee lists.",
        icon: ScrollText,
    },
    {
        key: "FAMILY",
        title: "Charitable Gifts",
        description: "Directives for donations to specific organizations or causes.",
        icon: Heart,
    },
    {
        key: "OTHER",
        title: "Pet Care",
        description: "Instructions for the care, rehoming, and financial support for pets.",
        icon: PawPrint,
    },
    {
        key: "ASSET",
        title: "Organ Donation",
        description: "Specific medical directives regarding organ or tissue donation.",
        icon: FileText,
    },
];

const emptyForm = {
    category: "PERSONAL",
    title: "",
    content: "",
};

export default function FinalWishes() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const { data: wishes = [], isLoading } = useQuery({
        queryKey: ["final-wishes"],
        queryFn: getFinalWishes,
    });

    const saveMutation = useMutation({
        mutationFn: (payload) => (editingId ? updateFinalWish(editingId, payload) : createFinalWish(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["final-wishes"] });
            toast.success(editingId ? "Wish updated." : "Wish created.");
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save wish.")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFinalWish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["final-wishes"] });
            toast.success("Wish deleted.");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to delete wish.")),
    });

    const filteredWishes = useMemo(() => {
        const query = search.trim().toLowerCase();

        return wishes.filter((wish) => {
            const matchesFilter = activeFilter === "All" || wish.category === activeFilter;
            const matchesQuery = !query || `${wish.title} ${wish.content} ${wish.category}`.toLowerCase().includes(query);
            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, search, wishes]);

    const completion = Math.min(100, Math.round((wishes.length / 7) * 100));

    const recentUpdates = [...wishes]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 2);

    const openCreate = (category = "PERSONAL") => {
        setEditingId(null);
        setForm({
            ...emptyForm,
            category,
        });
        setShowForm(true);
    };

    const openEdit = (wish) => {
        setEditingId(wish._id);
        setForm({
            category: wish.category,
            title: wish.title,
            content: wish.content,
        });
        setShowForm(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Final Wishes"
                description="Document your preferences for ceremonies, charitable donations, and personal parting messages. These instructions provide clarity during difficult times."
                action={
                    <button
                        onClick={() => openCreate()}
                        className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white transition hover:bg-[#255743]"
                    >
                        <Plus size={15} />
                        Add Wish
                    </button>
                }
            />

            <DashboardToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search wishes, categories..."
                action={
                    <button className="inline-flex h-10 items-center rounded-[8px] bg-[#2f6b55] px-4 text-xs font-semibold text-white transition hover:bg-[#255743]">
                        Search
                    </button>
                }
            />

            {showForm ? (
                <section className="mt-6 rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {editingId ? "Edit Wish" : "Create New Wish"}
                    </h2>
                    <div className="mt-5 grid gap-4">
                        <select
                            value={form.category}
                            onChange={(event) => setForm({ ...form, category: event.target.value })}
                            className="h-12 rounded-[10px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        >
                            <option value="PERSONAL">Personal</option>
                            <option value="FAMILY">Family</option>
                            <option value="ASSET">Asset</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <input
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            placeholder="Wish title"
                            className="h-12 rounded-[10px] border border-slate-300 px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        />
                        <textarea
                            value={form.content}
                            onChange={(event) => setForm({ ...form, content: event.target.value })}
                            rows={5}
                            placeholder="Write your directive..."
                            className="rounded-[10px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#2f6b55]"
                        />
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={() => saveMutation.mutate(form)}
                            disabled={saveMutation.isPending}
                            className="inline-flex h-11 items-center rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Wish"}
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                            }}
                            className="inline-flex h-11 items-center rounded-[8px] border border-slate-300 px-5 text-sm font-medium text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            ) : null}

            <div className="mt-6 grid gap-5 xl:grid-cols-[0.85fr_1.6fr]">
                <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        <span className="size-1.5 rounded-full bg-[#2f6b55]" />
                        Status
                    </p>
                    <h2 className="mt-5 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
                        {wishes.length > 0 ? "In Progress" : "Not Started"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {wishes.length} of 7 recommended categories completed.
                    </p>
                    <div className="mt-8 h-2 rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-[#356f5a]" style={{ width: `${completion}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Completeness</span>
                        <span>{completion}%</span>
                    </div>
                </section>

                <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-[1.05rem] font-semibold text-slate-900">
                            <CalendarClock size={18} />
                            Recent Updates
                        </h2>
                        <button className="text-xs font-medium text-[#2f6b55]">View All</button>
                    </div>
                    <div className="mt-4 divide-y divide-slate-200">
                        {recentUpdates.length > 0 ? recentUpdates.map((wish) => (
                            <div key={wish._id} className="flex items-start justify-between gap-4 py-4">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 grid size-8 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                                        <FileText size={14} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{wish.title}</p>
                                        <p className="mt-1 text-xs text-slate-500">{formatDate(wish.updatedAt || wish.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-sm text-slate-500">
                                No final wish updates yet.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-900">
                    Categorized Directives
                </h2>
                <div className="flex items-center gap-2 text-xs">
                    {["All", "PERSONAL", "FAMILY", "ASSET"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-3 py-1.5 transition ${activeFilter === filter
                                ? "bg-slate-200 text-slate-900"
                                : "text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {filter === "All" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {wishGroups.map((group) => {
                    const Icon = group.icon;
                    const items = filteredWishes.filter((wish) => wish.category === group.key);
                    const latestWish = items[0];

                    return (
                        <article
                            key={group.key}
                            className="flex min-h-[220px] flex-col rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        >
                            <div className="flex items-start justify-between">
                                <span className="grid size-11 place-items-center rounded-[10px] border border-slate-200 bg-[#fbfcfd] text-[#2f6b55]">
                                    <Icon size={19} />
                                </span>
                                <span className={`rounded-[6px] px-2 py-1 text-[11px] ${items.length > 0 ? "border border-slate-200 bg-slate-50 text-slate-600" : "bg-rose-50 text-rose-600"}`}>
                                    {items.length > 0 ? `${items.length} Item${items.length > 1 ? "s" : ""}` : "Empty"}
                                </span>
                            </div>
                            <h3 className="mt-5 text-[1.1rem] font-semibold text-slate-900">{group.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-500">{group.description}</p>

                            <div className="mt-auto border-t border-slate-200 pt-4">
                                {latestWish ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => openEdit(latestWish)}
                                            className="text-sm font-medium text-slate-700 transition hover:text-[#2f6b55]"
                                        >
                                            {latestWish.title}
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(latestWish._id)}
                                            className="text-slate-400 transition hover:text-rose-600"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openCreate(group.key)}
                                        className="flex w-full items-center justify-between text-sm font-medium text-slate-500 transition hover:text-[#2f6b55]"
                                    >
                                        <span>Setup Now</span>
                                        <ArrowRight size={15} />
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}

                <button
                    onClick={() => openCreate("OTHER")}
                    className="flex min-h-[220px] flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-300 bg-white p-5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#b9d4c8] hover:bg-[#fbfcfd]"
                >
                    <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500">
                        <Plus size={20} />
                    </span>
                    <p className="mt-5 text-[1.1rem] font-semibold text-slate-900">Custom Category</p>
                    <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-500">
                        Create a specific directive group.
                    </p>
                </button>
            </div>
        </div>
    );
}
