import {
    Bell,
    Key,
    Lock,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";
import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import { requestPasswordReset } from "../../services/auth.service";
import { getApiErrorMessage } from "../../services/api";

export default function Settings() {
    const { profile, user, refreshProfile } = useAuth();
    const [sendingReset, setSendingReset] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleResetRequest = async () => {
        const email = profile?.email || user?.email;

        if (!email) {
            toast.error("No account email found.");
            return;
        }

        setSendingReset(true);

        try {
            await requestPasswordReset(email);
            toast.success("Password reset link sent.");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to send reset link."));
        } finally {
            setSendingReset(false);
        }
    };

    const handleRefreshProfile = async () => {
        setRefreshing(true);

        try {
            await refreshProfile();
            toast.success("Profile refreshed.");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to refresh profile."));
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <DashboardPageHeader
                title="Settings"
                description="Manage your account profile, security access, and dashboard configuration."
                action={
                    <button
                        onClick={handleRefreshProfile}
                        disabled={refreshing}
                        className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCw size={15} />
                        {refreshing ? "Refreshing..." : "Refresh Profile"}
                    </button>
                }
            />

            <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-bold">Profile Information</h2>
                <div className="mt-6 space-y-5">
                    <Field label="Full Name" value={profile?.name || user?.displayName || ""} readOnly />
                    <Field label="Email Address" value={profile?.email || user?.email || ""} readOnly />
                    <Field label="Account Role" value={profile?.role || "USER"} readOnly />
                    <Field label="Joined" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US") : "Unavailable"} readOnly />
                </div>
            </section>

            <section className="mt-8 rounded-2xl bg-emerald-50 p-8 ring-1 ring-emerald-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900">
                    <Lock size={18} />
                    Security Actions
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Use these actions to refresh your secure profile state or send a password reset email to your primary inbox.
                </p>
                <button
                    onClick={handleResetRequest}
                    disabled={sendingReset}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-bold text-emerald-800 ring-1 ring-emerald-200 disabled:opacity-60"
                >
                    <Key size={16} />
                    {sendingReset ? "Sending Reset Link..." : "Send Password Reset Link"}
                </button>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Bell size={18} className="text-emerald-700" />
                    Notifications
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                    Notification preferences are not configurable yet in this release. System emails still send automatically for authentication and claim-relevant flows.
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
