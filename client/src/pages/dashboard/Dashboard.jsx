import {
    ChevronRight,
    FileText,
    FolderOpen,
    UserRound,
} from "lucide-react";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import Loading from "../../components/common/Loading";
import { getDocuments } from "../../services/document.service";
import { getFinalWishes } from "../../services/finalWish.service";
import { getFutureMessages } from "../../services/futureMessage.service";
import { getQuestions } from "../../services/question.service";
import { getMySuccessor } from "../../services/successor.service";
import { calculateVaultReadiness, formatDate, getInitials } from "../../utils/format";

export default function Dashboard() {
    const results = useQueries({
        queries: [
            { queryKey: ["documents"], queryFn: getDocuments },
            { queryKey: ["future-messages"], queryFn: getFutureMessages },
            { queryKey: ["successor"], queryFn: getMySuccessor },
            { queryKey: ["questions"], queryFn: getQuestions },
            { queryKey: ["final-wishes"], queryFn: getFinalWishes },
        ],
    });

    const documents = results[0]?.data || [];
    const messages = results[1]?.data || [];
    const successor = results[2]?.data;
    const questions = results[3]?.data || [];
    const finalWishes = results[4]?.data || [];

    const readiness = calculateVaultReadiness({
        successor,
        questions,
        documents,
        finalWishes,
    });

    const isLoading = results.some((result) => result.isLoading);

    if (isLoading) {
        return <Loading />;
    }

    const recentActivity = [
        documents[0]
            ? {
                id: `doc-${documents[0]._id}`,
                title: `${documents[0].documentName} updated`,
                subtitle: "Uploaded by you",
                date: documents[0].updatedAt || documents[0].createdAt,
                icon: FileText,
            }
            : null,
        successor
            ? {
                id: "successor",
                title: successor.isVerified ? "Identity verification completed" : "Primary successor profile updated",
                subtitle: `Primary successor: ${successor.fullName}`,
                date: successor.updatedAt || successor.createdAt,
                icon: UserRound,
            }
            : null,
        finalWishes[0]
            ? {
                id: `wish-${finalWishes[0]._id}`,
                title: `${finalWishes[0].title} revised`,
                subtitle: "Final wishes updated",
                date: finalWishes[0].updatedAt || finalWishes[0].createdAt,
                icon: FolderOpen,
            }
            : null,
    ].filter(Boolean);

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Overview"
                description="Manage and monitor your digital legacy assets."
                action={
                    <Link
                        to="/dashboard/documents"
                        className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white transition hover:bg-[#255743]"
                    >
                        <span className="text-base leading-none">+</span>
                        Add Document
                    </Link>
                }
            />

            <div className="mt-6 grid gap-5 xl:grid-cols-3">
                <section className="rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between">
                        <h2 className="text-[1.05rem] font-semibold text-slate-900">Vault Readiness</h2>
                        <FolderOpen size={18} className="text-slate-400" />
                    </div>

                    <div className="mt-7 flex justify-center">
                        <ProgressRing value={readiness} />
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                        <span className="text-slate-500">
                            {Math.max(0, 3 - questions.length)} Tasks Remaining
                        </span>
                        <Link to="/dashboard/verification" className="font-medium text-[#2f6b55]">
                            Review Tasks
                        </Link>
                    </div>
                </section>

                <MetricPanel
                    icon={FileText}
                    badge="Secured"
                    value={documents.length}
                    label="Critical Documents"
                    footer={[
                        `${documents.filter((item) => item.category === "FINANCIAL").length} Files`,
                        `${documents.filter((item) => item.category === "LEGAL").length || documents.filter((item) => item.category === "IDENTITY").length} Files`,
                    ]}
                    footerLabels={["Financial", "Legal"]}
                />

                <section className="rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between">
                        <span className="grid size-11 place-items-center rounded-[10px] border border-slate-200 bg-slate-50 text-[#2f6b55]">
                            <UserRound size={19} />
                        </span>
                        <span className="rounded-full border border-[#d5e8df] bg-[#f3fbf8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2f6b55]">
                            {successor?.isVerified ? "Verified" : "Pending"}
                        </span>
                    </div>

                    <p className="mt-10 text-[2.15rem] font-semibold tracking-[-0.04em] text-slate-900">
                        {successor ? 1 : 0}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Active Successors</p>

                    <div className="mt-8 flex items-center gap-2">
                        {successor ? (
                            <>
                                <div className="grid size-9 place-items-center rounded-full border border-slate-200 bg-[#f5f7f8] text-xs font-semibold text-slate-700">
                                    {getInitials(successor.fullName)}
                                </div>
                                <div className="grid size-9 place-items-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400">
                                    <span className="text-lg leading-none">+</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500">No active successor configured yet.</p>
                        )}
                    </div>
                </section>
            </div>

            <section className="mt-6 overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-[1.05rem] font-semibold text-slate-900">Recent Activity</h2>
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-[#2f6b55]">
                        View Full Log
                        <ChevronRight size={14} />
                    </button>
                </div>

                {recentActivity.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {recentActivity.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <span className="grid size-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                                            <Icon size={17} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.title}</p>
                                            <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-800">{formatDate(item.date)}</p>
                                        <p className="mt-1 text-[11px] text-slate-500">14:32 EST</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-6 py-10 text-sm text-slate-500">
                        No recent activity yet. Upload a document or add a successor to get started.
                    </div>
                )}
            </section>
        </div>
    );
}

function MetricPanel({
    badge,
    footer,
    footerLabels,
    icon: Icon,
    label,
    value,
}) {
    return (
        <section className="rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-[10px] border border-slate-200 bg-slate-50 text-[#2f6b55]">
                    <Icon size={19} />
                </span>
                <span className="rounded-full border border-[#d5e8df] bg-[#f3fbf8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2f6b55]">
                    {badge}
                </span>
            </div>

            <p className="mt-10 text-[2.15rem] font-semibold tracking-[-0.04em] text-slate-900">
                {value}
            </p>
            <p className="mt-1 text-sm text-slate-600">{label}</p>

            <div className="mt-9 grid grid-cols-2 gap-3">
                {footer.map((item, index) => (
                    <div key={footerLabels[index]} className="rounded-[8px] border border-slate-200 bg-[#fbfcfd] px-3 py-2">
                        <p className="text-[11px] text-slate-500">{footerLabels[index]}</p>
                        <p className="text-sm font-medium text-slate-800">{item}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ProgressRing({ value }) {
    return (
        <div
            className="grid size-[124px] place-items-center rounded-full"
            style={{
                background: `conic-gradient(#356f5a ${value}%, #e5eaec ${value}% 100%)`,
            }}
        >
            <div className="grid size-[94px] place-items-center rounded-full bg-white text-center">
                <div>
                    <p className="text-[2rem] font-semibold tracking-[-0.04em] text-[#2f6b55]">
                        {value}%
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Complete
                    </p>
                </div>
            </div>
        </div>
    );
}
