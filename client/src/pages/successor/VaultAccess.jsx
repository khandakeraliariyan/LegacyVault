import {
    ArrowRight,
    Bell,
    CheckCircle2,
    FileText,
    LifeBuoy,
    Lock,
    Search,
    Settings,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import BrandLogo from "../../components/common/BrandLogo";
import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import { getReleasedVault, getSuccessorAccess } from "../../services/successor.service";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const tabs = ["Documents", "Final Wishes", "Future Messages"];

export default function VaultAccess() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [emailInput, setEmailInput] = useState(searchParams.get("email") || "");
    const [activeTab, setActiveTab] = useState("Documents");
    const [showToast, setShowToast] = useState(true);
    const email = searchParams.get("email") || "";

    const accessQuery = useQuery({
        queryKey: ["successor-access", email],
        queryFn: () => getSuccessorAccess(email),
        enabled: Boolean(email),
    });

    const vaultQuery = useQuery({
        queryKey: ["released-vault", email],
        queryFn: () => getReleasedVault(email),
        enabled: Boolean(email) && accessQuery.data?.vaultAccessGranted,
    });

    const handleSearch = (event) => {
        event.preventDefault();

        if (!emailInput) {
            toast.error("Enter your successor email");
            return;
        }

        setSearchParams({ email: emailInput });
    };

    const vault = vaultQuery.data;
    const access = accessQuery.data;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
                <BrandLogo
                    iconClassName="h-8 w-8"
                    textClassName="text-lg text-emerald-700"
                />
                <form onSubmit={handleSearch} className="relative hidden w-full max-w-md md:block">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={emailInput}
                        onChange={(event) => setEmailInput(event.target.value)}
                        className="h-10 w-full rounded-full bg-slate-100 px-11 text-sm outline-none"
                        placeholder="Enter successor email..."
                    />
                </form>
                <div className="flex items-center gap-5">
                    <Bell size={18} className="text-slate-600" />
                    <Settings size={18} className="text-slate-600" />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                {!email ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                        <h1 className="text-2xl font-bold">Successor Vault Access</h1>
                        <p className="mt-3 text-slate-600">Enter the email address registered as a successor to view released vault assets.</p>
                        <form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-md gap-3">
                            <input
                                value={emailInput}
                                onChange={(event) => setEmailInput(event.target.value)}
                                className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm"
                                placeholder="successor@email.com"
                            />
                            <button className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white">Access Vault</button>
                        </form>
                    </div>
                ) : accessQuery.isLoading ? (
                    <Loading />
                ) : accessQuery.isError ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                        <p className="text-red-600">{getApiErrorMessage(accessQuery.error, "Unable to verify access")}</p>
                    </div>
                ) : !access?.vaultAccessGranted ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                        <h1 className="text-2xl font-bold">Access Pending</h1>
                        <p className="mt-3 text-slate-600">
                            Your claim is still under review. Submit a claim at the portal and wait for admin approval.
                        </p>
                        <Link to="/claim" className="mt-6 inline-flex h-12 items-center rounded-xl bg-emerald-700 px-6 font-bold text-white">
                            Open Claims Portal
                        </Link>
                    </div>
                ) : vaultQuery.isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Inheritance &gt; Vault Access</p>
                        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">Digital Estate of {vault?.owner?.name || "Vault Owner"}</h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    Access has been granted following successful successor verification. All assets below have been decrypted and released for your viewing.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-100">
                                <CheckCircle2 className="text-emerald-700" size={24} />
                                <div>
                                    <p className="text-sm font-extrabold text-emerald-800">VERIFIED SUCCESSOR</p>
                                    <p className="text-xs text-slate-600">Verified on {formatDate(access.accessGrantedAt)}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-10 flex justify-center gap-8 border-b border-slate-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`border-b-2 pb-4 text-sm font-bold transition ${activeTab === tab ? "border-emerald-700 text-emerald-700" : "border-transparent text-slate-500"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {activeTab === "Documents" ? (
                            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {(vault?.documents || []).map((doc) => (
                                    <article key={doc._id} className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex items-start justify-between">
                                            <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                                <FileText size={22} />
                                            </span>
                                            <span className="rounded bg-emerald-700 px-2 py-1 text-[10px] font-extrabold uppercase text-white">Released</span>
                                        </div>
                                        <h2 className="mt-5 text-lg font-bold">{doc.documentName}</h2>
                                        <p className="mt-2 flex-1 text-sm text-slate-600">{formatCategoryLabel(doc.category)} document</p>
                                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                            <span className="text-[10px] font-bold uppercase text-slate-500">Added {formatDate(doc.createdAt)}</span>
                                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                                                View Document
                                                <ArrowRight size={12} />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : null}

                        {activeTab === "Final Wishes" ? (
                            <div className="mt-10 grid gap-6 md:grid-cols-2">
                                {(vault?.finalWishes || []).map((wish) => (
                                    <article key={wish._id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">{formatCategoryLabel(wish.category)}</span>
                                        <h2 className="mt-4 text-lg font-bold">{wish.title}</h2>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{wish.content}</p>
                                    </article>
                                ))}
                            </div>
                        ) : null}

                        {activeTab === "Future Messages" ? (
                            <div className="mt-10 grid gap-6 md:grid-cols-2">
                                {(vault?.futureMessages || []).map((message) => (
                                    <article key={message._id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                                        <Sparkles size={18} className="text-emerald-700" />
                                        <h2 className="mt-4 text-lg font-bold">{message.title}</h2>
                                        <p className="mt-2 text-sm text-slate-600">{message.messageType} message</p>
                                        {message.content ? <p className="mt-3 text-sm leading-6 text-slate-600">{message.content}</p> : null}
                                        {message.fileUrl ? (
                                            <a href={message.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-emerald-700">
                                                Open Media
                                            </a>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        ) : null}

                        <section className="mt-12 flex flex-col gap-6 rounded-2xl bg-blue-50 p-8 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-4">
                                <LifeBuoy size={32} className="shrink-0 text-blue-600" />
                                <div>
                                    <h2 className="font-bold">Need Assistance?</h2>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                        Our legal support team is available 24/7 to help you navigate these documents and ensure a smooth transition of the digital estate.
                                    </p>
                                </div>
                            </div>
                            <Link to="/claim" className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white flex items-center">
                                Contact Advisor
                            </Link>
                        </section>
                    </>
                )}
            </main>

            {showToast && access?.vaultAccessGranted ? (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm text-white shadow-xl">
                    <Lock size={16} className="text-emerald-400" />
                    Vault Assets Decrypted Successfully
                    <button onClick={() => setShowToast(false)} className="ml-2 text-slate-400 hover:text-white">×</button>
                </div>
            ) : null}
        </div>
    );
}
