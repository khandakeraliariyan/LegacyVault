import {
    CheckCircle2,
    Circle,
    Plus,
    ShieldCheck,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import DashboardToolbar from "../../components/dashboard/DashboardToolbar";
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
    relationship: "",
};

export default function Successors() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
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
                relationship: successor.relationship || "",
            });
        } else {
            setForm(emptyForm);
        }

        setShowForm(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    const showSuccessor = successor && matchesSearch(successor, search);

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
                        <Plus size={15} />
                        {successor ? "Edit Successor" : "Add Successor"}
                    </button>
                }
            />

            <DashboardToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search records..."
                action={
                    <button className="inline-flex h-10 items-center rounded-[8px] bg-[#2f6b55] px-4 text-xs font-semibold text-white transition hover:bg-[#255743]">
                        Search
                    </button>
                }
            />

            {showForm ? (
                <section className="mt-6 rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {successor ? "Edit Primary Successor" : "Add Primary Successor"}
                    </h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {[
                            ["fullName", "Full Name"],
                            ["relationship", "Relationship"],
                            ["email", "Contact Email"],
                            ["phone", "Secure Phone"],
                        ].map(([key, label]) => (
                            <label key={key} className="block">
                                <span className="text-sm font-medium text-slate-600">{label}</span>
                                <input
                                    value={form[key]}
                                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                                    className="mt-2 h-12 w-full rounded-[10px] border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-[#2f6b55]"
                                />
                            </label>
                        ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={() => saveMutation.mutate(form)}
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
                    {showSuccessor ? (
                        <>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="grid size-[54px] place-items-center rounded-full border border-slate-200 bg-[linear-gradient(180deg,#fafafa,#edf1f3)] text-lg font-semibold text-slate-700">
                                            {successor.fullName?.slice(0, 1)?.toUpperCase() || "S"}
                                        </div>
                                        <div>
                                            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
                                                {successor.fullName}
                                            </h2>
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
                                    <DetailRow label="Authorization Level" value="Full Access" />
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
                                Add the trusted individual who should receive access when claim verification is approved.
                            </p>
                            <button
                                onClick={openForm}
                                className="mt-6 inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-5 text-sm font-semibold text-white"
                            >
                                <Plus size={15} />
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
                                    background: "conic-gradient(#356f5a 90%, #e5eaec 90% 100%)",
                                }}
                            >
                                <div className="grid size-[88px] place-items-center rounded-full bg-white text-center">
                                    <div>
                                        <p className="text-[2rem] font-semibold tracking-[-0.04em] text-[#2f6b55]">90%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Excellent Standing
                        </p>

                        <div className="mt-5 space-y-3">
                            <ChecklistItem checked text="Two-factor authentication active" />
                            <ChecklistItem checked={Boolean(successor?.isVerified)} text="Identity documents verified" />
                            <ChecklistItem checked={false} text="Biometric setup pending" />
                        </div>
                    </section>

                    <section className="rounded-[14px] border border-dashed border-slate-300 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center gap-2 text-slate-900">
                            <ShieldCheck size={18} />
                            <h2 className="text-[1.05rem] font-semibold">Contingency</h2>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            No secondary successor appointed. It is highly recommended to establish a backup.
                        </p>
                        <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white">
                            <Plus size={15} />
                            Appoint Secondary
                        </button>
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

function matchesSearch(successor, search) {
    const query = search.trim().toLowerCase();

    if (!query) {
        return true;
    }

    return `${successor.fullName} ${successor.email} ${successor.relationship} ${successor.phone}`
        .toLowerCase()
        .includes(query);
}
