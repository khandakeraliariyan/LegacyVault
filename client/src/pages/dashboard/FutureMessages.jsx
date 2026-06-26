import {
    Calendar,
    Mail,
    Mic,
    Plus,
    Trash2,
    Video,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createFutureMessage,
    deleteFutureMessage,
    getFutureMessages,
} from "../../services/futureMessage.service";
import { formatDate } from "../../utils/format";

const filters = ["All Messages", "Text", "Audio", "Video"];

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
    const [activeFilter, setActiveFilter] = useState("All Messages");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ["future-messages"],
        queryFn: getFutureMessages,
    });

    const createMutation = useMutation({
        mutationFn: createFutureMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["future-messages"] });
            toast.success("Message scheduled");
            setShowForm(false);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFutureMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["future-messages"] });
            toast.success("Message deleted");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const filtered = messages.filter(
        (msg) => activeFilter === "All Messages" || msg.messageType === activeFilter.toUpperCase().replace(/S$/, "")
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Future Messages</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Write letters or record videos that will be delivered on specific anniversaries or life milestones after your vault is released.
                    </p>
                </div>
                <button onClick={() => setShowForm(true)} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                    <Plus size={18} />
                    Schedule Message
                </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-6 py-2 text-sm font-bold transition ${
                            activeFilter === filter ? "bg-emerald-700 text-white" : "bg-blue-50 text-slate-700 hover:bg-blue-100"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {showForm ? (
                <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-lg font-bold">Schedule Future Message</h2>
                    <div className="mt-4 grid gap-4">
                        <input
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            placeholder="Message title"
                            className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                        />
                        <select
                            value={form.messageType}
                            onChange={(event) => setForm({ ...form, messageType: event.target.value })}
                            className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                        >
                            <option value="TEXT">Text</option>
                            <option value="AUDIO">Audio</option>
                            <option value="VIDEO">Video</option>
                        </select>
                        {form.messageType === "TEXT" ? (
                            <textarea
                                value={form.content}
                                onChange={(event) => setForm({ ...form, content: event.target.value })}
                                placeholder="Write your message..."
                                rows={5}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                        ) : (
                            <input
                                value={form.fileUrl}
                                onChange={(event) => setForm({ ...form, fileUrl: event.target.value })}
                                placeholder="Media file URL"
                                className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                            />
                        )}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white">
                            Save Message
                        </button>
                        <button onClick={() => setShowForm(false)} className="text-sm text-slate-500">Cancel</button>
                    </div>
                </section>
            ) : null}

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((msg) => {
                    const Icon = iconByType[msg.messageType] || Mail;

                    return (
                        <article key={msg._id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-start justify-between">
                                <span className="grid size-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Icon size={22} />
                                </span>
                                <button onClick={() => deleteMutation.mutate(msg._id)}><Trash2 size={15} /></button>
                            </div>
                            <h2 className="mt-5 text-lg font-bold">{msg.title}</h2>
                            <p className="mt-2 text-sm text-slate-600">{msg.messageType} message</p>
                            {msg.content ? <p className="mt-3 text-sm leading-6 text-slate-600">{msg.content}</p> : null}
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar size={12} />
                                    Created {formatDate(msg.createdAt)}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase text-emerald-700">
                                    {msg.isReleased ? "Released" : "Scheduled"}
                                </span>
                            </div>
                        </article>
                    );
                })}

                <button onClick={() => setShowForm(true)} className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30 p-7 transition hover:border-emerald-300">
                    <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Plus size={28} />
                    </span>
                    <p className="mt-4 font-bold">New Future Message</p>
                    <p className="mt-2 text-center text-sm text-slate-500">Schedule a letter, audio, or video for a future date.</p>
                </button>
            </div>
        </div>
    );
}
