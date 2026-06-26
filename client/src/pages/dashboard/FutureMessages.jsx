import {
    Calendar,
    Edit3,
    Mail,
    Mic,
    Plus,
    Trash2,
    Video,
} from "lucide-react";
import { useState } from "react";

const messages = [
    {
        title: "Birthday Letter for Sarah",
        type: "Text",
        icon: Mail,
        recipient: "Sarah Jenkins",
        releaseDate: "Mar 15, 2035",
        status: "Scheduled",
    },
    {
        title: "Graduation Day Message",
        type: "Video",
        icon: Video,
        recipient: "Marcus Thorne",
        releaseDate: "Jun 01, 2030",
        status: "Scheduled",
    },
    {
        title: "Anniversary Recording",
        type: "Audio",
        icon: Mic,
        recipient: "Elena Rodriguez",
        releaseDate: "Oct 24, 2028",
        status: "Scheduled",
    },
];

const filters = ["All Messages", "Text", "Audio", "Video"];

export default function FutureMessages() {
    const [activeFilter, setActiveFilter] = useState("All Messages");

    const filtered = messages.filter(
        (msg) => activeFilter === "All Messages" || msg.type === activeFilter.replace(/s$/, "")
    );

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Future Messages</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Write letters or record videos that will be delivered on specific anniversaries or life milestones after your vault is released.
                    </p>
                </div>
                <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
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
                            activeFilter === filter
                                ? "bg-emerald-700 text-white"
                                : "bg-blue-50 text-slate-700 hover:bg-blue-100"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((msg) => {
                    const Icon = msg.icon;

                    return (
                        <article
                            key={msg.title}
                            className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                        >
                            <div className="flex items-start justify-between">
                                <span className="grid size-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Icon size={22} />
                                </span>
                                <div className="flex gap-3 text-slate-500">
                                    <Edit3 size={15} className="cursor-pointer hover:text-emerald-700" />
                                    <Trash2 size={15} className="cursor-pointer hover:text-red-600" />
                                </div>
                            </div>
                            <h2 className="mt-5 text-lg font-bold">{msg.title}</h2>
                            <p className="mt-2 text-sm text-slate-600">To: {msg.recipient}</p>
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar size={12} />
                                    {msg.releaseDate}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase text-emerald-700">
                                    {msg.status}
                                </span>
                            </div>
                        </article>
                    );
                })}

                <button className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30 p-7 transition hover:border-emerald-300">
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
