import {
    CheckCircle2,
    Circle,
    ShieldCheck,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    createSuccessor,
    deleteSuccessor,
    getMySuccessor,
    updateSuccessor,
} from "../../services/successor.service";

const emptyForm = {
    fullName: "",
    email: "",
    phone: "",
    nidNumber: "",
    relationship: "",
};

const relationshipOptions = [
    "Spouse / Partner",
    "Child",
    "Sibling",
    "Legal Trustee",
    "Other",
];

export default function Successors() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const { data: successor, isLoading } = useQuery({
        queryKey: ["successor"],
        queryFn: getMySuccessor,
    });

    const saveMutation = useMutation({
        mutationFn: (payload) => (successor ? updateSuccessor(payload) : createSuccessor(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["successor"] });
            toast.success(successor ? "Successor updated." : "Successor added.");
            setShowForm(false);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save successor.")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSuccessor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["successor"] });
            toast.success("Successor removed.");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to remove successor.")),
    });

    const openForm = () => {
        if (successor) {
            setForm({
                fullName: successor.fullName || "",
                email: successor.email || "",
                phone: successor.phone || "",
                nidNumber: successor.nidNumber || "",
                relationship: successor.relationship || "",
            });
        } else {
            setForm(emptyForm);
        }

        setShowForm(true);
    };

    const handleSave = () => {
        const requiredFields = [
            ["fullName", "Full name"],
            ["relationship", "Relationship"],
            ["email", "Contact email"],
            ["phone", "Secure phone"],
            ["nidNumber", "NID number"],
        ];

        const missingField = requiredFields.find(
            ([key]) => !String(form[key] || "").trim()
        );

        if (missingField) {
            toast.error(`${missingField[1]} is required.`);
            return;
        }

        saveMutation.mutate(form);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Primary Successor"
                description="Designated individual authorized to execute legacy instructions."
                action={
                    <button
                        onClick={openForm}
                        className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white transition hover:bg-[#255743]"
                    >
                        {successor ? "Edit Successor" : "Set Primary Successor"}
                    </button>
                }
            />

            {showForm ? (
                <section className="mt-6 rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {successor ? "Edit Primary Successor" : "Add Primary Successor"}
                    </h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-600">
                                Full Name <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.fullName}
                                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                                required
                                className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-600">
                                Relationship <span className="text-rose-500">*</span>
                            </span>
                            <select
                                value={form.relationship}
                                onChange={(event) => setForm({ ...form, relationship: event.target.value })}
                                required
                                className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                            >
                                <option value="">Select relationship...</option>
                                {relationshipOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-600">
                                Contact Email <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.email}
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                required
                                className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-600">
                                Secure Phone <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.phone}
                                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                                required
                                className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-600">
                                NID Number <span className="text-rose-500">*</span>
                            </span>
                            <input
                                value={form.nidNumber}
                                onChange={(event) => setForm({ ...form, nidNumber: event.target.value })}
                                required
                                className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                            />
                        </label>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="inline-flex h-11 items-center rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Successor"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="inline-flex h-11 items-center rounded-[8px] border border-slate-300 px-5 text-sm font-medium text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            ) : null}

            <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
                <section className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    {showForm && !successor ? (
                        <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
                            <span className="grid size-14 place-items-center rounded-full bg-[#eef9f4] text-[#2f6b55]">
                                <UserPlus size={26} />
                            </span>
                            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                                Complete the primary successor form
                            </h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                                All required details must be provided before the primary successor can be saved.
                            </p>
                        </div>
                    ) : successor ? (
                        <>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="grid size-[54px] place-items-center rounded-full border border-slate-200 bg-[linear-gradient(180deg,#fafafa,#edf1f3)] text-lg font-semibold text-slate-700">
                                            {successor.fullName?.slice(0, 1)?.toUpperCase() || "S"}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
                                                    {successor.fullName}
                                                </h2>
                                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                                    View Only
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Legal Beneficiary &amp; Primary Executor
                                            </p>
                                        </div>
                                    </div>

                                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${successor.isVerified
                                        ? "border border-[#d4e7de] bg-[#eef9f4] text-[#2f6b55]"
                                        : "border border-amber-200 bg-amber-50 text-amber-700"
                                        }`}>
                                        {successor.isVerified ? "Verified Identity" : "Verification Pending"}
                                    </span>
                                </div>

                            <div className="mt-8 divide-y divide-slate-200 border-t border-slate-200">
                                <DetailRow label="Relationship" value={successor.relationship || "Not set"} />
                                <DetailRow label="Contact Email" value={successor.email || "Not set"} />
                                <DetailRow label="Secure Phone" value={successor.phone || "Not set"} />
                                <DetailRow label="NID Number" value={successor.nidNumber || "Not set"} />
                                <DetailRow label="Authorization Level" value="Full Access" />
                                <DetailRow label="Access Mode" value="View-only after successful claim" />
                                <DetailRow label="Vault Access" value={successor.vaultAccessGranted ? "Granted after automatic verification" : "Waiting for matching claim"} />
                            </div>
                        </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-[#f8f9fb] px-6 py-4">
                                <button
                                    onClick={() => deleteMutation.mutate()}
                                    disabled={deleteMutation.isPending}
                                    className="text-sm font-medium text-rose-600 transition hover:text-rose-700 disabled:opacity-60"
                                >
                                    Revoke Access
                                </button>
                            <button
                                onClick={openForm}
                                className="inline-flex h-10 items-center rounded-[8px] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Edit Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
                            <span className="grid size-14 place-items-center rounded-full bg-[#eef9f4] text-[#2f6b55]">
                                <UserPlus size={26} />
                            </span>
                            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                                No primary successor configured
                            </h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                                Add the trusted individual who should receive access when the claim matches their email, relationship, NID number, and security answers.
                            </p>
                            <button
                                onClick={openForm}
                                className="mt-6 inline-flex h-11 items-center rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white"
                            >
                                Add Primary Successor
                            </button>
                        </div>
                    )}
                </section>

                <aside className="space-y-4">
                    <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <h2 className="text-[1.05rem] font-semibold text-slate-900">Security Posture</h2>

                        <div className="mt-5 flex justify-center">
                            <div
                                className="grid size-[116px] place-items-center rounded-full"
                                style={{
                                    background: `conic-gradient(#356f5a ${getSecurityScore(successor)}%, #e5eaec ${getSecurityScore(successor)}% 100%)`,
                                }}
                            >
                                <div className="grid size-[88px] place-items-center rounded-full bg-white text-center">
                                    <div>
                                        <p className="text-[2rem] font-semibold tracking-[-0.04em] text-[#2f6b55]">{getSecurityScore(successor)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {getSecurityHeading(successor)}
                        </p>

                        <div className="mt-5 space-y-3">
                            <ChecklistItem checked={Boolean(successor)} text="Primary successor configured" />
                            <ChecklistItem checked={Boolean(successor)} text="Required successor details completed" />
                            <ChecklistItem checked={Boolean(successor)} text="Single-successor setup complete" />
                        </div>
                    </section>

                    <section className="rounded-[14px] border border-dashed border-slate-300 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center gap-2 text-slate-900">
                            <ShieldCheck size={18} />
                            <h2 className="text-[1.05rem] font-semibold">Contingency</h2>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            This release supports only one primary successor. To change the successor later, edit the current profile or remove it first.
                        </p>
                        <Link
                            to="/dashboard/claims"
                            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white"
                        >
                            Review Claims
                        </Link>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="grid grid-cols-[140px_1fr] gap-6 py-4 text-sm">
            <span className="text-slate-600">{label}</span>
            <span className="font-medium text-slate-800">{value}</span>
        </div>
    );
}

function ChecklistItem({ checked, text }) {
    const Icon = checked ? CheckCircle2 : Circle;

    return (
        <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Icon size={15} className={checked ? "text-[#2f6b55]" : "text-slate-400"} />
            <span>{text}</span>
        </div>
    );
}

function getSecurityScore(successor) {
    return successor ? 100 : 0;
}

function getSecurityHeading(successor) {
    return successor ? "Setup Complete" : "Needs Attention";
}
