import clsx from "clsx";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

export default function BrandLogo({
    className,
    iconClassName,
    textClassName,
    text = "LegacyVault",
    to = "/",
    tone = "dark",
}) {
    return (
        <Link
            to={to}
            className={clsx(
                "inline-flex items-center gap-2.5",
                tone === "light" ? "text-white" : "text-slate-900",
                className
            )}
        >
            <img
                src={logo}
                alt="LegacyVault logo"
                className={clsx("h-8 w-8 object-contain", iconClassName)}
            />
            <span
                className={clsx(
                    "text-lg font-bold tracking-[-0.02em]",
                    tone === "light" ? "text-white" : "text-slate-900",
                    textClassName
                )}
            >
                {text}
            </span>
        </Link>
    );
}
