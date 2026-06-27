import {
    EyeOff,
    Plus,
    ShieldCheck,
    Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import { getApiErrorMessage } from "../../services/api";
import {
    createQuestion,
    deleteQuestion,
    getQuestions,
} from "../../services/question.service";
import { formatDate } from "../../utils/format";

const REQUIRED_QUESTIONS = 3;

const bestPractices = [
    {
        title: "Avoid public information",
        text: "Do not use answers that can be guessed from social media, birthdays, or public family details.",
    },
    {
        title: "Keep answers memorable",
        text: "Use answers you can recall exactly without needing to write them down elsewhere.",
    },
    {
        title: "Match spelling exactly",
        text: "Claims are validated against your saved answer, so spaces, spelling, and capitalization should stay consistent.",
    },
];

export default function Verification() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ question: "", answer: "" });
    const formRef = useRef(null);

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

    const questionCount = questions.length;
    const remainingCount = Math.max(0, REQUIRED_QUESTIONS - questionCount);
    const isReady = questionCount >= REQUIRED_QUESTIONS;
    const progressPercent = Math.min(
        100,
        Math.round((questionCount / REQUIRED_QUESTIONS) * 100)
    );

    const handleCreateQuestion = () => {
        const payload = {
            question: form.question.trim(),
            answer: form.answer.trim(),
        };

        if (!payload.question || !payload.answer) {
            toast.error("Both question and answer are required");
            return;
        }

        createMutation.mutate(payload);
    };

    const openForm = () => {
        setShowForm(true);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <DashboardPageHeader
                title="Security Questions"
                description="Set up private verification questions your primary successor must answer correctly before access can be granted."
                action={
                    !showForm ? (
                        <button
                            onClick={openForm}
                            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#2f6b55] px-4 text-sm font-semibold text-white"
                        >
                            <Plus size={15} />
                            Add Question
                        </button>
                    ) : null
                }
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                <section className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Verification readiness
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-900">
                                {isReady
                                    ? "Claim protection is fully configured"
                                    : `${remainingCount} more question${remainingCount === 1 ? "" : "s"} recommended`}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                The claim flow uses your saved answers as part of the direct successor verification process. Add at least {REQUIRED_QUESTIONS} strong questions for reliable protection.
                            </p>
                        </div>

                        <div className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold ${isReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {isReady ? "Ready for claim verification" : "Setup still in progress"}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Active
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {questionCount}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Security questions saved
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Recommended
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {REQUIRED_QUESTIONS}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Baseline for full coverage
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Status
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {progressPercent}%
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Verification coverage
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#2f6b55] transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </section>

                <aside className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Security notes
                            </p>
                            <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-900">
                                Keep answers private
                            </h2>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {bestPractices.map((item, index) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700 ring-1 ring-slate-200">
                                        {index + 1}
                                    </span>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {item.title}
                                    </p>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                        Answers are stored securely and never shown back inside the dashboard.
                    </div>
                </aside>
            </div>

            {showForm ? (
                <section
                    ref={formRef}
                    className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200"
                >
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Add question
                        </p>
                        <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">
                            Create a private verification checkpoint
                        </h2>
                        <p className="text-sm leading-7 text-slate-500">
                            Pick a question only your intended successor should be able to answer accurately.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Question
                            </label>
                            <input
                                value={form.question}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        question: event.target.value,
                                    })
                                }
                                placeholder="e.g. What was the name of our first family home?"
                                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Answer
                            </label>
                            <input
                                value={form.answer}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        answer: event.target.value,
                                    })
                                }
                                placeholder="Enter the exact answer"
                                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={handleCreateQuestion}
                            disabled={createMutation.isPending}
                            className="inline-flex h-12 items-center rounded-[10px] bg-[#2f6b55] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {createMutation.isPending
                                ? "Saving..."
                                : "Save Question"}
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setForm({ question: "", answer: "" });
                            }}
                            className="inline-flex h-12 items-center rounded-[10px] border border-slate-200 px-6 text-sm font-semibold text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            ) : null}

            <section className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Saved questions
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-900">
                            Your active verification set
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500">
                        Hidden answers, removable any time.
                    </p>
                </div>

                {questions.length ? (
                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        {questions.map((item, index) => (
                            <article
                                key={item._id}
                                className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-6"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${index === 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                                            {index === 0
                                                ? "Primary question"
                                                : `Backup question ${index}`}
                                        </span>
                                        <p className="mt-4 text-lg font-semibold leading-7 text-slate-900">
                                            {item.question}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteMutation.mutate(item._id)
                                        }
                                        disabled={deleteMutation.isPending}
                                        className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-red-600"
                                        title="Delete question"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-2">
                                        <EyeOff size={14} />
                                        Answer hidden
                                    </span>
                                    <span>Added {formatDate(item.createdAt)}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-emerald-700 ring-1 ring-slate-200">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-slate-900">
                            No security questions added yet
                        </h3>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                            Add a few private questions so your successor can complete claim verification without involving manual review.
                        </p>
                        <button
                            onClick={openForm}
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#2f6b55] px-4 text-sm font-semibold text-white"
                        >
                            <Plus size={15} />
                            Add First Question
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
