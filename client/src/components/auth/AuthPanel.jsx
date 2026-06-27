import { Infinity, LockKeyhole, ShieldCheck } from "lucide-react";

import BrandLogo from "../common/BrandLogo";

const trustPoints = [
    {
        icon: ShieldCheck,
        title: "Institutional Grade Protection",
        text: "Military-grade encryption securing your most valuable digital assets.",
    },
    {
        icon: LockKeyhole,
        title: "Zero-Knowledge Architecture",
        text: "We never have access to your keys or your data. Complete privacy.",
    },
    {
        icon: Infinity,
        title: "Generational Continuity",
        text: "Seamlessly transfer access to designated heirs when the time comes.",
    },
];

export default function AuthPanel() {
    return (
        <aside className="hidden bg-[linear-gradient(180deg,#2b5c46_0%,#224f3d_100%)] px-8 py-8 text-white lg:flex lg:min-h-[680px] lg:flex-col">
            <div>
                <BrandLogo
                    tone="light"
                    iconClassName="h-7 w-7 brightness-[3]"
                    textClassName="text-[1.25rem] text-white"
                />
                <p className="mt-3 text-sm text-emerald-100/80">
                    Establish your secure digital legacy.
                </p>
            </div>

            <div className="mt-14 space-y-8">
                {trustPoints.map((point) => {
                    const Icon = point.icon;

                    return (
                        <div key={point.title} className="flex items-start gap-4">
                            <div className="rounded-lg bg-white/10 p-2 text-emerald-100">
                                <Icon size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold tracking-[-0.02em]">
                                    {point.title}
                                </h3>
                                <p className="mt-2 max-w-xs text-sm leading-6 text-emerald-100/78">
                                    {point.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto border-t border-white/16 pt-6 text-sm font-medium text-emerald-100">
                SOC 2 Type II Certified Vault
            </div>
        </aside>
    );
}
