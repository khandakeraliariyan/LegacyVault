import {
    Edit3,
    Lock,
    Plus,
    Shield,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createFinalWish,
    deleteFinalWish,
    getFinalWishes,
    updateFinalWish,
} from "../../services/finalWish.service";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const filters = ["All Wishes", "Personal", "Family", "Business", "Asset", "Other"];

const categoryMap = {
    Personal: "PERSONAL",
    Family: "FAMILY",
    Business: "BUSINESS",
    Asset: "ASSET",
    Other: "OTHER",
};

const tagClasses = {
    PERSONAL: "bg-emerald-50 text-emerald-700",
    FAMILY: "bg-blue-50 text-blue-700",
    BUSINESS: "bg-blue-50 text-blue-700",
    ASSET: "bg-emerald-50 text-emerald-700",
    OTHER: "bg-slate-100 text-slate-700",
};

const emptyForm = {
    category: "PERSONAL",
    title: "",
    content: "",
};

export default function FinalWishes() {
    const queryClient = useQueryClient();
    const [activeFilter, setActiveFilter] = useState("All Wishes");
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
            toast.success(editingId ? "Wish updated" : "Wish created");
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFinalWish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["final-wishes"] });
            toast.success("Wish deleted");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const filtered = wishes.filter(
        (wish) => activeFilter === "All Wishes" || wish.category === categoryMap[activeFilter]
    );

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
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
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Final Wishes</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Document your legacy, personal preferences, and final instructions. These will be securely shared with your chosen successors when the time is right.
                    </p>
                </div>
                <button onClick={openCreate} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
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
                            activeFilter === filter ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {showForm ? (
                <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-bold">{editingId ? "Edit Wish" : "Create New Wish"}</h2>
                    <div className="mt-4 grid gap-4">
                        <select
                            value={form.category}
                            onChange={(event) => setForm({ ...form, category: event.target.value })}
                            className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                        >
                            {Object.entries(categoryMap).map(([label, value]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <input
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            placeholder="Title"
                            className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                        />
                        <textarea
                            value={form.content}
                            onChange={(event) => setForm({ ...form, content: event.target.value })}
                            placeholder="Write your wish..."
                            rows={5}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white">
                            Save Wish
                        </button>
                        <button onClick={() => setShowForm(false)} className="text-sm text-slate-500">Cancel</button>
                    </div>
                </section>
            ) : null}

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((wish) => (
                    <article key={wish._id} className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between">
                            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${tagClasses[wish.category] || tagClasses.OTHER}`}>
                                {formatCategoryLabel(wish.category)}
                            </span>
                            <div className="flex gap-3 text-slate-500">
                                <button onClick={() => openEdit(wish)}><Edit3 size={15} /></button>
                                <button onClick={() => deleteMutation.mutate(wish._id)}><Trash2 size={15} /></button>
                            </div>
                        </div>
                        <h2 className="mt-5 text-lg font-bold">{wish.title}</h2>
                        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{wish.content}</p>
                        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                            <Lock size={12} className="text-emerald-700" />
                            Updated {formatDate(wish.updatedAt)}
                        </div>
                    </article>
                ))}

                <button onClick={openCreate} className="flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-7 text-center transition hover:border-emerald-300 hover:bg-emerald-50/30">
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
                </article>
            </div>
        </div>
    );
}
