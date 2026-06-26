import {
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronRight,
    FileText,
    Globe,
    HelpCircle,
    Lock,
    Shield,
    Upload,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
    { label: "Verify Identity", icon: Shield },
    { label: "Security Questions", icon: HelpCircle },
    { label: "Supporting Docs", icon: FileText },
    { label: "Review & Submit", icon: CheckCircle2 },
];

const relationships = [
    "Spouse / Partner",
    "Child",
    "Sibling",
    "Legal Trustee",
    "Other Family Member",
    "Other",
];

export default function ClaimPortal() {
    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState({
        email: "",
        relationship: "",
        vaultId: "",
        agreed: false,
        answers: ["", "", ""],
        documents: [],
    });

    const update = (field, value) => setForm({ ...form, [field]: value });

    const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="border-b border-slate-200 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-xl font-bold text-emerald-800">LegacyVault</Link>
                        <span className="text-sm text-slate-500">Claims Portal</span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-emerald-700">
                        <Lock size={14} />
                        Encrypted Session AES-256 Secured
                    </span>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-6 py-10">
                <nav className="mb-10 flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const active = index === currentStep;
                        const done = index < currentStep;

                        return (
                            <div key={step.label} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`grid size-10 place-items-center rounded-full ${
                                            active || done ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"
                                        }`}
                                    >
                                        {done ? <Check size={18} /> : <Icon size={18} />}
                                    </span>
                                    <p className={`mt-2 hidden text-xs font-bold sm:block ${active ? "text-emerald-700 underline" : "text-slate-500"}`}>
                                        {step.label}
                                    </p>
                                </div>
                                {index < steps.length - 1 ? (
                                    <div className={`mx-2 h-px flex-1 ${index < currentStep ? "bg-emerald-700" : "bg-slate-200"}`} />
                                ) : null}
                            </div>
                        );
                    })}
                </nav>

                <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    {currentStep === 0 && (
                        <StepIdentity form={form} update={update} onContinue={next} />
                    )}
                    {currentStep === 1 && (
                        <StepQuestions form={form} update={update} onContinue={next} onBack={back} />
                    )}
                    {currentStep === 2 && (
                        <StepDocuments onContinue={next} onBack={back} />
                    )}
                    {currentStep === 3 && (
                        <StepReview form={form} onBack={back} />
                    )}
                </article>

                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <a href="#faq" className="inline-flex items-center gap-1 hover:text-emerald-700">
                        Need help with your claim? View FAQ
                        <ChevronRight size={14} />
                    </a>
                    <span>Reference ID: LV-992-CXQ</span>
                </div>
            </div>

            <footer className="border-t border-slate-200 bg-white px-6 py-8">
                <div className="mx-auto flex max-w-4xl flex-col gap-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-bold text-slate-900">LegacyVault</p>
                        <p className="mt-1">© 2024 LegacyVault. All rights reserved. Secure & Encrypted.</p>
                    </div>
                    <nav className="flex flex-wrap gap-6">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#security">Security Audit</a>
                        <a href="#support">Support</a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

