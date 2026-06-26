import {
    FileText,
    KeyRound,
    Mail,
    Upload,
    UserPlus,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Loading from "../../components/common/Loading";
import useAuth from "../../hooks/useAuth";
import { getDocuments } from "../../services/document.service";
import { getFinalWishes } from "../../services/finalWish.service";
import { getFutureMessages } from "../../services/futureMessage.service";
import { getQuestions } from "../../services/question.service";
import { getMySuccessor } from "../../services/successor.service";
import { calculateVaultReadiness, formatDate, getInitials } from "../../utils/format";

export default function Dashboard() {
    const { profile } = useAuth();
    const firstName = profile?.name?.split(" ")[0] || "there";

    const results = useQueries({
        queries: [
            { queryKey: ["documents"], queryFn: getDocuments },
            { queryKey: ["future-messages"], queryFn: getFutureMessages },
            { queryKey: ["successor"], queryFn: getMySuccessor },
            { queryKey: ["questions"], queryFn: getQuestions },
            { queryKey: ["final-wishes"], queryFn: getFinalWishes },
        ],
    });

    const isLoading = results.some((result) => result.isLoading);

    if (isLoading) {
        return <Loading />;
    }

    const documents = results[0].data || [];
    const messages = results[1].data || [];
    const successor = results[2].data;
    const questions = results[3].data || [];
    const finalWishes = results[4].data || [];

    const readiness = calculateVaultReadiness({
        successor,
        questions,
        documents,
        finalWishes,
    });

    const recentDocument = documents[0];

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Good Morning, {firstName}</h1>
                    <p className="mt-2 max-w-md text-base leading-6 text-slate-600">
                        Your digital legacy is currently {readiness}% secured and ready.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Link to="/dashboard/documents" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-medium text-slate-800">
                        <Upload size={16} />
                        Upload Document
                    </Link>
                    <Link to="/dashboard/final-wishes" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-medium text-slate-800">
                        <Mail size={16} />
                        Create Final Wish
                    </Link>
                    <Link to="/dashboard/documents" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 text-base font-bold text-white sm:col-span-2 sm:mx-auto sm:w-56">
                        + Quick Add
                    </Link>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1fr_1fr]">
                <section className="row-span-2 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-extrabold uppercase tracking-wide">Vault Readiness</p>
                    </div>
                    <div
                        className="mx-auto mt-8 grid size-44 place-items-center rounded-full"
                        style={{ background: `conic-gradient(#006f51 0 ${readiness}%, #e8eef8 ${readiness}% 100%)` }}
                    >
                        <div className="grid size-32 place-items-center rounded-full bg-white text-center">
                            <div>
                                <p className="text-4xl font-extrabold text-emerald-700">{readiness}%</p>
                                <p className="font-bold">Secured</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-center text-sm leading-6 text-slate-600">
                        Complete your <Link to="/dashboard/verification" className="font-bold text-emerald-700">Security Questions</Link> to reach 100% readiness.
                    </p>
                </section>

                <MetricCard icon={FileText} title="Documents Count" value={String(documents.length)} detail={`${documents.length} stored`} />
                <MetricCard icon={Mail} title="Future Messages" value={String(messages.length)} detail="Scheduled" />

                <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between text-sm font-bold">
                        <span>Storage Capacity</span>
                        <span>{documents.length} files / 5 GB plan</span>
                    </div>
                    <div className="h-2 rounded-full bg-blue-100">
                        <div className="h-full rounded-full bg-emerald-700" style={{ width: `${Math.min(documents.length * 8, 100)}%` }} />
                    </div>
                    <div className="mt-3 flex justify-between text-xs font-bold">
                        <span>{Math.min(documents.length * 8, 100)}% utilized</span>
                        <Link to="/dashboard/documents" className="text-emerald-700">Manage Storage</Link>
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between p-8">
                        <h2 className="text-xl font-bold">Successor Status</h2>
                        <Link to="/dashboard/successors" className="text-sm font-medium text-emerald-700">Manage All</Link>
                    </div>
                    {successor ? (
                        <div className="grid grid-cols-[44px_1fr_auto] items-center gap-4 px-8 py-4">
                            <span className="grid size-11 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
                                {getInitials(successor.fullName)}
                            </span>
                            <div>
                                <p className="font-bold">{successor.fullName}</p>
                                <p className="text-sm text-slate-600">Primary Successor - {successor.relationship}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${successor.vaultAccessGranted ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                {successor.vaultAccessGranted ? "Verified" : "Pending"}
                            </span>
                        </div>
                    ) : (
                        <p className="px-8 pb-8 text-sm text-slate-600">No successor appointed yet.</p>
                    )}
                    <Link to="/dashboard/successors" className="flex h-16 items-center justify-center gap-2 bg-blue-50 text-sm font-bold text-emerald-700">
                        <UserPlus size={16} />
                        Add Successor
                    </Link>
                </section>

                <div className="space-y-6">
                    <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <span className="grid size-10 place-items-center rounded-lg bg-red-50 text-red-600"><KeyRound size={18} /></span>
                            <h2 className="text-sm font-extrabold uppercase tracking-wide">Verification Steps</h2>
                        </div>
                        <div className="mt-6 space-y-5 text-sm">
                            <p>
                                <span className={`mr-3 inline-block size-3 rounded-full ${successor ? "bg-emerald-700" : "border border-slate-400"}`} />
                                Successor appointed
                            </p>
                            <p>
                                <span className={`mr-3 inline-block size-3 rounded-full ${questions.length >= 3 ? "bg-emerald-700" : "border border-slate-400"}`} />
                                Security questions ({questions.length}/3)
                                <br />
                                <Link to="/dashboard/verification" className="ml-7 text-xs text-emerald-700">Configure now</Link>
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-sm font-extrabold uppercase tracking-wide">Recent Activity</h2>
                        <div className="mt-6 space-y-5 border-l border-slate-200 pl-5 text-sm">
                            {recentDocument ? (
                                <p>
                                    <span className="-ml-[27px] mr-4 inline-block size-3 rounded-full bg-emerald-700" />
                                    {formatDate(recentDocument.createdAt)}
                                    <br />
                                    <b>Document &quot;{recentDocument.documentName}&quot; encrypted and uploaded.</b>
                                </p>
                            ) : (
                                <p className="text-slate-500">Upload your first document to see activity here.</p>
                            )}
                            {messages[0] ? (
                                <p>
                                    <span className="-ml-[27px] mr-4 inline-block size-3 rounded-full bg-blue-100" />
                                    Future message &quot;{messages[0].title}&quot; scheduled.
                                </p>
                            ) : null}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ detail, icon: Icon, title, value }) {
    return (
        <section className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon size={18} />
                </span>
                <p className="text-sm font-extrabold uppercase tracking-wide">{title}</p>
            </div>
            <p className="mt-6 text-4xl font-extrabold">{value} <span className="text-sm font-bold text-emerald-700">{detail}</span></p>
        </section>
    );
}
