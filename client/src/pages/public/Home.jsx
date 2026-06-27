import {
    ArrowRight,
    Check,
    FileText,
    History,
    LockKeyhole,
    ShieldCheck,
    Users,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const workflowSteps = [
    "Create your vault and define what matters most.",
    "Nominate a trusted successor and configure proof questions.",
    "Release documents only after claim review and approval.",
];

const securityPillars = [
    {
        title: "Time-Locked Release",
        text: "Define exactly when sensitive files, instructions, and account details can be accessed.",
        icon: LockKeyhole,
    },
    {
        title: "Multi-Party Verification",
        text: "Combine successor answers, identity proof, and admin review before vault access is granted.",
        icon: Users,
    },
    {
        title: "Immutable Audit Trails",
        text: "Track successor creation, question setup, uploads, and claim decisions across the platform.",
        icon: History,
    },
];

const featureRows = [
    {
        title: "Document vault built for sensitive records",
        text: "Store identity papers, property files, financial records, and digital asset references in one controlled inheritance workspace.",
        icon: FileText,
    },
    {
        title: "Successor-first claim workflow",
        text: "Guide family members through verification questions, claim submission, and vault access without exposing the full dashboard.",
        icon: Users,
    },
    {
        title: "Final wishes and future messages",
        text: "Preserve instructions, family notes, and time-sensitive messages alongside essential legal and financial materials.",
        icon: WalletCards,
    },
];

const faqs = [
    {
        question: "Who can access the vault after approval?",
        answer: "Only the designated successor for a vault should receive released content after claim review is approved.",
    },
    {
        question: "What can be stored in LegacyVault?",
        answer: "Documents, final wishes, successor details, verification questions, and future messages are all part of the current product scope.",
    },
    {
        question: "How is a claim verified?",
        answer: "Claims go through question-based verification and admin review before access is granted to the successor.",
    },
];

export default function Home() {
    return (
        <main>
            <Hero />
            <TrustStrip />
            <BentoSecurity />
            <Workflow />
            <FeatureGrid />
            <FaqSection />
            <BottomCta />
        </main>
    );
}

function Hero() {
    return (
        <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#fbfcfd_0%,#f7f9fb_100%)]">
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-18 md:grid-cols-[1fr_0.98fr] lg:px-8 lg:py-24">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                        <ShieldCheck size={14} className="text-[#235842]" />
                        Bank-Grade Encryption
                    </div>

                    <h1 className="mt-7 text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl">
                        Secure your digital legacy for the generations to come.
                    </h1>
                    <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                        A highly secure, institutional-grade vault for your most sensitive documents, final wishes, and asset access details. Engineered for peace of mind.
                    </p>

                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link
                            to="/register"
                            className="inline-flex h-13 items-center rounded-lg bg-[#235842] px-8 text-sm font-bold text-white transition hover:bg-[#194634]"
                        >
                            Create Your Vault
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex h-13 items-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div className="relative overflow-hidden rounded-md bg-[#0f1112] p-4">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbzl0NfHhphf0ZebzjIxnZuqLpuzR9BhO6D1mjT5W5bKNe949-RG1MTWsgpCr0FGSmUn5qKwEke493dhyWCHK9wawk4FzQXlDVMx77UlDg6qyQwLKwIGBBJGPXpmW3D-R1SrfMtM7_1TXRd8TsbzSMP-fGe9c0ew429_ydPbMs86sGAYHqNlHuUbYGyGtUtm-PnR6hkxie7HFMyi1sEtuFWdgo3IVdQEdTifTXxO2H1tXHIsPqO63hl4z5EJeTFFA_lShmV5ssM6xu"
                            alt="Abstract secure vault"
                            className="h-[360px] w-full rounded-md object-cover"
                        />
                        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-md border border-slate-200 bg-white/92 px-4 py-3 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-[#235842]" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Living Trust Document</p>
                                    <p className="text-xs text-slate-500">AES-256 Encrypted</p>
                                </div>
                            </div>
                            <Check size={18} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustStrip() {
    return (
        <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 text-center lg:px-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    Trusted by planners, families, and succession advisors
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-lg font-semibold tracking-[0.08em] text-slate-400">
                    <span>FORTRESS</span>
                    <span>VERITAS</span>
                    <span>LEGAL.IO</span>
                    <span>SENTINEL</span>
                    <span>AEGIS</span>
                </div>
            </div>
        </section>
    );
}

function BentoSecurity() {
    return (
        <section id="features" className="border-b border-slate-200 bg-[#f1f4f6] py-22">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">Engineered for permanence</h2>
                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Every part of LegacyVault is designed for controlled release, high-trust access, and a calmer family handover.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {securityPillars.map((pillar, index) => {
                        const Icon = pillar.icon;

                        if (index === 1) {
                            return (
                                <article key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm md:col-span-2">
                                    <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
                                        <div>
                                            <span className="flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#235842]">
                                                <Icon size={20} />
                                            </span>
                                            <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-slate-950">{pillar.title}</h3>
                                            <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">{pillar.text}</p>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            {["Legal Proxy", "Family Member", "Admin Review"].map((role) => (
                                                <div key={role} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                                                    {role}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            );
                        }

                        if (index === 2) {
                            return (
                                <article key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm md:col-span-3">
                                    <div className="grid gap-8 md:grid-cols-2">
                                        <div>
                                            <span className="flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#235842]">
                                                <Icon size={20} />
                                            </span>
                                            <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-slate-950">{pillar.title}</h3>
                                            <p className="mt-3 text-base leading-7 text-slate-600">{pillar.text}</p>
                                        </div>
                                        <div className="overflow-hidden rounded-xl border border-slate-200">
                                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                <span>Activity Log</span>
                                                <span>Status</span>
                                            </div>
                                            <div className="divide-y divide-slate-200 bg-white">
                                                {[
                                                    ["Will & Testament Updated", "Oct 12, 2026 • 14:02 UTC"],
                                                    ["Successor Added (J. Doe)", "Sep 05, 2026 • 09:15 UTC"],
                                                ].map(([title, time]) => (
                                                    <div key={title} className="flex items-center justify-between px-4 py-4">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">{title}</p>
                                                            <p className="mt-1 text-xs text-slate-500">{time}</p>
                                                        </div>
                                                        <Check size={16} className="text-[#235842]" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        }

                        return (
                            <article key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
                                <span className="flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#235842]">
                                    <Icon size={20} />
                                </span>
                                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-slate-950">{pillar.title}</h3>
                                <p className="mt-3 text-base leading-7 text-slate-600">{pillar.text}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Workflow() {
    return (
        <section className="border-b border-slate-200 bg-white py-22">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[1fr_0.9fr] lg:px-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#235842]">How it works</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                        A controlled handover process for digital inheritance.
                    </h2>
                    <div className="mt-8 space-y-6">
                        {workflowSteps.map((step, index) => (
                            <div key={step} className="flex gap-4">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#235842] text-sm font-bold text-white">
                                    {index + 1}
                                </span>
                                <p className="max-w-xl pt-1 text-base leading-7 text-slate-600">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#f6f7f4,#d7ddda)] p-8">
                    <div className="flex h-full min-h-[320px] items-end rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(255,255,255,0.18))] p-6 shadow-inner">
                        <div className="w-full rounded-xl border border-white/70 bg-white/80 p-5 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Vault Status</p>
                                    <p className="mt-1 text-xs text-slate-500">Primary successor configured</p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-[#235842]">
                                    Protected
                                </span>
                            </div>
                            <div className="mt-5 h-2 rounded-full bg-slate-200">
                                <div className="h-full w-3/4 rounded-full bg-[#235842]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureGrid() {
    return (
        <section id="security" className="border-b border-slate-200 bg-[#fbfcfd] py-22">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#235842]">Product scope</p>
                        <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                            Six critical layers of a secure legacy system.
                        </h2>
                    </div>
                    <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#235842]">
                        Start building your vault
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featureRows.map((row) => {
                        const Icon = row.icon;

                        return (
                            <article key={row.title} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
                                <span className="flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#235842]">
                                    <Icon size={20} />
                                </span>
                                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-slate-950">{row.title}</h3>
                                <p className="mt-3 text-base leading-7 text-slate-600">{row.text}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section id="pricing" className="border-b border-slate-200 bg-white py-22">
            <div className="mx-auto max-w-4xl px-5 lg:px-8">
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#235842]">Frequently asked</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">Answers for families planning ahead</h2>
                </div>

                <div className="mt-10 space-y-4">
                    {faqs.map((item, index) => (
                        <details
                            key={item.question}
                            open={index === 0}
                            className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-6"
                        >
                            <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                                {item.question}
                            </summary>
                            <p className="mt-4 text-base leading-7 text-slate-600">{item.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BottomCta() {
    return (
        <section className="bg-[#f1f4f6] py-18">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="rounded-3xl bg-[#235842] px-8 py-16 text-center text-white shadow-[0_30px_60px_rgba(35,88,66,0.22)]">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Ready to begin</p>
                    <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.04em]">
                        Create a vault your family can trust when clarity matters most.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50">
                        LegacyVault brings documents, successor planning, and claim review into one secure inheritance workflow.
                    </p>
                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-flex h-13 items-center rounded-lg bg-white px-8 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                        >
                            Create Your Vault
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex h-13 items-center rounded-lg border border-white/30 px-8 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
