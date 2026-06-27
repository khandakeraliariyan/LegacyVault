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
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BrandLogo from "../../components/common/BrandLogo";
import { getApiErrorMessage } from "../../services/api";
import {
    getVerificationQuestions,
    submitClaim,
} from "../../services/claim.service";
import { ROUTES } from "../../constants/routes";

const steps = [
    { label: "Verify Identity", icon: Shield },
    { label: "Security Questions", icon: HelpCircle },
    { label: "Supporting Docs", icon: FileText },
    { label: "Review & Submit", icon: CheckCircle2 },
];

export default function ClaimPortal() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [identityDocumentUrl, setIdentityDocumentUrl] = useState("");
    const [submittedClaim, setSubmittedClaim] = useState(null);
    const [form, setForm] = useState({
        claimantName: "",
        claimantEmail: "",
        claimantPhone: "",
        relationship: "",
        agreed: false,
    });

    const update = (field, value) => setForm({ ...form, [field]: value });

    const loadQuestions = async () => {
        setLoading(true);

        try {
            const data = await getVerificationQuestions(form.claimantEmail);
            setQuestions(data);
            setAnswers(Object.fromEntries(data.map((item) => [item._id, ""])));
            setCurrentStep(1);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not load verification questions"));
        } finally {
            setLoading(false);
        }
    };

    const handleIdentityContinue = async () => {
        if (!form.claimantName || !form.claimantEmail || !form.claimantPhone || !form.relationship || !form.agreed) {
            toast.error("Please complete all required fields");
            return;
        }

        await loadQuestions();
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const claim = await submitClaim({
                claimantName: form.claimantName,
                claimantEmail: form.claimantEmail,
                claimantPhone: form.claimantPhone,
                identityDocumentUrl: identityDocumentUrl || "https://legacyvault.local/identity-pending",
                answers: questions.map((question) => ({
                    questionId: question._id,
                    answer: answers[question._id] || "",
                })),
            });

            setSubmittedClaim(claim);
            toast.success(`Claim submitted with status: ${claim.status}`);

            if (claim.status === "APPROVED" || claim.status === "UNDER_REVIEW") {
                navigate(`${ROUTES.VAULT_ACCESS}?email=${encodeURIComponent(form.claimantEmail)}`);
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Claim submission failed"));
        } finally {
            setLoading(false);
        }
    };

    const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    const back = () => setCurrentStep((step) => Math.max(step - 1, 0));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="border-b border-slate-200 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BrandLogo
                            iconClassName="h-8 w-8"
                            textClassName="text-xl text-emerald-800"
                        />
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
                                    <span className={`grid size-10 place-items-center rounded-full ${active || done ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"}`}>
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
                    {currentStep === 0 ? (
                        <StepIdentity form={form} update={update} onContinue={handleIdentityContinue} loading={loading} />
                    ) : null}
                    {currentStep === 1 ? (
                        <StepQuestions
                            questions={questions}
                            answers={answers}
                            setAnswers={setAnswers}
                            onContinue={next}
                            onBack={back}
                        />
                    ) : null}
                    {currentStep === 2 ? (
                        <StepDocuments
                            identityDocumentUrl={identityDocumentUrl}
                            setIdentityDocumentUrl={setIdentityDocumentUrl}
                            onContinue={next}
                            onBack={back}
                        />
                    ) : null}
                    {currentStep === 3 ? (
                        <StepReview
                            form={form}
                            questions={questions}
                            answers={answers}
                            identityDocumentUrl={identityDocumentUrl}
                            submittedClaim={submittedClaim}
                            onBack={back}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    ) : null}
                </article>

                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <Link to="/dashboard/claims" className="inline-flex items-center gap-1 hover:text-emerald-700">
                        Need help with your claim? View FAQ
                        <ChevronRight size={14} />
                    </Link>
                    <span>Reference ID: LV-{Date.now().toString().slice(-6)}</span>
                </div>
            </div>
        </div>
    );
}

