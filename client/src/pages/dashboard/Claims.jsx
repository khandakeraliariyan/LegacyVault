import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../constants/routes";

const steps = [
    {
        title: "Identity Verification",
        text: "Submit your email, relationship to the deceased, and optional vault ID.",
    },
    {
        title: "Security Questions",
        text: "Answer personalized verification questions only the successor would know.",
    },
    {
        title: "Supporting Documents",
        text: "Upload legal proof of relationship and identity documentation.",
    },
    {
        title: "Review & Submit",
        text: "Confirm your claim details and await admin verification.",
    },
];

export default function Claims() {
    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Legacy Claims</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Initiate or track a successor claim to access a digital vault after verification triggers are met.
                    </p>
                </div>
                <Link
                    to={ROUTES.CLAIM}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white"
                >
                    Start New Claim
                    <ArrowRight size={18} />
                </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <StatusCard
                    icon={Clock}
                    label="Active Claims"
                    value="0"
                    detail="No pending submissions"
                />
                <StatusCard
                    icon={CheckCircle2}
                    label="Approved"
                    value="0"
                    detail="Vault access granted"
                />
                <StatusCard
                    icon={Shield}
                    label="Verification Score"
                    value="—"
                    detail="Complete a claim to see score"
                />
            </div>

            <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold">How the Claims Process Works</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex gap-4">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                {index + 1}
                            </span>
                            <div>
                                <h3 className="font-bold">{step.title}</h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Successor Claims Portal</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                            If you are a designated successor, use the secure claims portal to begin the verification process and gain access to the digital estate.
                        </p>
                    </div>
                    <Link
                        to={ROUTES.CLAIM}
                        className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 font-bold text-emerald-800 ring-1 ring-slate-200"
                    >
                        Open Claims Portal
                        <ExternalLink size={16} />
                    </Link>
                </div>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                    <FileText size={20} className="text-emerald-700" />
                    <h2 className="text-lg font-bold">Your Submissions</h2>
                </div>
                <p className="mt-6 text-center text-sm text-slate-500">
                    No claims submitted yet. Start a new claim when you need to access a vault as a successor.
                </p>
            </section>
        </div>
    );
}

function StatusCard({ detail, icon: Icon, label, value }) {
    return (
        <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon size={20} />
                </span>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</p>
            </div>
            <p className="mt-4 text-4xl font-extrabold">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{detail}</p>
        </article>
    );
}
