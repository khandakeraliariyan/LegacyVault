import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../../components/auth/AuthCard";
import { requestPasswordReset } from "../../services/auth.service";
import { getFriendlyAuthErrorMessage } from "../../utils/firebaseErrors";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setSent(true);
            toast.success("Password reset email sent.");
        } catch (error) {
            toast.error(getFriendlyAuthErrorMessage(error, "Unable to send reset email."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Reset your Vault Password"
            subtitle="Enter your secure email address and we will send a password reset link."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                        Secure Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={18} />
                        </span>
                        <input
                            className="h-12 w-full rounded-md border border-slate-300 bg-white px-11 text-base text-slate-900 outline-none transition focus:border-[#235842] focus:ring-2 focus:ring-[#235842]/12"
                            type="email"
                            placeholder="jane@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                </div>

                {sent ? (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[#235842]">
                        Reset instructions have been sent to <span className="font-semibold">{email}</span>.
                    </div>
                ) : null}

                <button
                    className="flex h-13 w-full items-center justify-center rounded-md bg-[#235842] text-lg font-semibold text-white transition hover:bg-[#1c4937] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Sending reset link..." : "Send Reset Link"}
                </button>

                <div className="pt-1 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
}
