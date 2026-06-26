import {
    Eye,
    Lock,
    Mail,
    Shield,
    User,
} from "lucide-react";
import {
    useState,
} from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";
import { mapFirebaseAuthError } from "../../utils/firebaseErrors";

export default function Register() {
    const navigate =
        useNavigate();
    const {
        register,
        googleSignIn,
    } = useAuth();
    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptedTerms: false,
        });
    const [loading, setLoading] =
        useState(false);

    const updateField =
        (event) => {
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

    const createVault =
        async (event) => {
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
                toast.error(mapFirebaseAuthError(error) || getApiErrorMessage(error, "Unable to create your vault."));
            } finally {
                setLoading(false);
            }
        };

    const createWithGoogle =
        async () => {
            setLoading(true);

            try {
                await googleSignIn();
                toast.success("Your Google vault is ready.");
                navigate("/dashboard");
            } catch (error) {
                toast.error(mapFirebaseAuthError(error) || getApiErrorMessage(error, "Google sign-up failed."));
            } finally {
                setLoading(false);
            }
        };

    return (
        <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.18fr_0.82fr]">
            <section className="hidden bg-emerald-700 px-14 py-12 text-white lg:flex lg:flex-col">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-bold"
                >
                    <Shield size={18} />
                    LegacyVault
                </Link>

                <div className="flex flex-1 flex-col justify-center">
                    <h1 className="max-w-xl text-6xl font-extrabold leading-[1.05] tracking-normal">
                        The final word in digital permanence.
                    </h1>
                    <p className="mt-8 max-w-xl text-xl font-medium leading-8 text-emerald-50">
                        Secure your digital estate, pass on your wisdom, and ensure your legacy is preserved with bank-grade encryption and military-standard redundancy.
                    </p>

                    <div className="mt-14 grid max-w-lg grid-cols-2 gap-12">
                        <div>
                            <p className="text-2xl font-extrabold">AES-256</p>
                            <p className="mt-2 text-sm font-bold uppercase text-emerald-100">
                                Encryption Standard
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold">99.9%</p>
                            <p className="mt-2 text-sm font-bold uppercase text-emerald-100">
                                Data Resilience
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex -space-x-3">
                    {["A", "E", "R"].map((initial, index) => (
                        <span
                            key={initial}
                            className="flex size-10 items-center justify-center rounded-full border-2 border-emerald-700 bg-white text-sm font-bold text-emerald-800"
                            style={{
                                transform: `translateY(${index % 2 ? 4 : 0}px)`,
                            }}
                        >
                            {initial}
                        </span>
                    ))}
                </div>
            </section>

            <section className="flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">
                    <div className="mb-10 lg:hidden">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
                        >
                            <Shield size={18} />
                            LegacyVault
                        </Link>
                    </div>

                    <h2 className="text-4xl font-bold text-slate-950">
                        Create your vault
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        Start securing your digital legacy in minutes.
                    </p>

                    <form
                        className="mt-9 space-y-5"
                        onSubmit={createVault}
                    >
                        <AuthInput
                            icon={<User size={17} />}
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={updateField}
                            required
                        />
                        <AuthInput
                            icon={<Mail size={17} />}
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            value={form.email}
                            onChange={updateField}
                            required
                        />
                        <AuthInput
                            icon={<Lock size={17} />}
                            label="Vault Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={updateField}
                            after={<Eye size={17} />}
                            required
                        />
                        <div>
                            <div className="h-1 rounded-full bg-slate-200">
                                <div className="h-full w-3/4 rounded-full bg-blue-300" />
                            </div>
                            <p className="mt-1 text-right text-xs font-bold text-slate-700">
                                Weak
                            </p>
                        </div>
                        <AuthInput
                            icon={<Shield size={17} />}
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={updateField}
                            required
                        />

                        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                            <input
                                className="mt-1 size-4 rounded border-slate-300 accent-emerald-700"
                                type="checkbox"
                                name="acceptedTerms"
                                checked={form.acceptedTerms}
                                onChange={updateField}
                                required
                            />
                            <span>
                                I agree to the{" "}
                                <Link to="/" className="font-bold text-emerald-700">
                                    Terms of Service
                                </Link>{" "}
                                and acknowledge the{" "}
                                <Link to="/" className="font-bold text-emerald-700">
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>

                        <button
                            className="mt-8 h-14 w-full rounded-xl bg-[linear-gradient(90deg,#006f51,#14705b)] text-lg font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating Vault..." : "Create Secure Vault"}
                        </button>
                    </form>

                    <div className="my-5 flex items-center gap-4 text-xs font-bold text-slate-500">
                        <span className="h-px flex-1 bg-slate-200" />
                        OR
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <button
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-800 transition hover:border-slate-400"
                        type="button"
                        onClick={createWithGoogle}
                        disabled={loading}
                    >
                        <span className="text-lg font-bold text-blue-600">G</span>
                        Continue with Google
                    </button>

                    <p className="mt-16 text-center text-sm text-slate-600">
                        Already have a vault?{" "}
                        <Link to="/login" className="font-bold text-emerald-800">
                            Log in to Access
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

function AuthInput({
    after,
    icon,
    label,
    ...inputProps
}) {
    return (
        <label className="block text-sm font-medium text-slate-800">
            {label}
            <span className="relative mt-2 block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    {icon}
                </span>
                <input
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-12 text-base outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                    {...inputProps}
                />
                {after ? (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                        {after}
                    </span>
                ) : null}
            </span>
        </label>
    );
}
