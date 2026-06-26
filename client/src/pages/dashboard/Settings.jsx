import {
    Bell,
    Key,
    Lock,
    Shield,
    User,
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        successor: true,
        security: true,
    });

    return (
        <div className="mx-auto max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-2 text-base text-slate-600">Manage your account, security preferences, and vault configuration.</p>
            </div>

            <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <User size={18} className="text-emerald-700" />
                    Profile Information
                </h2>
                <div className="mt-6 space-y-5">
                    <Field label="Full Name" defaultValue="Alex Sterling" />
                    <Field label="Email Address" defaultValue="alex@legacyvault.io" type="email" />
                    <Field label="Phone Number" defaultValue="+1 (555) 012-3456" />
                </div>
                <button className="mt-6 h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                    Save Changes
                </button>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Lock size={18} className="text-emerald-700" />
                    Security
                </h2>
                <div className="mt-6 space-y-5">
                    <Field label="Current Password" type="password" defaultValue="••••••••" />
                    <Field label="New Password" type="password" placeholder="Enter new password" />
                    <Field label="Confirm New Password" type="password" placeholder="Confirm new password" />
                </div>
                <button className="mt-6 h-12 rounded-xl border border-emerald-700 px-8 font-bold text-emerald-800">
                    Update Password
                </button>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Bell size={18} className="text-emerald-700" />
                    Notifications
                </h2>
                <div className="mt-6 space-y-4">
                    {[
                        ["email", "Email notifications for vault activity"],
                        ["successor", "Successor invitation and status updates"],
                        ["security", "Security alerts and login attempts"],
                    ].map(([key, label]) => (
                        <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                            <input
                                type="checkbox"
                                checked={notifications[key]}
                                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                                className="size-4 accent-emerald-700"
                            />
                        </label>
                    ))}
                </div>
            </section>

            <section className="mt-8 rounded-2xl bg-emerald-50 p-8 ring-1 ring-emerald-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900">
                    <Shield size={18} />
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
        </div>
    );
}

function Field({ defaultValue, label, placeholder, type = "text" }) {
    return (
        <div>
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <input
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
            />
        </div>
    );
}
