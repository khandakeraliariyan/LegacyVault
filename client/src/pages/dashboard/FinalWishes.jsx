import {
    Heart,
    PawPrint,
    Plus,
    ScrollText,
    SquarePen,
    Trash2,
    BriefcaseBusiness,
    FileText,
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

const categoryOptions = [
    { value: "PERSONAL", label: "Personal", icon: ScrollText },
    { value: "FAMILY", label: "Family", icon: Heart },
    { value: "ASSET", label: "Asset", icon: FileText },
    { value: "BUSINESS", label: "Business", icon: BriefcaseBusiness },
    { value: "OTHER", label: "Other", icon: PawPrint },
];

const emptyForm = {
    category: "PERSONAL",
    title: "",
    content: "",
};

export default function FinalWishes() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const { data: wishes = [], isLoading } = useQuery({
        queryKey: ["final-wishes"],
        queryFn: getFinalWishes,
    });

    const saveMutation = useMutation({
        mutationFn: (payload) =>
            editingId
                ? updateFinalWish(editingId, payload)
                : createFinalWish(payload),
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
            const matchesFilter =
                activeFilter === "ALL" ||
                wish.category === activeFilter;

            const matchesQuery =
                !query ||
                `${wish.title} ${wish.content} ${wish.category}`
                    .toLowerCase()
                    .includes(query);

            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, search, wishes]);

    const groupedCounts = useMemo(() => {
        return categoryOptions.reduce((accumulator, option) => {
            accumulator[option.value] = wishes.filter((wish) => wish.category === option.value).length;
            return accumulator;
        }, {});
    }, [wishes]);

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

    const handleSave = () => {
        if (!form.title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (!form.content.trim()) {
            toast.error("Directive details are required.");
            return;
        }

        saveMutation.mutate(form);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Final Wishes"
                description="Record the personal instructions, wishes, and directives your successor should understand clearly."
                action={
                    <button
                        onClick={openCreate}
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
                onSearchSubmit={() => {}}
                searchPlaceholder="Search directives..."
                action={
                    search || activeFilter !== "ALL" ? (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setActiveFilter("ALL");
                            }}
                            className="inline-flex h-10 items-center rounded-[8px] border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    ) : null
                }
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {categoryOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeFilter === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setActiveFilter(option.value)}
                            className={`rounded-[16px] border p-4 text-left transition ${
                                isActive
                                    ? "border-[#2f6b55] bg-[#f4faf7] shadow-[0_8px_20px_rgba(47,107,85,0.08)]"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                            <span className={`grid size-10 place-items-center rounded-[10px] ${
                                isActive ? "bg-[#2f6b55] text-white" : "bg-slate-50 text-[#2f6b55]"
                            }`}>
                                <Icon size={18} />
                            </span>
                            <p className="mt-4 text-sm font-semibold text-slate-900">
                                {option.label}
                            </p>
                            <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                                {groupedCounts[option.value] || 0}
                            </p>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => setActiveFilter("ALL")}
                    className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition ${
                        activeFilter === "ALL"
                            ? "bg-[#2f6b55] text-white"
                            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                    }`}
                >
                    All Directives
                </button>
            </div>

            {showForm ? (
                <section className="mt-6 rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {editingId ? "Edit Directive" : "Create New Directive"}
                    </h2>

                    <div className="mt-5 grid gap-4">
                        <select
                            value={form.category}
                            onChange={(event) => setForm({ ...form, category: event.target.value })}
                            className="h-12 rounded-[10px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        >
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            placeholder="Directive title"
                            className="h-12 rounded-[10px] border border-slate-300 px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        />
                        <textarea
                            value={form.content}
                            onChange={(event) => setForm({ ...form, content: event.target.value })}
                            rows={6}
                            placeholder="Write your directive clearly..."
                            className="rounded-[10px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#2f6b55]"
                        />
                    </div>

                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="inline-flex h-11 items-center rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Directive"}
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                            className="inline-flex h-11 items-center rounded-[8px] border border-slate-300 px-5 text-sm font-medium text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            ) : null}

            <section className="mt-6 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="grid grid-cols-[minmax(0,1.6fr)_0.8fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>Directive</span>
                    <span>Category</span>
                    <span>Updated</span>
                    <span>Actions</span>
                </div>

                {filteredWishes.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {filteredWishes.map((wish) => {
                            const option = categoryOptions.find((item) => item.value === wish.category);
                            const Icon = option?.icon || FileText;

                            return (
                                <div
                                    key={wish._id}
                                    className="grid grid-cols-[minmax(0,1.6fr)_0.8fr_0.8fr_0.8fr] gap-4 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-[10px] bg-slate-50 text-[#2f6b55] ring-1 ring-slate-200">
                                                <Icon size={18} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {wish.title}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                    {wish.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                            {option?.label || wish.category}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-slate-600">
                                        {formatDate(wish.updatedAt || wish.createdAt)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(wish)}
                                            title={`Edit ${wish.title}`}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#2f6b55]"
                                        >
                                            <SquarePen size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(wish._id)}
                                            title={`Delete ${wish.title}`}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-6 py-14 text-center">
                        <p className="text-base font-medium text-slate-700">
                            {wishes.length === 0
                                ? "No final wishes yet."
                                : "No directives match the current filter."}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            {wishes.length === 0
                                ? "Create clear instructions your successor can rely on when the time comes."
                                : "Try clearing search or switching the category filter."}
                        </p>
                        {wishes.length === 0 ? (
                            <button
                                onClick={openCreate}
                                className="mt-5 inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white"
                            >
                                <Plus size={15} />
                                Add First Directive
                            </button>
                        ) : null}
                    </div>
                )}
            </section>
        </div>
    );
}
