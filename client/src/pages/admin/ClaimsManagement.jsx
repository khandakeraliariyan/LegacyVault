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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import { getApiErrorMessage } from "../../services/api";
import {
    approveClaim,
    getAdminDashboard,
    getAuditLogs,
    getPendingClaims,
    rejectClaim,
} from "../../services/admin.service";
import { formatDate, getInitials } from "../../utils/format";

export default function ClaimsManagement() {
    const queryClient = useQueryClient();

    const dashboardQuery = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboard,
    });

    const claimsQuery = useQuery({
        queryKey: ["admin-claims"],
        queryFn: getPendingClaims,
    });

    const auditQuery = useQuery({
        queryKey: ["admin-audit-logs"],
        queryFn: getAuditLogs,
    });

    const approveMutation = useMutation({
        mutationFn: approveClaim,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["admin-claims"] });
            queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
            toast.success("Claim approved");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    const rejectMutation = useMutation({
        mutationFn: (id) => rejectClaim(id, "Rejected by admin review"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["admin-claims"] });
            queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
            toast.success("Claim rejected");
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    if (dashboardQuery.isLoading || claimsQuery.isLoading) {
        return <Loading />;
    }

    const stats = dashboardQuery.data;
    const claims = claimsQuery.data || [];
    const auditLogs = auditQuery.data || [];

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-600" },
        { label: "Pending Claims", value: stats?.pendingClaims ?? 0, badge: "High Priority", icon: ClipboardList, color: "text-teal-600" },
        { label: "Approved Claims", value: stats?.approvedClaims ?? 0, icon: Shield, color: "text-emerald-600" },
        { label: "Rejected Claims", value: stats?.rejectedClaims ?? 0, icon: XCircle, color: "text-slate-500" },
    ];

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Claims Management</h1>
                    <p className="mt-2 text-base text-slate-600">Reviewing and verifying digital asset transfers.</p>
                </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between">
                                <Icon size={22} className={stat.color} />
                                {stat.badge ? <span className="text-[10px] font-bold text-red-600">{stat.badge}</span> : null}
                            </div>
                            <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">{stat.label}</p>
                            <p className="mt-2 text-3xl font-extrabold">{stat.value.toLocaleString()}</p>
                        </article>
                    );
                })}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_300px]">
                <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <h2 className="text-lg font-bold">Pending Claims</h2>
                        <div className="flex gap-3 text-slate-500">
                            <Filter size={18} />
                            <Download size={18} />
                        </div>
                    </div>
                    {claims.length === 0 ? (
                        <p className="p-8 text-sm text-slate-500">No claims awaiting review.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-extrabold uppercase text-slate-500">
                                        <th className="px-6 py-4">Successor</th>
                                        <th className="px-6 py-4">Deceased Account</th>
                                        <th className="px-6 py-4">Date Submitted</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map((claim) => (
                                        <tr key={claim._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="grid size-9 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                        {getInitials(claim.claimantName)}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold">{claim.claimantName}</p>
                                                        <p className="text-xs text-slate-500">{claim.claimantEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-600">{claim.ownerId?.name || claim.ownerId?.email || "—"}</td>
                                            <td className="px-6 py-5 text-slate-600">{formatDate(claim.createdAt)}</td>
                                            <td className="px-6 py-5 font-bold text-emerald-700">{claim.score}%</td>
                                            <td className="px-6 py-5">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveMutation.mutate(claim._id)}
                                                        disabled={approveMutation.isPending}
                                                        className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => rejectMutation.mutate(claim._id)}
                                                        disabled={rejectMutation.isPending}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <aside>
                    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">Recent Activity</h2>
                        </div>
                        <ul className="mt-6 space-y-6">
                            {auditLogs.slice(0, 4).map((log) => (
                                <li key={log._id} className="flex gap-3">
                                    <ActivityIcon action={log.action} />
                                    <div>
                                        <p className="text-sm font-bold">{log.action.replace(/_/g, " ")}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-600">
                                            {log.actorId?.name || "System"} • {log.entity}
                                        </p>
                                        <p className="mt-2 text-[10px] font-bold text-slate-400">{formatDate(log.createdAt)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function ActivityIcon({ action }) {
    if (action.includes("APPROVED")) {
        return <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />;
    }

    if (action.includes("REJECTED") || action.includes("ALERT")) {
        return <AlertTriangle size={18} className="mt-0.5 text-red-600" />;
    }

    if (action.includes("CREATED") || action.includes("REGISTERED")) {
        return <UserCheck size={18} className="mt-0.5 text-blue-600" />;
    }

    return <ClipboardList size={18} className="mt-0.5 text-slate-500" />;
}
