export default function DashboardFooter() {
    return (
        <footer className="flex shrink-0 flex-col gap-4 border-t border-slate-200 bg-white px-6 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>© 2024 LegacyVault. All rights reserved. Secure & Encrypted.</p>
            <nav className="flex flex-wrap gap-6">
                <a href="#privacy" className="hover:text-emerald-700">Privacy Policy</a>
                <a href="#terms" className="hover:text-emerald-700">Terms of Service</a>
                <a href="#security" className="hover:text-emerald-700">Security Audit</a>
                <a href="#support" className="hover:text-emerald-700">Support</a>
            </nav>
        </footer>
    );
}
