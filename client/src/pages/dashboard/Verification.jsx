import {
    EyeOff,
    Plus,
    Shield,
    ShieldCheck,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createQuestion,
    deleteQuestion,
    getQuestions,
} from "../../services/question.service";
import { formatDate } from "../../utils/format";

const bestPractices = [
    {
        title: "Avoid Public Data",
        text: "Do not use information easily found on social media, such as birthdays or pet names visible online.",
    },
    {
        title: "Make it Memorable",
        text: "Choose answers that are easy for you to remember but hard for others to guess.",
    },
    {
        title: "Consistency is Key",
        text: "Remember exact spelling and capitalization — \"Golden Retriever\" vs \"golden retriever\" matters.",
    },
];

export default function Verification() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ question: "", answer: "" });

    const { data: questions = [], isLoading } = useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    });

    const createMutation = useMutation({
        mutationFn: createQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            toast.success("Security question added");
            setShowForm(false);
            setForm({ question: "", answer: "" });
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            toast.success("Question deleted");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const securityScore = Math.min(840 + questions.length * 40, 1000);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[1fr_280px]">
            <div>
                <h1 className="text-3xl font-bold text-emerald-800">Security Questions</h1>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-bold">Verify Your Identity</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Security questions provide an extra layer of protection for your vault access and document recovery.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-bold text-white"
                        >
                            <Plus size={18} />
                            Create New Question
                        </button>
                    </section>

                    <section className="rounded-2xl bg-emerald-700 p-7 text-white shadow-lg">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-100">Security Health</p>
                        <p className="mt-4 text-5xl font-extrabold">{securityScore} <span className="text-2xl font-bold">/ 1000</span></p>
                        <p className="mt-3 text-sm text-emerald-50">
                            {questions.length >= 3 ? "Vault Trust Score is Excellent." : "Add at least 3 questions for maximum protection."}
                        </p>
                        <div className="mt-6 h-2 rounded-full bg-emerald-900">
                            <div className="h-full rounded-full bg-emerald-300" style={{ width: `${(securityScore / 1000) * 100}%` }} />
                        </div>
                    </section>
                </div>

                {showForm ? (
                    <section className="mt-8 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-bold">New Security Question</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-bold">Question</label>
                                <input
                                    value={form.question}
                                    onChange={(event) => setForm({ ...form, question: event.target.value })}
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold">Answer</label>
                                <input
                                    value={form.answer}
                                    onChange={(event) => setForm({ ...form, answer: event.target.value })}
                                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => createMutation.mutate(form)}
                                disabled={createMutation.isPending}
                                className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white"
                            >
                                Save Question
                            </button>
                            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500">Cancel</button>
                        </div>
                    </section>
                ) : null}

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {questions.map((item, index) => (
                        <article key={item._id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-start justify-between">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                                    {index === 0 ? "Primary Question" : "Backup Question"}
                                </span>
                                <button onClick={() => deleteMutation.mutate(item._id)} disabled={deleteMutation.isPending}>
                                    <Trash2 size={16} className="text-slate-400 hover:text-red-600" />
                                </button>
                            </div>
                            <p className="mt-5 font-medium leading-6 text-slate-800">{item.question}</p>
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <EyeOff size={12} />
                                    Answer Hidden
                                </span>
                                Added {formatDate(item.createdAt)}
                            </div>
                        </article>
                    ))}

                    <button
                        onClick={() => setShowForm(true)}
                        className="flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-7 transition hover:border-emerald-300"
                    >
                        <Plus size={28} className="text-emerald-700" />
                        <p className="mt-3 font-bold text-slate-700">Add Backup Question</p>
                    </button>
                </div>
            </div>

            <aside className="space-y-6">
                <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <Shield size={18} className="text-emerald-700" />
                        Security Best Practices
                    </h2>
                    <ol className="mt-6 space-y-5">
                        {bestPractices.map((item, index) => (
                            <li key={item.title} className="flex gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-bold">{item.title}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="rounded-xl bg-blue-50 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-blue-700">
                        <ShieldCheck size={16} />
                        Encryption Active
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">Answers are hashed & encrypted.</p>
                </div>
            </aside>
        </div>
    );
}
