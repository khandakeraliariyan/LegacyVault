import {
    CheckCircle2,
    ClipboardCheck,
    Edit3,
    Hourglass,
    Mail,
    Phone,
    Share2,
    Trash2,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { getApiErrorMessage } from "../../services/api";
import {
    createSuccessor,
    deleteSuccessor,
    getMySuccessor,
    updateSuccessor,
} from "../../services/successor.service";
import { formatDate } from "../../utils/format";

const emptyForm = {
    fullName: "",
    email: "",
    phone: "",
    relationship: "",
};

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
            toast.success(successor ? "Successor updated" : "Successor added");
            setShowForm(false);
            setForm(emptyForm);
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSuccessor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["successor"] });
            toast.success("Successor removed");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const openEdit = () => {
        if (!successor) {
            return;
        }

        setForm({
            fullName: successor.fullName,
            email: successor.email,
            phone: successor.phone,
            relationship: successor.relationship,
        });
        setShowForm(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[1fr_280px]">
            <div>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Successor Management</h1>
                        <p className="mt-2 max-w-xl text-base text-slate-600">Manage the individuals who will receive access to your digital legacy.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.origin + "/claim")}
                            className="inline-flex h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-medium"
                        >
                            <Share2 size={16} />
                            Share Protocol
                        </button>
                        <button
                            onClick={() => {
                                setForm(emptyForm);
                                setShowForm(true);
                            }}
                            className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-700 px-7 font-bold text-white"
                        >
                            <UserPlus size={17} />
                            {successor ? "Edit Successor" : "Add Successor"}
                        </button>
                    </div>
                </div>

                {showForm ? (
                    <SuccessorForm
                        form={form}
                        setForm={setForm}
                        onSubmit={() => saveMutation.mutate(form)}
                        onCancel={() => setShowForm(false)}
                        loading={saveMutation.isPending}
                        isEdit={Boolean(successor)}
                    />
                ) : null}

                {!successor ? (
                    <div className="mt-8">
                        <EmptyState
                            title="No successor appointed"
                            description="Add a trusted person who will receive your vault after verification."
                        />
                    </div>
                ) : (
                    <>
                        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <div className="bg-emerald-50/60 p-8">
                                <div className="flex items-start gap-6">
                                    <span className="grid size-20 place-items-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white">
                                        {successor.fullName.slice(0, 1)}
                                    </span>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{successor.fullName}</h2>
                                        <p className="font-bold text-emerald-700">Primary Successor - {successor.relationship}</p>
                                        <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><Mail size={14} /> {successor.email}</p>
                                        <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><Phone size={14} /> {successor.phone}</p>
                                    </div>
                                    <button onClick={openEdit}><Edit3 size={18} /></button>
                                    <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <div className="grid gap-6 p-8 md:grid-cols-2">
                                <StatusBox
                                    icon={CheckCircle2}
                                    title={successor.isVerified ? "Identity Verified" : "Identity Pending"}
                                    text={successor.isVerified ? `Completed on ${formatDate(successor.updatedAt)}` : "Awaiting claim verification"}
                                />
                                <StatusBox
                                    icon={Hourglass}
                                    title={successor.vaultAccessGranted ? "Access Granted" : "Pending Transfer"}
                                    text={successor.vaultAccessGranted ? `Granted on ${formatDate(successor.accessGrantedAt)}` : "Awaiting activation trigger"}
                                    blue
                                />
                            </div>
                        </section>

                        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-xl font-bold">Access Verification Timeline</h2>
                            <p className="mt-2 text-sm text-slate-600">The sequence required for {successor.fullName.split(" ")[0]} to gain full access to your digital vault.</p>
                            <div className="mt-10 grid gap-8 text-center md:grid-cols-3">
                                {[
                                    ["Identity Check", "Successor submits identity proof through the claims portal.", successor.isVerified ? "COMPLETED" : "PENDING"],
                                    ["Question Verification", "Personalized security questions only your successor would know.", "CONFIGURED"],
                                    ["Admin Approval", "Final legacy protocol review by LegacyVault trust officers.", successor.vaultAccessGranted ? "COMPLETED" : "FINAL PHASE"],
                                ].map(([title, text, badge], index) => (
                                    <div key={title}>
                                        <span className={`mx-auto grid size-16 place-items-center rounded-full ${index === 0 || badge === "COMPLETED" ? "bg-emerald-700 text-white" : "bg-blue-100 text-emerald-700"}`}>
                                            <ClipboardCheck size={24} />
                                        </span>
                                        <h3 className="mt-4 font-bold">{title}</h3>
                                        <p className="mt-2 text-sm leading-5 text-slate-600">{text}</p>
                                        <p className="mt-3 text-[10px] font-extrabold text-emerald-700">{badge}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>

            <aside className="space-y-8">
                <section className="rounded-2xl bg-emerald-700 p-7 text-white shadow-lg">
                    <h2 className="text-2xl font-bold">Security Score</h2>
                    <p className="mt-7 text-5xl font-extrabold">{successor ? "84" : "40"}<span className="text-xl">/100</span></p>
                    <p className="mt-6 text-sm leading-6 text-emerald-50">
                        {successor
                            ? "Adding verification questions and documents will increase your redundancy score."
                            : "Appoint a successor to begin building your legacy protocol."}
                    </p>
                </section>
            </aside>
        </div>
    );
}

function SuccessorForm({ form, isEdit, loading, onCancel, onSubmit, setForm }) {
    return (
        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">{isEdit ? "Edit Successor" : "Add Successor"}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                    ["fullName", "Full Name"],
                    ["email", "Email Address"],
                    ["phone", "Phone Number"],
                    ["relationship", "Relationship"],
                ].map(([key, label]) => (
                    <div key={key}>
                        <label className="text-sm font-bold">{label}</label>
                        <input
                            value={form[key]}
                            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6 flex gap-3">
                <button onClick={onSubmit} disabled={loading} className="h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:opacity-60">
                    {loading ? "Saving..." : "Save Successor"}
                </button>
                <button onClick={onCancel} className="h-12 px-4 text-sm text-slate-500">Cancel</button>
            </div>
        </section>
    );
}

function StatusBox({ blue, icon: Icon, text, title }) {
    return (
        <div className={`flex items-center gap-4 rounded-xl p-6 ${blue ? "bg-blue-50" : "bg-emerald-50"}`}>
            <Icon className={blue ? "text-blue-600" : "text-emerald-700"} size={28} />
            <div>
                <h3 className={`font-bold ${blue ? "text-blue-700" : "text-emerald-700"}`}>{title}</h3>
                <p className="text-sm text-slate-600">{text}</p>
            </div>
        </div>
    );
}
