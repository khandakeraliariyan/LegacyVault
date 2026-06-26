import { Activity, ClipboardList, FileSearch, LayoutDashboard, Settings, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../components/common/Loading";
import { getAuditLogs } from "../../services/admin.service";
import { formatDate } from "../../utils/format";

function AdminPlaceholder({ children, description, icon: Icon, title }) {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon size={32} />
                </span>
                <h1 className="mt-6 text-2xl font-bold">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
            {children}
        </div>
    );
}

export function AdminDashboard() {
    return (
        <AdminPlaceholder
            icon={LayoutDashboard}
            title="Admin Dashboard"
            description="Use Claims Management for live metrics and pending claim review."
        />
    );
}

export function AdminDocuments() {
    return (
        <AdminPlaceholder
            icon={ClipboardList}
            title="Document Oversight"
            description="Review encrypted document uploads and storage usage across all vaults."
        />
    );
}

export function AdminSuccessors() {
    return (
        <AdminPlaceholder
            icon={Users}
            title="Successor Registry"
            description="Manage successor assignments and verification status across user accounts."
        />
    );
}

export function AdminAuditLogs() {
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ["admin-audit-logs"],
        queryFn: getAuditLogs,
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <AdminPlaceholder
            icon={FileSearch}
            title="Audit Logs"
            description="Complete audit trail of vault activity, claims, and admin actions."
        >
            <div className="mt-8 space-y-4 text-left">
                {logs.map((log) => (
                    <article key={log._id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                            <p className="font-bold">{log.action.replace(/_/g, " ")}</p>
                            <p className="text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                            Actor: {log.actorId?.name || "System"} • Entity: {log.entity}
                        </p>
                    </article>
                ))}
            </div>
        </AdminPlaceholder>
    );
}

export function AdminSystemHealth() {
    return (
        <AdminPlaceholder
            icon={Activity}
            title="System Health"
            description="Monitor encryption nodes, backup status, and platform uptime metrics."
        />
    );
}

export function AdminSettings() {
    return (
        <AdminPlaceholder
            icon={Settings}
            title="Admin Settings"
            description="Configure platform policies, verification thresholds, and notification rules."
        />
    );
}