function StepIdentity({ form, loading, onContinue, update }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold text-slate-900">Step 1: Identity Verification</h1>
                <p className="mt-2 text-sm text-slate-600">Provide your contact details and relationship to begin the secure claims process.</p>
            </div>
            <div className="grid lg:grid-cols-[1fr_280px]">
                <div className="space-y-6 p-8">
                    <Field label="Full Name" value={form.claimantName} onChange={(value) => update("claimantName", value)} placeholder="John Doe" />
                    <Field label="Your Email Address" value={form.claimantEmail} onChange={(value) => update("claimantEmail", value)} placeholder="e.g. john.doe@example.com" helper="Must match the email registered as successor." />
                    <Field label="Phone Number" value={form.claimantPhone} onChange={(value) => update("claimantPhone", value)} placeholder="+1 (555) 012-3456" />
                    <div>
                        <label className="text-sm font-bold text-slate-800">Relation to the Deceased</label>
                        <select
                            value={form.relationship}
                            onChange={(event) => update("relationship", event.target.value)}
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
                        >
                            <option value="">Select relationship...</option>
                            {["Spouse / Partner", "Child", "Sibling", "Legal Trustee", "Other"].map((rel) => (
                                <option key={rel} value={rel}>{rel}</option>
                            ))}
                        </select>
                    </div>
                    <label className="flex cursor-pointer gap-3 text-sm leading-6 text-slate-600">
                        <input type="checkbox" checked={form.agreed} onChange={(event) => update("agreed", event.target.checked)} className="mt-1 size-4 accent-emerald-700" />
                        I confirm that I am initiating this claim in good faith and understand that providing false information is a legal violation under the LegacyVault Terms of Service.
                    </label>
                    <div className="flex gap-4 pt-2">
                        <button onClick={onContinue} disabled={loading} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:opacity-50">
                            {loading ? "Loading..." : "Save and Continue"}
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

function StepQuestions({ answers, onBack, onContinue, questions, setAnswers }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 2: Security Questions</h1>
                <p className="mt-2 text-sm text-slate-600">Answer the verification questions set by the vault owner.</p>
            </div>
            <div className="space-y-6 p-8">
                {questions.map((question) => (
                    <div key={question._id}>
                        <label className="text-sm font-bold">{question.question}</label>
                        <input
                            type="text"
                            value={answers[question._id] || ""}
                            onChange={(event) => setAnswers({ ...answers, [question._id]: event.target.value })}
                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
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

function StepDocuments({ identityDocumentUrl, onBack, onContinue, setIdentityDocumentUrl }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 3: Supporting Documents</h1>
                <p className="mt-2 text-sm text-slate-600">Provide a URL to your identity document or upload reference.</p>
            </div>
            <div className="p-8">
                <div className="grid min-h-48 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30">
                    <div className="w-full max-w-lg px-6 text-center">
                        <Upload size={36} className="mx-auto text-emerald-700" />
                        <p className="mt-4 font-bold">Identity Document URL</p>
                        <input
                            value={identityDocumentUrl}
                            onChange={(event) => setIdentityDocumentUrl(event.target.value)}
                            placeholder="https://example.com/identity-document.pdf"
                            className="mt-4 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"
                        />
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

function StepReview({ answers, form, identityDocumentUrl, loading, onBack, onSubmit, questions, submittedClaim }) {
    return (
        <>
            <div className="border-b border-slate-100 p-8">
                <h1 className="text-2xl font-bold">Step 4: Review & Submit</h1>
                <p className="mt-2 text-sm text-slate-600">Confirm your claim details before submission.</p>
            </div>
            <div className="space-y-4 p-8">
                <ReviewRow label="Name" value={form.claimantName} />
                <ReviewRow label="Email" value={form.claimantEmail} />
                <ReviewRow label="Phone" value={form.claimantPhone} />
                <ReviewRow label="Relationship" value={form.relationship} />
                <ReviewRow label="Security Answers" value={`${Object.values(answers).filter(Boolean).length} of ${questions.length} answered`} />
                <ReviewRow label="Identity Document" value={identityDocumentUrl || "Pending upload reference"} />
                {submittedClaim ? (
                    <ReviewRow label="Claim Status" value={`${submittedClaim.status} (Score: ${submittedClaim.score}%)`} />
                ) : null}
                <div className="flex gap-4 pt-4">
                    <button onClick={onSubmit} disabled={loading} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:opacity-60">
                        {loading ? "Submitting..." : "Submit Claim"}
                        <Check size={16} />
                    </button>
                    <button onClick={onBack} className="text-sm text-slate-500">Back</button>
                </div>
            </div>
        </>
    );
}

function Field({ helper, label, onChange, placeholder, value }) {
    return (
        <div>
            <label className="text-sm font-bold text-slate-800">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
            />
            {helper ? <p className="mt-2 text-xs italic text-slate-500">{helper}</p> : null}
        </div>
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