function StepIdentity({ form, onContinue, update }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold text-slate-900">Step 1: Identity Verification</h1>
                <p className="mt-2 text-sm text-slate-600">Provide your contact details and relationship to begin the secure claims process.</p>
            </div>
            <div className="grid lg:grid-cols-[1fr_280px]">
                <div className="space-y-6 p-8">
                    <div>
                        <label className="text-sm font-bold text-slate-800">Your Email Address</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="e.g. john.doe@example.com"
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                        <p className="mt-2 text-xs italic text-slate-500">We will use this to send a verification link.</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-800">Relation to the Deceased</label>
                        <select
                            value={form.relationship}
                            onChange={(e) => update("relationship", e.target.value)}
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                        >
                            <option value="">Select relationship...</option>
                            {relationships.map((rel) => (
                                <option key={rel} value={rel}>{rel}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-800">Deceased&apos;s Vault ID (Optional)</label>
                        <input
                            type="text"
                            value={form.vaultId}
                            onChange={(e) => update("vaultId", e.target.value)}
                            placeholder="8-character alphanumeric code"
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                    <label className="flex cursor-pointer gap-3 text-sm leading-6 text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.agreed}
                            onChange={(e) => update("agreed", e.target.checked)}
                            className="mt-1 size-4 accent-emerald-700"
                        />
                        I confirm that I am initiating this claim in good faith and understand that providing false information is a legal violation under the LegacyVault Terms of Service.
                    </label>
                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={onContinue}
                            disabled={!form.email || !form.relationship || !form.agreed}
                            className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:opacity-50"
                        >
                            Save and Continue
                            <ArrowRight size={16} />
                        </button>
                        <Link to="/" className="h-12 px-4 text-sm font-medium text-slate-500">Cancel</Link>
                    </div>
                </div>
                <SecuritySidebar />
            </div>
        </>
    );
}

function StepQuestions({ form, onBack, onContinue, update }) {
    const questions = [
        "What was the name of your first childhood pet?",
        "In what city did your parents meet?",
        "What is the model of your first car?",
    ];

    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 2: Security Questions</h1>
                <p className="mt-2 text-sm text-slate-600">Answer the verification questions set by the vault owner.</p>
            </div>
            <div className="space-y-6 p-8">
                {questions.map((q, i) => (
                    <div key={q}>
                        <label className="text-sm font-bold">{q}</label>
                        <input
                            type="text"
                            value={form.answers[i]}
                            onChange={(e) => {
                                const answers = [...form.answers];
                                answers[i] = e.target.value;
                                update("answers", answers);
                            }}
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                ))}
                <div className="flex gap-4 pt-2">
                    <button onClick={onContinue} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                        Save and Continue
                        <ArrowRight size={16} />
                    </button>
                    <button onClick={onBack} className="text-sm text-slate-500">Back</button>
                </div>
            </div>
        </>
    );
}

function StepDocuments({ onBack, onContinue }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 3: Supporting Documents</h1>
                <p className="mt-2 text-sm text-slate-600">Upload legal proof of relationship and government-issued identification.</p>
            </div>
            <div className="p-8">
                <div className="grid min-h-48 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30">
                    <div className="text-center">
                        <Upload size={36} className="mx-auto text-emerald-700" />
                        <p className="mt-4 font-bold">Drag & drop files here</p>
                        <p className="mt-2 text-sm text-slate-500">PDF, JPG, or PNG up to 10MB</p>
                        <button className="mt-4 rounded-xl bg-emerald-700 px-6 py-2 text-sm font-bold text-white">
                            Browse Files
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button onClick={onContinue} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                        Save and Continue
                        <ArrowRight size={16} />
                    </button>
                    <button onClick={onBack} className="text-sm text-slate-500">Back</button>
                </div>
            </div>
        </>
    );
}

function StepReview({ form, onBack }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 4: Review & Submit</h1>
                <p className="mt-2 text-sm text-slate-600">Confirm your claim details before submission.</p>
            </div>
            <div className="space-y-4 p-8">
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Relationship" value={form.relationship} />
                <ReviewRow label="Vault ID" value={form.vaultId || "Not provided"} />
                <ReviewRow label="Security Answers" value={`${form.answers.filter(Boolean).length} of 3 answered`} />
                <ReviewRow label="Documents" value="Ready for upload" />
                <div className="flex gap-4 pt-4">
                    <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                        Submit Claim
                        <Check size={16} />
                    </button>
                    <button onClick={onBack} className="text-sm text-slate-500">Back</button>
                </div>
            </div>
        </>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
            <span className="text-sm font-bold text-slate-600">{label}</span>
            <span className="text-sm text-slate-800">{value}</span>
        </div>
    );
}

function SecuritySidebar() {
    return (
        <aside className="border-t border-slate-100 bg-blue-50/60 p-8 lg:border-l lg:border-t-0">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase text-emerald-700">
                <Shield size={14} />
                Security Protocol
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
                Your IP address is logged and this process ensures secure asset release only to verified successors.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["End-to-end encryption active", "Zero-knowledge proof verification", "Compliance with GDPR & CCPA"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-700" />
                        {item}
                    </li>
                ))}
            </ul>
            <div className="relative mt-8 overflow-hidden rounded-xl bg-slate-900 p-5 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#0d5f46,transparent_60%)] opacity-60" />
                <p className="relative flex items-center gap-2 text-xs font-bold">
                    <Globe size={14} />
                    GLOBAL NODE VERIFIED
                </p>
            </div>
        </aside>
    );
}
