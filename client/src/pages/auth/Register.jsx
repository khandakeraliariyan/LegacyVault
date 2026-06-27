import {
    Eye,
    EyeOff,
    UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../../components/auth/AuthCard";
import useAuth from "../../hooks/useAuth";
import { getFriendlyAuthErrorMessage } from "../../utils/firebaseErrors";

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        googleSignIn,
    } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (event) => {
        const {
            name,
            type,
            checked,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const createVault = async (event) => {
        event.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register(
                form.name,
                form.email,
                form.password
            );
            toast.success("Your secure vault is ready.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(getFriendlyAuthErrorMessage(error, "Unable to create your vault."));
        } finally {
            setLoading(false);
        }
    };

    const createWithGoogle = async () => {
        setLoading(true);

        try {
            await googleSignIn();
            toast.success("Your Google vault is ready.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(getFriendlyAuthErrorMessage(error, "Google sign-up failed."));
        } finally {
            setLoading(false);
        }
    };

    const passwordState = getPasswordStrength(form.password);

    return (
        <AuthCard
            title="Create your Vault"
            subtitle="Join thousands of others securing their digital future."
        >
            <button
                className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white text-base font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={createWithGoogle}
                disabled={loading}
            >
                <GoogleMark />
                Continue with Google
            </button>

            <div className="my-8 flex items-center gap-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-medium uppercase tracking-[0.12em] text-slate-400">
                    Or register with email
                </span>
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-5" onSubmit={createVault}>
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        label="Full Legal Name"
                        name="name"
                        placeholder="e.g. Jane Doe"
                        value={form.name}
                        onChange={updateField}
                        required
                    />
                    <FormField
                        label="Secure Email Address"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={updateField}
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                        Vault Password
                    </label>
                    <div className="relative">
                        <input
                            className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition focus:border-[#235842] focus:ring-2 focus:ring-[#235842]/12"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={updateField}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                        <div className="flex max-w-[200px] flex-1 gap-1">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <span
                                    key={index}
                                    className={`h-1 flex-1 rounded-full ${index < passwordState.level
                                        ? passwordState.barClass
                                        : "bg-slate-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className={`text-sm font-medium ${passwordState.textClass}`}>
                            {passwordState.label}
                        </span>
                    </div>
                </div>

                <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={updateField}
                    required
                />

                <label className="flex items-start gap-3 pt-1 text-sm text-slate-600">
                    <input
                        className="mt-1 size-4 rounded border-slate-300 accent-[#235842]"
                        type="checkbox"
                        name="acceptedTerms"
                        checked={form.acceptedTerms}
                        onChange={updateField}
                        required
                    />
                    <span>
                        I agree to the{" "}
                        <Link to="/" className="font-medium text-[#235842] hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/" className="font-medium text-[#235842] hover:underline">
                            Privacy Policy
                        </Link>
                        .
                    </span>
                </label>

                <div className="pt-5">
                    <button
                        className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-[#235842] text-lg font-semibold text-white transition hover:bg-[#1c4937] disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={loading}
                    >
                        <UserRoundPlus size={18} />
                        {loading ? "Creating Secure Vault..." : "Create Secure Vault"}
                    </button>
                </div>

                <p className="pt-2 text-center text-base text-slate-500">
                    Already have a vault?{" "}
                    <Link to="/login" className="font-semibold text-slate-900 hover:text-[#235842]">
                        Log in here
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}

function FormField({ label, ...inputProps }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
                {label}
            </label>
            <input
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-[#235842] focus:ring-2 focus:ring-[#235842]/12"
                {...inputProps}
            />
        </div>
    );
}

function GoogleMark() {
    return (
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function getPasswordStrength(password) {
    if (!password) {
        return {
            label: "Enter password",
            level: 0,
            barClass: "bg-slate-200",
            textClass: "text-slate-500",
        };
    }

    if (password.length < 6) {
        return {
            label: "Weak",
            level: 1,
            barClass: "bg-rose-500",
            textClass: "text-rose-500",
        };
    }

    if (password.length < 10) {
        return {
            label: "Fair",
            level: 2,
            barClass: "bg-amber-500",
            textClass: "text-amber-600",
        };
    }

    if (password.length < 14) {
        return {
            label: "Good",
            level: 3,
            barClass: "bg-emerald-300",
            textClass: "text-[#235842]",
        };
    }

    return {
        label: "Institutional",
        level: 4,
        barClass: "bg-[#235842]",
        textClass: "font-semibold text-[#235842]",
    };
}
