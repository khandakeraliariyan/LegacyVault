import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../../components/auth/AuthCard";
import {
    confirmResetPassword,
    verifyResetCode,
} from "../../services/auth.service";
import { getFriendlyAuthErrorMessage } from "../../utils/firebaseErrors";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const actionCode = searchParams.get("oobCode") || "";

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [isLinkValid, setIsLinkValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const validateCode = async () => {
            if (!actionCode) {
                setLoading(false);
                setIsLinkValid(false);
                return;
            }

            try {
                const email = await verifyResetCode(actionCode);
                setVerifiedEmail(email);
                setIsLinkValid(true);
            } catch (error) {
                toast.error(getFriendlyAuthErrorMessage(error, "This reset link is invalid."));
                setIsLinkValid(false);
            } finally {
                setLoading(false);
            }
        };

        validateCode();
    }, [actionCode]);

    const updateField = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await confirmResetPassword(
                actionCode,
                form.password
            );
            toast.success("Password updated successfully.");
            navigate("/login");
        } catch (error) {
            toast.error(getFriendlyAuthErrorMessage(error, "Unable to reset your password."));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthCard
                title="Reset your Vault Password"
                subtitle="Validating your secure reset link."
            >
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    Checking your reset link...
                </div>
            </AuthCard>
        );
    }

    if (!isLinkValid) {
        return (
            <AuthCard
                title="Reset link unavailable"
                subtitle="This password reset link is invalid, expired, or already used."
            >
                <div className="space-y-5">
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                        Please request a fresh password reset email to continue.
                    </div>
                    <Link
                        to="/forgot-password"
                        className="flex h-12 w-full items-center justify-center rounded-md bg-[#235842] text-base font-semibold text-white transition hover:bg-[#1c4937]"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Choose a new Vault Password"
            subtitle={`Resetting access for ${verifiedEmail}`}
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <PasswordField
                    label="New Vault Password"
                    name="password"
                    value={form.password}
                    onChange={updateField}
                    showValue={showPassword}
                    onToggle={() => setShowPassword((value) => !value)}
                />

                <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={updateField}
                    showValue={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((value) => !value)}
                />

                <button
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-[#235842] text-lg font-semibold text-white transition hover:bg-[#1c4937] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={submitting}
                >
                    <LockKeyhole size={18} />
                    {submitting ? "Saving new password..." : "Save New Password"}
                </button>

                <p className="pt-2 text-center text-base text-slate-500">
                    Remembered it already?{" "}
                    <Link to="/login" className="font-semibold text-slate-900 hover:text-[#235842]">
                        Return to login
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}

function PasswordField({
    label,
    name,
    onChange,
    onToggle,
    showValue,
    value,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
                {label}
            </label>
            <div className="relative">
                <input
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition focus:border-[#235842] focus:ring-2 focus:ring-[#235842]/12"
                    name={name}
                    type={showValue ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    required
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={showValue ? "Hide password" : "Show password"}
                >
                    {showValue ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
        </div>
    );
}
