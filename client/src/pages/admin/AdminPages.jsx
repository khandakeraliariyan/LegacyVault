import { Activity, ClipboardList, FileSearch, LayoutDashboard, Settings, Users } from "lucide-react";

function AdminPlaceholder({ description, icon: Icon, title }) {
    return (
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon size={32} />
            </span>
            <h1 className="mt-6 text-2xl font-bold">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}

export function AdminDashboard() {
    return (
        <AdminPlaceholder
            icon={LayoutDashboard}
            title="Admin Dashboard"
            description="Overview metrics and system-wide vault statistics will appear here."
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
    return (
        <AdminPlaceholder
            icon={FileSearch}
            title="Audit Logs"
            description="View a complete audit trail of vault activity, claims, and admin actions."
        />
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
