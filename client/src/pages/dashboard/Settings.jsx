import {
    Bell,
    Key,
    Lock,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function Settings() {
    const { profile, user } = useAuth();

    return (
        <div className="mx-auto max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-2 text-base text-slate-600">Manage your account, security preferences, and vault configuration.</p>
            </div>

            <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-bold">Profile Information</h2>
                <div className="mt-6 space-y-5">
                    <Field label="Full Name" value={profile?.name || user?.displayName || ""} readOnly />
                    <Field label="Email Address" value={profile?.email || user?.email || ""} readOnly />
                    <Field label="Account Role" value={profile?.role || "USER"} readOnly />
                </div>
            </section>

            <section className="mt-8 rounded-2xl bg-emerald-50 p-8 ring-1 ring-emerald-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900">
                    <Lock size={18} />
                    Vault Master Key
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Your master key is encrypted with zero-knowledge architecture. LegacyVault cannot recover it if lost.
                </p>
                <button className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-bold text-emerald-800 ring-1 ring-emerald-200">
                    <Key size={16} />
                    Export Recovery Phrase
                </button>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Bell size={18} className="text-emerald-700" />
                    Notifications
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                    Email notifications for vault activity, successor updates, and security alerts will be available in a future release.
                </p>
            </section>
        </div>
    );
}

function Field({ label, readOnly, value }) {
    return (
        <div>
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <input
                value={value}
                readOnly={readOnly}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none"
            />
        </div>
    );
}
