import {
    EyeOff,
    Plus,
    Shield,
    ShieldCheck,
    Trash2,
} from "lucide-react";

const questions = [
    {
        tag: "Primary Question",
        question: "What was the name of your first childhood pet?",
        added: "Added Oct 12, 2023",
    },
    {
        tag: "Recovery Link",
        question: "In what city did your parents meet?",
        added: "Added Jan 05, 2024",
    },
    {
        tag: "Legacy Access",
        question: "What is the model of your first car?",
        added: "Added Feb 14, 2024",
    },
];

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
                        <button className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-bold text-white">
                            <Plus size={18} />
                            Create New Question
                        </button>
                    </section>

                    <section className="rounded-2xl bg-emerald-700 p-7 text-white shadow-lg">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-100">Security Health</p>
                        <p className="mt-4 text-5xl font-extrabold">840 <span className="text-2xl font-bold">/ 1000</span></p>
                        <p className="mt-3 text-sm text-emerald-50">Vault Trust Score is Excellent.</p>
                        <div className="mt-6 h-2 rounded-full bg-emerald-900">
                            <div className="h-full w-[84%] rounded-full bg-emerald-300" />
                        </div>
                    </section>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {questions.map((item) => (
                        <article
                            key={item.question}
                            className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                        >
                            <div className="flex items-start justify-between">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                                    {item.tag}
                                </span>
                                <Trash2 size={16} className="cursor-pointer text-slate-400 hover:text-red-600" />
                            </div>
                            <p className="mt-5 font-medium leading-6 text-slate-800">{item.question}</p>
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <EyeOff size={12} />
                                    Answer Hidden
                                </span>
                                {item.added}
                            </div>
                        </article>
                    ))}

                    <button className="flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-7 transition hover:border-emerald-300">
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

                <button className="h-12 w-full rounded-xl border-2 border-emerald-700 font-bold text-emerald-800 transition hover:bg-emerald-50">
                    Run Security Audit
                </button>
            </aside>
        </div>
    );
}
