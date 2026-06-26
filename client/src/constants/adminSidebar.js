import {
    Activity,
    ClipboardList,
    FileSearch,
    LayoutDashboard,
    Lock,
    Settings,
    Shield,
    Users,
} from "lucide-react";

export const adminSidebar = [
    {
        title: "Claims Management",
        path: "/admin",
        icon: Lock,
    },
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Documents",
        path: "/admin/documents",
        icon: ClipboardList,
    },
    {
        title: "Successors",
        path: "/admin/successors",
        icon: Users,
    },
    {
        title: "Audit Logs",
        path: "/admin/audit-logs",
        icon: FileSearch,
    },
    {
        title: "System Health",
        path: "/admin/system-health",
        icon: Activity,
    },
    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];
