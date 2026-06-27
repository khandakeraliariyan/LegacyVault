import {
    ExternalLink,
    Mail,
    Mic,
    Plus,
    SquarePen,
    Trash2,
    Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import DashboardToolbar from "../../components/dashboard/DashboardToolbar";
import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createFutureMessage,
    deleteFutureMessage,
    getFutureMessages,
    updateFutureMessage,
} from "../../services/futureMessage.service";
import { formatDate } from "../../utils/format";

const filters = ["ALL", "TEXT", "AUDIO", "VIDEO"];

const emptyForm = {
    title: "",
    messageType: "TEXT",
    content: "",
    fileUrl: "",
};

const iconByType = {
    TEXT: Mail,
    AUDIO: Mic,
    VIDEO: Video,
};

export default function FutureMessages() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ["future-messages"],
        queryFn: getFutureMessages,
    });

    const saveMutation = useMutation({
        mutationFn: (payload) =>
            editingId
                ? updateFutureMessage(editingId, payload)
                : createFutureMessage(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["future-messages"] });
            toast.success(editingId ? "Message updated." : "Message saved.");
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save message.")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFutureMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["future-messages"] });
            toast.success("Message deleted.");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to delete message.")),
    });

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesType =
                activeFilter === "ALL" ||
                message.messageType === activeFilter;

            const matchesQuery =
                !query ||
                `${message.title} ${message.content || ""} ${message.messageType}`
                    .toLowerCase()
                    .includes(query);

            return matchesType && matchesQuery;
        });
    }, [activeFilter, messages, search]);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (message) => {
        setEditingId(message._id);
        setForm({
            title: message.title || "",
            messageType: message.messageType || "TEXT",
            content: message.content || "",
            fileUrl: message.fileUrl || "",
        });
        setShowForm(true);
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (form.messageType === "TEXT" && !form.content.trim()) {
            toast.error("Message content is required.");
            return;
        }

        if (form.messageType !== "TEXT" && !form.fileUrl.trim()) {
            toast.error("Media URL is required.");
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
                title="Future Messages"
                description="Store letters, recordings, and videos that your successor can review after a successful claim."
                action={
                    <button
                        onClick={openCreate}
                        className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white transition hover:bg-[#255743]"
                    >
                        <Plus size={15} />
                        Add Message
                    </button>
                }
            />

            <DashboardToolbar
                searchValue={search}
                onSearchChange={setSearch}
                onSearchSubmit={() => {}}
                searchPlaceholder="Search messages..."
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

            <div className="mt-6 flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition ${
                            activeFilter === filter
                                ? "bg-[#2f6b55] text-white"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        {formatTypeLabel(filter)}
                    </button>
                ))}
            </div>

            {showForm ? (
                <section className="mt-6 rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {editingId ? "Edit Message" : "Create New Message"}
                    </h2>

                    <div className="mt-5 grid gap-4">
                        <input
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            placeholder="Message title"
                            className="h-12 rounded-[10px] border border-slate-300 px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        />
                        <select
                            value={form.messageType}
                            onChange={(event) => setForm({ ...form, messageType: event.target.value })}
                            className="h-12 rounded-[10px] border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                        >
                            <option value="TEXT">Text</option>
                            <option value="AUDIO">Audio</option>
                            <option value="VIDEO">Video</option>
                        </select>

                        {form.messageType === "TEXT" ? (
                            <textarea
                                value={form.content}
                                onChange={(event) => setForm({ ...form, content: event.target.value })}
                                rows={6}
                                placeholder="Write your message..."
                                className="rounded-[10px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#2f6b55]"
                            />
                        ) : (
                            <input
                                value={form.fileUrl}
                                onChange={(event) => setForm({ ...form, fileUrl: event.target.value })}
                                placeholder="Media URL"
                                className="h-12 rounded-[10px] border border-slate-300 px-4 text-sm outline-none transition focus:border-[#2f6b55]"
                            />
                        )}
                    </div>

                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="inline-flex h-11 items-center rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Message"}
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
                <div className="grid grid-cols-[minmax(0,1.8fr)_0.8fr_0.9fr_0.9fr] gap-4 border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>Message</span>
                    <span>Type</span>
                    <span>Created</span>
                    <span>Actions</span>
                </div>

                {filteredMessages.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {filteredMessages.map((message) => {
                            const Icon = iconByType[message.messageType] || Mail;

                            return (
                                <div
                                    key={message._id}
                                    className="grid grid-cols-[minmax(0,1.8fr)_0.8fr_0.9fr_0.9fr] gap-4 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-[10px] bg-slate-50 text-[#2f6b55] ring-1 ring-slate-200">
                                                <Icon size={18} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {message.title}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                    {message.messageType === "TEXT"
                                                        ? message.content || "Text message"
                                                        : "Media message"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                            {formatTypeLabel(message.messageType)}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-slate-600">
                                        {formatDate(message.createdAt)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {message.fileUrl ? (
                                            <a
                                                href={message.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                title={`Open ${message.title}`}
                                                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#2f6b55]"
                                            >
                                                <ExternalLink size={15} />
                                            </a>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() => openEdit(message)}
                                            title={`Edit ${message.title}`}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#2f6b55]"
                                        >
                                            <SquarePen size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(message._id)}
                                            title={`Delete ${message.title}`}
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
                            {messages.length === 0
                                ? "No future messages yet."
                                : "No messages match the current filter."}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            {messages.length === 0
                                ? "Create a message your successor can review after a successful claim."
                                : "Try clearing search or switching the message type filter."}
                        </p>
                        {messages.length === 0 ? (
                            <button
                                onClick={openCreate}
                                className="mt-5 inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white"
                            >
                                <Plus size={15} />
                                Add First Message
                            </button>
                        ) : null}
                    </div>
                )}
            </section>
        </div>
    );
}

function formatTypeLabel(value) {
    if (value === "ALL") {
        return "All";
    }

    return value.charAt(0) + value.slice(1).toLowerCase();
}
