import {
    Eye,
    Lock,
    ShieldCheck,
    BadgeCheck,
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

function BrandMark() {
    return (
        <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white"
        >
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Lock size={18} />
            </span>
            LegacyVault
        </Link>
    );
}

function VaultDial() {
    return (
        <div className="relative mx-auto flex size-64 items-center justify-center bg-[radial-gradient(circle_at_center,#0d5f46_0%,#041d16_42%,#020907_70%)] shadow-2xl">
            <div className="absolute size-48 rounded-full border border-emerald-200/20 bg-[conic-gradient(from_15deg,#111,#73877d,#0b211a,#303b36,#111)] p-2">
                <div className="flex h-full items-center justify-center rounded-full border border-black/60 bg-[radial-gradient(circle,#143b30,#06120f_62%,#020605)]">
                    <div className="size-20 rounded-full border-8 border-zinc-700 bg-[radial-gradient(circle,#2d3e39,#07100d)] shadow-inner" />
                </div>
            </div>
            <div className="absolute size-32 rounded-full border border-emerald-300/30" />
        </div>
    );
}

export default function Login() {
    const navigate =
        useNavigate();
    const {
        login,
        googleSignIn,
    } = useAuth();
    const [form, setForm] =
        useState({
            email: "",
            password: "",
        });
    const [loading, setLoading] =
        useState(false);

    const updateField =
        (event) => {
            setForm((current) => ({
                ...current,
                [event.target.name]: event.target.value,
            }));
        };

    const submitLogin =
        async (event) => {
            event.preventDefault();
            setLoading(true);

            try {
                await login(
                    form.email,
                    form.password
                );
                toast.success("Welcome back to your vault.");
                navigate("/dashboard");
            } catch (error) {
                toast.error(error?.message ?? "Unable to sign in.");
            } finally {
                setLoading(false);
            }
        };

    const submitGoogle =
        async () => {
            setLoading(true);

            try {
                await googleSignIn();
                toast.success("Signed in with Google.");
                navigate("/dashboard");
            } catch (error) {
                toast.error(error?.message ?? "Google sign-in failed.");
            } finally {
                setLoading(false);
            }
        };

    return (
        <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
            <section className="hidden bg-[linear-gradient(155deg,#006f51,#003628_58%,#01251c)] px-14 py-12 text-white lg:flex lg:flex-col">
                <BrandMark />

                <div className="flex flex-1 flex-col justify-center">
                    <VaultDial />

                    <div className="mt-12 max-w-xl">
                        <h1 className="text-xl font-bold">
                            Secure Your Digital Legacy for Eternity
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-emerald-100">
                            Protect your digital assets, documents, and final wishes with military-grade AES-256 encryption. Your legacy is safe in our state-of-the-art digital vault.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-8 text-base font-bold">
                            <span className="inline-flex items-center gap-2">
                                <BadgeCheck size={20} className="text-emerald-200" />
                                ISO 27001 Certified
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck size={20} className="text-emerald-200" />
                                Zero-Knowledge Architecture
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-base text-emerald-200/80">
                    Trusted by over 50,000 families worldwide.
                </p>
            </section>

            <section className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-10 lg:hidden">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
                        >
                            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <Lock size={18} />
                            </span>
                            LegacyVault
                        </Link>
                    </div>

                    <h2 className="text-xl font-medium text-slate-950">
                        Welcome back
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        Please enter your details to access your vault.
                    </p>

                    <form
                        className="mt-9 space-y-5"
                        onSubmit={submitLogin}
                    >
                        <label className="block text-sm font-medium text-slate-800">
                            Email Address
                            <input
                                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                value={form.email}
                                onChange={updateField}
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-slate-800">
                            <span className="flex items-center justify-between">
                                Password
                                <Link to="/login" className="text-emerald-700">
                                    Forgot Password?
                                </Link>
                            </span>
                            <span className="relative mt-2 block">
                                <input
                                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={updateField}
                                    required
                                />
                                <Eye
                                    size={18}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </span>
                        </label>

                        <label className="flex items-center gap-3 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                className="size-4 rounded border-slate-300 accent-emerald-700"
                            />
                            Remember me for 30 days
                        </label>

                        <button
                            className="h-12 w-full rounded-xl bg-emerald-700 text-base font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Opening Vault..." : "Sign In to Vault"}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4 text-sm font-medium text-slate-400">
                        <span className="h-px flex-1 bg-slate-200" />
                        OR CONTINUE WITH
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <button
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-800 transition hover:border-slate-400"
                        type="button"
                        onClick={submitGoogle}
                        disabled={loading}
                    >
                        <span className="text-lg font-bold text-blue-600">G</span>
                        Continue with Google
                    </button>

                    <p className="mt-8 text-center text-base text-slate-700">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-bold text-emerald-700">
                            Register now
                        </Link>
                    </p>

                    <footer className="mt-14 border-t border-slate-200 pt-9">
                        <nav className="flex justify-center gap-7 text-sm text-slate-500">
                            <Link to="/">Privacy Policy</Link>
                            <Link to="/">Terms of Service</Link>
                            <Link to="/">Security Audit</Link>
                        </nav>
                    </footer>
                </div>
            </section>
        </main>
    );
}
