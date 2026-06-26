import {
    Bell,
    CheckCircle2,
    FileLock2,
    Fingerprint,
    KeyRound,
    Lock,
    MessageSquareText,
    Settings,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import {
    Link,
} from "react-router-dom";

const featureCards = [
    {
        icon: FileLock2,
        title: "Secure Document Vault",
        text: "Store property deeds, insurance policies, and digital access keys in an AES-256 encrypted environment.",
        large: true,
    },
    {
        icon: ShieldCheck,
        title: "Verification Questions",
        text: "Set multi-factor verification hurdles that only your chosen successor can answer truthfully.",
    },
    {
        icon: Users,
        title: "Trusted Successor",
        text: "Nominate individuals who will receive your vault contents after a predetermined period of inactivity.",
    },
    {
        icon: Sparkles,
        title: "Final Wishes",
        text: "Outline your specific end-of-life preferences and healthcare directives clearly for your loved ones.",
    },
    {
        icon: MessageSquareText,
        title: "Future Messages",
        text: "Write letters or record videos that will be delivered on anniversaries or life milestones.",
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <Header />
            <Hero />
            <TrustStrip />
            <Features />
            <Process />
            <SecurityBand />
            <Testimonials />
            <Faq />
            <Cta />
            <Footer />
        </main>
    );
}

function Header() {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/95 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
                <Link to="/" className="font-bold text-emerald-800">
                    LegacyVault
                </Link>
                <nav className="hidden items-center gap-10 text-xs font-medium text-slate-700 md:flex">
                    <a href="#features">Features</a>
                    <a href="#process">How It Works</a>
                    <a href="#security">Security</a>
                    <Link
                        to="/register"
                        className="rounded-lg bg-emerald-800 px-5 py-2 font-bold text-white"
                    >
                        Quick Add
                    </Link>
                </nav>
                <div className="flex items-center gap-4 text-slate-700">
                    <Bell size={16} />
                    <Settings size={16} />
                    <Link
                        to="/login"
                        className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f0c7a8,#19382f)] text-xs font-bold text-white"
                    >
                        A
                    </Link>
                </div>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section className="bg-[#eef4ff]">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_0.95fr] md:py-20">
                <div>
                    <h1 className="max-w-xl text-5xl font-extrabold leading-[1.03] tracking-normal text-slate-950 md:text-6xl">
                        Protect Your Digital Legacy.
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                        Store important documents, final wishes, and future messages that are securely transferred to your trusted successor after successful verification.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/register"
                            className="rounded-xl bg-emerald-700 px-9 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/15"
                        >
                            Create Vault
                        </Link>
                        <a
                            href="#features"
                            className="rounded-xl border border-slate-200 bg-white px-9 py-4 text-sm font-bold text-slate-800"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-xl shadow-slate-200">
                    <TabletVault />
                </div>
            </div>
        </section>
    );
}

