import {
    ArrowRight,
    Bell,
    Box,
    Building2,
    CheckCircle2,
    Download,
    FileText,
    Gavel,
    Home,
    Key,
    LifeBuoy,
    List,
    Lock,
    Search,
    Settings,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = [
    { label: "Documents", icon: FileText },
    { label: "Final Wishes", icon: Sparkles },
    { label: "Future Messages", icon: FileText },
];

const assets = [
    {
        title: "Last Will & Testament",
        icon: Gavel,
        description: "Formal legal document outlining asset distribution and final directives. Certified Copy.",
        meta: "SIZE 2.4 MB PDF",
        action: "View Document",
    },
    {
        title: "Estate Property Deeds",
        icon: Home,
        description: "Documentation for the residence at 442 Silver Creek. Includes architectural plans.",
        meta: "FOLDER Real Estate",
        action: "View Folder",
    },
    {
        title: "Cloud Access Vault",
        icon: Key,
        description: "Decrypted login credentials and master keys for primary digital services and cloud storage.",
        meta: "SECURITY Encrypted Key",
        action: "Unlock Access",
        lock: true,
    },
    {
        title: "Life Insurance Policies",
        icon: Building2,
        description: "Coverage details and claim instructions for active policies with Metropolitan & Co.",
        meta: "PROVIDER Metropolitan",
        action: "Initiate Claim",
    },
    {
        title: "Tax Compliance History",
        icon: FileText,
        description: "Previous 7 years of federal and state tax filings, categorized and ready for export.",
        meta: "STATUS Up to date",
        action: "Download ZIP",
        download: true,
    },
    {
        title: "Asset Inventory List",
        icon: Box,
        description: "Catalog of physical heirlooms, appraisals, and storage location for safe deposit boxes.",
        meta: "ITEMS 42 Logged",
        action: "View List",
        list: true,
    },
];

export default function VaultAccess() {
    const [activeTab, setActiveTab] = useState("Documents");
    const [showToast, setShowToast] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
                <Link to="/" className="text-lg font-bold text-emerald-700">LegacyVault</Link>
                <label className="relative hidden w-full max-w-md md:block">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="h-10 w-full rounded-full bg-slate-100 px-11 text-sm outline-none"
                        placeholder="Search archive..."
                    />
                </label>
                <div className="flex items-center gap-5">
                    <Bell size={18} className="text-slate-600" />
                    <Settings size={18} className="text-slate-600" />
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                        alt=""
                        className="size-10 rounded-full object-cover"
                    />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Inheritance &gt; Vault Access</p>
                <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Digital Estate of Eleanor Vance</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            Access has been granted following successful successor verification. All assets below have been decrypted and released for your viewing.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-100">
                        <CheckCircle2 className="text-emerald-700" size={24} />
                        <div>
                            <p className="text-sm font-extrabold text-emerald-800">VERIFIED SUCCESSOR</p>
                            <p className="text-xs text-slate-600">Verified on Oct 24, 2024</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-10 flex justify-center gap-8 border-b border-slate-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.label;

                        return (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-bold transition ${
                                    active
                                        ? "border-emerald-700 text-emerald-700"
                                        : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {activeTab === "Documents" ? (
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {assets.map((asset) => {
                            const Icon = asset.icon;

                            return (
                                <article
                                    key={asset.title}
                                    className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                            <Icon size={22} />
                                        </span>
                                        <span className="rounded bg-emerald-700 px-2 py-1 text-[10px] font-extrabold uppercase text-white">
                                            Released
                                        </span>
                                    </div>
                                    <h2 className="mt-5 text-lg font-bold">{asset.title}</h2>
                                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{asset.description}</p>
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                        <span className="text-[10px] font-bold uppercase text-slate-500">{asset.meta}</span>
                                        <button className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                                            {asset.action}
                                            {asset.lock ? <Lock size={12} /> : asset.download ? <Download size={12} /> : asset.list ? <List size={12} /> : <ArrowRight size={12} />}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mt-16 text-center text-slate-500">
                        <p className="text-lg font-medium">{activeTab} will appear here after release.</p>
                    </div>
                )}

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
                    <div className="flex gap-3">
                        <button className="h-12 rounded-xl bg-white px-6 font-bold text-slate-800 ring-1 ring-slate-200">Documentation</button>
                        <button className="h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white">Contact Advisor</button>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white px-6 py-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-bold text-emerald-700">LegacyVault</p>
                        <p className="mt-1">© 2024 LegacyVault. All rights reserved. Secure & Encrypted.</p>
                    </div>
                    <a href="#privacy">Privacy Policy</a>
                </div>
            </footer>

            {showToast ? (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm text-white shadow-xl">
                    <Lock size={16} className="text-emerald-400" />
                    Vault Assets Decrypted Successfully
                    <button onClick={() => setShowToast(false)} className="ml-2 text-slate-400 hover:text-white">×</button>
                </div>
            ) : null}
        </div>
    );
}
