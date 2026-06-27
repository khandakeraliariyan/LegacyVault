import { Link } from "react-router-dom";

import BrandLogo from "../common/BrandLogo";
import AuthPanel from "./AuthPanel";

export default function AuthCard({
    title,
    subtitle,
    children,
}) {
    return (
        <main className="public-shell py-10 lg:py-14">
            <section className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                <div className="grid lg:grid-cols-[0.9fr_1.25fr]">
                    <AuthPanel />

                    <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
                        <div className="mx-auto max-w-xl">
                            <div className="mb-8 lg:hidden">
                                <BrandLogo
                                    iconClassName="h-7 w-7"
                                    textClassName="text-lg"
                                />
                                <p className="mt-2 text-sm text-slate-500">
                                    Establish your secure digital legacy.
                                </p>
                            </div>

                            <header className="mb-8">
                                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                                    {title}
                                </h1>
                                <p className="mt-3 text-lg text-slate-500">
                                    {subtitle}
                                </p>
                            </header>

                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
