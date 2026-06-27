import {
    ArrowRight,
    CheckCircle2,
    FileText,
    HeartHandshake,
    Lock,
    MessageSquareHeart,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import BrandLogo from "../../components/common/BrandLogo";
import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import { getReleasedVault } from "../../services/successor.service";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const tabs = ["Documents", "Final Wishes", "Future Messages"];

export default function VaultAccess() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("Documents");
    const [showToast, setShowToast] = useState(true);
    const claimId = searchParams.get("claimId") || "";

    const vaultQuery = useQuery({
        queryKey: ["released-vault", claimId],
        queryFn: () => getReleasedVault(claimId),
        enabled: Boolean(claimId),
    });

    const vault = vaultQuery.data;

    const summaryCards = useMemo(() => {
        if (!vault) {
            return [];
        }

        return [
            {
                label: "Released Documents",
                value: vault.documents?.length || 0,
                icon: FileText,
            },
            {
                label: "Final Wishes",
                value: vault.finalWishes?.length || 0,
                icon: HeartHandshake,
            },
            {
                label: "Future Messages",
                value: vault.futureMessages?.length || 0,
                icon: MessageSquareHeart,
            },
        ];
    }, [vault]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_38%,#f9fbfd_100%)] text-slate-950">
            <header className="border-b border-white/60 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <BrandLogo
                        iconClassName="h-8 w-8"
                        textClassName="text-lg text-[#2f6b55]"
                    />
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                        <Lock size={14} />
                        Successor View Only
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                {!claimId ? (
                    <EmptyClaimState />
                ) : vaultQuery.isLoading ? (
                    <Loading />
                ) : vaultQuery.isError ? (
                    <ErrorClaimState message={getApiErrorMessage(vaultQuery.error, "Unable to load vault access")} />
                ) : (
                    <>
                        <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#0f1d2f_0%,#17324b_42%,#295741_100%)] px-8 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(109,212,156,0.18),transparent_26%)]" />
                            <div className="relative grid gap-8 xl:grid-cols-[1.3fr_0.75fr]">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/90">
                                        Inheritance / Released Estate
                                    </p>
                                    <div className="mt-5 flex flex-wrap items-center gap-3">
                                        <h1 className="text-[2.7rem] font-semibold tracking-[-0.05em] text-white">
                                            Digital Estate of {vault?.owner?.name || "Vault Owner"}
                                        </h1>
                                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-50">
                                            Read Only
                                        </span>
                                    </div>
                                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
                                        Your claim was verified successfully. This estate view is intentionally read-only so you can safely review released documents, wishes, and future messages without modifying the original vault.
                                    </p>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                        {summaryCards.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <article
                                                    key={item.label}
                                                    className="rounded-[20px] border border-white/12 bg-white/8 px-5 py-4 backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                                                            {item.label}
                                                        </p>
                                                        <Icon size={17} className="text-emerald-200" />
                                                    </div>
                                                    <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                                                        {item.value}
                                                    </p>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </div>

                                <aside className="rounded-[24px] border border-white/14 bg-white/10 p-6 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-12 place-items-center rounded-full bg-emerald-100/16 text-emerald-100">
                                            <ShieldCheck size={22} />
                                        </span>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                                                Verified Successor
                                            </p>
                                            <p className="mt-1 text-sm text-slate-200">
                                                Claim approved on {formatDate(vault?.claim?.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4 rounded-[20px] border border-white/12 bg-slate-950/18 p-5">
                                        <StatusLine label="Access Mode" value="View only" />
                                        <StatusLine label="Successor" value={vault?.successor?.fullName || "Verified claimant"} />
                                        <StatusLine label="Source" value="Claim-based release" />
                                    </div>

                                    <div className="mt-6 rounded-[20px] bg-white/10 px-5 py-4 text-sm leading-7 text-slate-200">
                                        Every future access requires a fresh claim. This protects the estate even after one successful release.
                                    </div>
                                </aside>
                            </div>
                        </section>

                        <section className="mt-8 rounded-[26px] border border-white/70 bg-white/70 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                            <nav className="flex flex-wrap gap-3">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold transition ${
                                            activeTab === tab
                                                ? "bg-[#2f6b55] text-white shadow-[0_10px_25px_rgba(47,107,85,0.25)]"
                                                : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </section>

                        {activeTab === "Documents" ? (
                            <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {(vault?.documents || []).map((doc) => (
                                    <article
                                        key={doc._id}
                                        className="group flex min-h-[260px] flex-col rounded-[26px] border border-white/70 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="grid size-16 place-items-center rounded-[18px] bg-[linear-gradient(180deg,#eef4ff,#e3ecff)] text-[#4564ff]">
                                                <FileText size={26} />
                                            </span>
                                            <span className="rounded-full bg-[#2f6b55] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                                                Released
                                            </span>
                                        </div>

                                        <h2 className="mt-8 text-[1.8rem] font-semibold tracking-[-0.04em] text-slate-950">
                                            {doc.documentName}
                                        </h2>
                                        <p className="mt-3 text-sm leading-7 text-slate-500">
                                            {formatCategoryLabel(doc.category)} document
                                        </p>

                                        <div className="mt-auto pt-8">
                                            <div className="mb-5 h-px bg-slate-100" />
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Added {formatDate(doc.createdAt)}
                                                </span>
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b55] transition group-hover:gap-3"
                                                >
                                                    View Document
                                                    <ArrowRight size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        {activeTab === "Final Wishes" ? (
                            <section className="mt-8 grid gap-6 md:grid-cols-2">
                                {(vault?.finalWishes || []).map((wish) => (
                                    <article
                                        key={wish._id}
                                        className="rounded-[26px] border border-white/70 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f6b55]">
                                                {formatCategoryLabel(wish.category)}
                                            </span>
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                View only
                                            </span>
                                        </div>
                                        <h2 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-950">
                                            {wish.title}
                                        </h2>
                                        <p className="mt-4 text-sm leading-8 text-slate-600">
                                            {wish.content}
                                        </p>
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        {activeTab === "Future Messages" ? (
                            <section className="mt-8 grid gap-6 md:grid-cols-2">
                                {(vault?.futureMessages || []).map((message) => (
                                    <article
                                        key={message._id}
                                        className="rounded-[26px] border border-white/70 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="grid size-12 place-items-center rounded-[14px] bg-[linear-gradient(180deg,#ecfff3,#dff8eb)] text-[#2f6b55]">
                                                <Sparkles size={18} />
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                                {message.messageType}
                                            </span>
                                        </div>

                                        <h2 className="mt-6 text-[1.8rem] font-semibold tracking-[-0.04em] text-slate-950">
                                            {message.title}
                                        </h2>
                                        {message.content ? (
                                            <p className="mt-4 text-sm leading-8 text-slate-600">
                                                {message.content}
                                            </p>
                                        ) : null}

                                        {message.fileUrl ? (
                                            <a
                                                href={message.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b55]"
                                            >
                                                Open Media
                                                <ArrowRight size={14} />
                                            </a>
                                        ) : null}
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        <section className="mt-10 overflow-hidden rounded-[28px] border border-[#d9e7ff] bg-[linear-gradient(135deg,#eff5ff_0%,#eef8ff_38%,#f4f9ff_100%)] shadow-[0_18px_45px_rgba(59,130,246,0.08)]">
                            <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.7fr] lg:items-center">
                                <div className="flex gap-4">
                                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-[#4564ff] shadow-sm">
                                        <LifeBuoy size={28} />
                                    </span>
                                    <div>
                                        <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
                                            Need Access Again Later?
                                        </h2>
                                        <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600">
                                            This estate release is temporary, claim-based, and view only. If you need to re-open the vault in the future, start a new verification request from the claims portal.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-start lg:justify-end">
                                    <Link
                                        to="/claim"
                                        className="inline-flex h-14 items-center rounded-[14px] bg-[#2f6b55] px-7 text-base font-semibold text-white shadow-[0_12px_30px_rgba(47,107,85,0.22)] transition hover:bg-[#255743]"
                                    >
                                        Start New Claim
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {showToast && vault ? (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-sm text-white shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
                    <Lock size={16} className="text-emerald-300" />
                    Read-only vault access granted
                    <button
                        type="button"
                        onClick={() => setShowToast(false)}
                        className="ml-2 text-slate-400 transition hover:text-white"
                    >
                        x
                    </button>
                </div>
            ) : null}
        </div>
    );
}

function StatusLine({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                {label}
            </span>
            <span className="text-sm font-medium text-white">
                {value}
            </span>
        </div>
    );
}

function EmptyClaimState() {
    return (
        <div className="rounded-[28px] border border-white/70 bg-white p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <h1 className="text-[2.4rem] font-semibold tracking-[-0.04em] text-slate-950">
                Successor Vault Access
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-600">
                Released estate access is only available immediately after a successful claim. Submit a new claim whenever you need to re-open the vault.
            </p>
            <Link
                to="/claim"
                className="mt-8 inline-flex h-12 items-center rounded-[14px] bg-[#2f6b55] px-6 text-sm font-semibold text-white"
            >
                Open Claims Portal
            </Link>
        </div>
    );
}

function ErrorClaimState({ message }) {
    return (
        <div className="rounded-[28px] border border-white/70 bg-white p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-medium text-rose-600">{message}</p>
            <Link
                to="/claim"
                className="mt-8 inline-flex h-12 items-center rounded-[14px] bg-[#2f6b55] px-6 text-sm font-semibold text-white"
            >
                Start New Claim
            </Link>
        </div>
    );
}