function TabletVault() {
    return (
        <div className="relative aspect-[1.22] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_75%_10%,#504436,#151512_34%,#070807_72%)]">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(160deg,rgba(255,255,255,.16),transparent_42%),linear-gradient(0deg,#161b18,#2f332e)]" />
            <div className="absolute left-[18%] top-[18%] h-[58%] w-[64%] -rotate-6 rounded-xl border border-emerald-300/30 bg-[#061d17] p-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-100/10 pb-3 text-[10px] text-emerald-100">
                    <span>LegacyVault</span>
                    <span>Secured</span>
                </div>
                <div className="mt-5 grid grid-cols-[0.9fr_1.1fr] gap-5">
                    <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4">
                        <Lock className="text-emerald-300" size={34} />
                        <div className="mt-4 h-2 rounded bg-emerald-200/30" />
                        <div className="mt-2 h-2 w-2/3 rounded bg-emerald-200/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({
                            length: 9,
                        }).map((_, index) => (
                            <span
                                key={index}
                                className="h-7 rounded border border-emerald-300/20 bg-emerald-100/5"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrustStrip() {
    return (
        <section className="px-5 py-14 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
                Endorsed by Security Experts & Legal Partners
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-12 gap-y-3 text-lg font-medium text-slate-500">
                <span>FORTRESS</span>
                <span>LEGAL.IO</span>
                <span>AEGIS</span>
                <span>SENTINEL</span>
                <span>VERITAS</span>
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="features" className="mx-auto max-w-7xl px-5 pb-16">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Comprehensive Legacy Management</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    Everything you need to ensure your digital life is passed on exactly as you intended, with absolute security.
                </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
                {featureCards.map((feature) => (
                    <FeatureCard key={feature.title} {...feature} />
                ))}
            </div>
        </section>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    text,
    large,
}) {
    return (
        <article className={`rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-200 ${large ? "md:col-span-2 md:grid md:grid-cols-[1fr_0.95fr] md:gap-8" : ""}`}>
            <div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon size={18} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
            {large ? (
                <div className="mt-6 aspect-[1.32] rounded-lg bg-[radial-gradient(circle_at_53%_18%,#e9d3aa,#584c3c_38%,#121716_80%)] md:mt-0">
                    <div className="flex h-full items-center justify-center">
                        <KeyRound size={72} className="rotate-45 text-amber-100/70" />
                    </div>
                </div>
            ) : null}
        </article>
    );
}

function Process() {
    return (
        <section id="process" className="bg-[#eef4ff]">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_0.95fr]">
                <div>
                    <h2 className="text-3xl font-bold">The Process of Peace of Mind.</h2>
                    <ol className="mt-8 space-y-6">
                        {[
                            ["Create Your Vault", "Upload your critical digital assets and documents to your private, encrypted storage space."],
                            ["Appoint Your Successor", "Designate the individuals you trust to handle your legacy and define their access levels."],
                            ["Define Verification Triggers", "Establish the conditions, such as inactive periods or specific legal proofs, for vault transfer."],
                        ].map(([title, text], index) => (
                            <li key={title} className="flex gap-4">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                    {index + 1}
                                </span>
                                <div>
                                    <h3 className="font-bold">{title}</h3>
                                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="aspect-[1.02] rounded-2xl bg-[linear-gradient(135deg,#f6f7f4,#cfd7d4)] p-10">
                    <div className="relative h-full">
                        <div className="absolute bottom-8 left-8 right-8 h-44 rounded-lg bg-slate-300 shadow-2xl">
                            <div className="absolute inset-y-5 right-8 w-36 rounded bg-white/80 shadow-inner" />
                            <div className="absolute inset-y-5 right-14 w-px bg-slate-400/60" />
                        </div>
                        <div className="absolute right-16 top-8 h-48 w-20 rotate-12 rounded-full bg-[linear-gradient(#f2c1a4,#d79a7b)]" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SecurityBand() {
    return (
        <section id="security" className="bg-slate-800 px-5 py-16 text-white">
            <div className="mx-auto max-w-7xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/30 px-4 py-2 text-xs font-bold text-emerald-200">
                    <Lock size={14} />
                    Zero-Knowledge Architecture
                </span>
                <h2 className="mt-5 text-3xl font-extrabold">
                    Your data is yours alone. Even we can't see it.
                </h2>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {[
                        ["End-to-End Encryption", "We use AES-256 and RSA-4096 encryption protocols to ensure your data is unreadable to anyone without your unique keys."],
                        ["Biometric Authentication", "Access your vault using hardware-level biometric verification including FaceID and Fingerprint scanning."],
                        ["Admin Verification", "Optional secondary verification through a network of accredited legal professionals for high-value asset transfer."],
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                            <h3 className="font-bold">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-3">
            {[
                ["Arthur Sterling", "Retired Architect", "LegacyVault provided the quiet confidence I needed that my family wouldn't have to scramble for passwords and documents when I'm gone. It's an act of love."],
                ["Elena Rodriguez", "Software Engineer", "As a digital nomad, my assets are scattered across dozens of platforms. LegacyVault is the only way I can centralize access for my siblings if something happens."],
            ].map(([name, role, quote]) => (
                <article key={name} className="rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                    <div className="text-emerald-700">★★★★★</div>
                    <p className="mt-5 text-sm italic leading-6 text-slate-700">"{quote}"</p>
                    <div className="mt-6 flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                            {name.slice(0, 1)}
                        </span>
                        <div>
                            <p className="text-sm font-bold">{name}</p>
                            <p className="text-xs text-slate-500">{role}</p>
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}

function Faq() {
    return (
        <section className="mx-auto max-w-3xl px-5 py-10 text-center">
            <h2 className="text-xl font-medium">Common Questions</h2>
            <div className="mt-8 space-y-4 text-left">
                <details className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200" open>
                    <summary className="cursor-pointer font-medium">What happens if I forget my master key?</summary>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        Because we use zero-knowledge encryption, we do not store your master key. We recommend using a recovery phrase stored in a physical safety deposit box as a failsafe.
                    </p>
                </details>
                <details className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <summary className="cursor-pointer font-medium">How do you verify a successor's claim?</summary>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        Claims can combine inactivity windows, identity checks, trusted contacts, and optional legal professional review.
                    </p>
                </details>
            </div>
        </section>
    );
}

function Cta() {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="rounded-2xl bg-emerald-700 px-6 py-16 text-center text-white">
                <h2 className="text-3xl font-extrabold">Your legacy deserves permanence.</h2>
                <p className="mt-4 text-sm text-emerald-50">
                    Start your secure digital vault today. The first 10GB is free, forever.
                </p>
                <Link
                    to="/register"
                    className="mt-10 inline-flex rounded-xl bg-white px-12 py-4 text-base font-bold text-slate-900"
                >
                    Get Started Free
                </Link>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-xs text-slate-500 md:flex-row md:items-end md:justify-between">
            <div>
                <p className="font-bold text-slate-900">LegacyVault</p>
                <p className="mt-2">© 2024 LegacyVault. All rights reserved. Secure & Encrypted.</p>
            </div>
            <nav className="flex flex-wrap gap-7">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#security">Security Audit</a>
                <a href="#support">Support</a>
            </nav>
        </footer>
    );
}
