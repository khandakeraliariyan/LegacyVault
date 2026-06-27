import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../components/common/Loading";
import { ROUTES } from "../../constants/routes";
import { getMyClaims } from "../../services/claim.service";
import { formatDate } from "../../utils/format";

const steps = [
    {
        title: "Identity Verification",
        text: "A claimant submits the same successor email, relationship, and NID number you configured.",
    },
    {
        title: "Security Questions",
        text: "They must answer the verification questions you configured in the security section.",
    },
    {
        title: "Automated Matching",
        text: "The system compares email, relationship, NID number, and the security question score automatically.",
    },
    {
        title: "Direct Access",
        text: "If all checks pass, vault access is granted immediately without admin review.",
    },
];

export default function Claims() {
    const { data: claims = [], isLoading } = useQuery({
        queryKey: ["claims"],
        queryFn: getMyClaims,
    });

    if (isLoading) {
        return <Loading />;
    }

    const activeClaims = claims.filter((claim) => claim.status === "PENDING").length;
    const approvedClaims = claims.filter((claim) => claim.status === "APPROVED").length;
    const rejectedClaims = claims.filter((claim) => claim.status === "REJECTED").length;
    const averageScore = claims.length
        ? `${Math.round(claims.reduce((sum, claim) => sum + (claim.score || 0), 0) / claims.length)}%`
        : "-";

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Vault Claims</h1>
                    <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
                        Monitor claim attempts against your vault and see whether automatic successor verification passed or failed.
                    </p>
                </div>
                <Link
                    to={ROUTES.CLAIM}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white"
                >
                    Open Public Claim Portal
                    <ArrowRight size={18} />
                </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <StatusCard
                    icon={Clock}
                    label="Pending Claims"
                    value={String(activeClaims)}
                    detail={activeClaims > 0 ? "Still processing" : "No pending submissions"}
                />
                <StatusCard
                    icon={CheckCircle2}
                    label="Approved"
                    value={String(approvedClaims)}
                    detail="Vault access granted automatically"
                />
                <StatusCard
                    icon={Shield}
                    label="Rejected"
                    value={String(rejectedClaims)}
                    detail={claims.length > 0 ? `Average score ${averageScore}` : "No failed attempts"}
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
                            Share this portal with your designated successor when they need to begin the verification process.
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
                    <h2 className="text-lg font-bold">Claim Activity</h2>
                </div>

                {claims.length > 0 ? (
                    <div className="mt-6 divide-y divide-slate-200">
                        {claims.map((claim) => (
                            <article key={claim._id} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {claim.claimantName} ({claim.claimantEmail})
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {claim.successorId?.relationship || "Successor"} claim submitted on {formatDate(claim.createdAt)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        Score {claim.score || 0}%
                                    </span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getClaimStatusClass(claim.status)}`}>
                                        {formatClaimStatus(claim.status)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 text-center text-sm text-slate-500">
                        No claims have been submitted against this vault yet.
                    </p>
                )}
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

function formatClaimStatus(status = "") {
    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getClaimStatusClass(status = "") {
    if (status === "APPROVED") {
        return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
        return "bg-rose-50 text-rose-700";
    }

    return "bg-amber-50 text-amber-700";
}
