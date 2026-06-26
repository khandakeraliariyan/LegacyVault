import {
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Download,
    Filter,
    Plus,
    Shield,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react";

const stats = [
    { label: "Total Users", value: "42,891", change: "+ 12%", icon: Users, color: "text-blue-600" },
    { label: "Pending Claims", value: "156", badge: "High Priority", icon: ClipboardList, color: "text-teal-600" },
    { label: "Approved Claims", value: "8,204", icon: Shield, color: "text-emerald-600" },
    { label: "Rejected Claims", value: "432", icon: XCircle, color: "text-slate-500" },
];

const pendingClaims = [
    {
        name: "Eleanor Rigby",
        email: "jonathan.rigby@vault.com",
        deceased: "Eleanor Vance",
        date: "Oct 12, 2024",
        status: "AWAITING VERIFICATION",
        statusClass: "bg-blue-50 text-blue-700",
        initials: "ER",
        avatarClass: "bg-blue-100 text-blue-700",
    },
    {
        name: "Marcus Cooper",
        email: "linda.v@cloudmail.net",
        deceased: "Marcus Thorne",
        date: "Oct 11, 2024",
        status: "CRITICAL REVIEW",
        statusClass: "text-red-600 font-extrabold",
        initials: "MC",
        avatarClass: "bg-emerald-100 text-emerald-700",
    },
    {
        name: "Alice Schmidt",
        email: "robert.s@provider.com",
        deceased: "Robert Schmidt",
        date: "Oct 10, 2024",
        status: "PROCESSING",
        statusClass: "bg-slate-100 text-slate-700",
        initials: "AS",
        avatarClass: "bg-blue-900 text-white",
    },
];

const activity = [
    { title: "Claim #8204 Approved", detail: "Successor: Sarah Jenkins. Verified by System Audit.", time: "2 MINUTES AGO", icon: CheckCircle2, color: "text-emerald-600" },
    { title: "New Security Audit Alert", detail: "Multiple login attempts detected from IP 192.168.1.1.", time: "14 MINUTES AGO", icon: AlertTriangle, color: "text-red-600" },
    { title: "New Admin Registered", detail: "David Vance joined the System Operations team.", time: "1 HOUR AGO", icon: UserCheck, color: "text-blue-600" },
    { title: "System Backup Completed", detail: "Digital Vault encrypted and synced to secondary nodes.", time: "4 HOURS AGO", icon: ClipboardList, color: "text-slate-500" },
];

export default function ClaimsManagement() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Claims Management</h1>
                    <p className="mt-2 text-base text-slate-600">Reviewing and verifying digital asset transfers.</p>
                </div>
                <button className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white">
                    <Plus size={18} />
                    Quick Add
                </button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between">
                                <Icon size={22} className={stat.color} />
                                {stat.change ? (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{stat.change}</span>
                                ) : null}
                                {stat.badge ? (
                                    <span className="text-[10px] font-bold text-red-600">{stat.badge}</span>
                                ) : null}
                            </div>
                            <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">{stat.label}</p>
                            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
                        </article>
                    );
                })}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_300px]">
                <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <h2 className="text-lg font-bold">Pending Claims</h2>
                        <div className="flex gap-3 text-slate-500">
                            <Filter size={18} className="cursor-pointer hover:text-emerald-700" />
                            <Download size={18} className="cursor-pointer hover:text-emerald-700" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-extrabold uppercase text-slate-500">
                                    <th className="px-6 py-4">Successor</th>
                                    <th className="px-6 py-4">Deceased Account</th>
                                    <th className="px-6 py-4">Date Submitted</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingClaims.map((claim) => (
                                    <tr key={claim.email} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${claim.avatarClass}`}>
                                                    {claim.initials}
                                                </span>
                                                <div>
                                                    <p className="font-bold">{claim.name}</p>
                                                    <p className="text-xs text-slate-500">{claim.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600">{claim.deceased}</td>
                                        <td className="px-6 py-5 text-slate-600">{claim.date}</td>
                                        <td className="px-6 py-5">
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${claim.statusClass}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between p-6 text-sm text-slate-500">
                        <span>Showing 3 of 158 pending claims</span>
                        <div className="flex gap-2">
                            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </section>

                <aside>
                    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">Recent Activity</h2>
                            <button className="text-xs font-bold text-emerald-700">View All</button>
                        </div>
                        <ul className="mt-6 space-y-6">
                            {activity.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <li key={item.title} className="flex gap-3">
                                        <Icon size={18} className={`mt-0.5 shrink-0 ${item.color}`} />
                                        <div>
                                            <p className="text-sm font-bold">{item.title}</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p>
                                            <p className="mt-2 text-[10px] font-bold text-slate-400">{item.time}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}
