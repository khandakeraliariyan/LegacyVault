import {
    LayoutDashboard,
    FolderLock,
    Users,
    ShieldQuestion,
    FileText,
    Mail,
    ClipboardCheck,
    Settings,
} from "lucide-react";

export const userSidebar = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Assets & Vault",
        path: "/dashboard/documents",
        icon: FolderLock,
    },
    {
        title: "Trusted Successor",
        path: "/dashboard/successor",
        icon: Users,
    },
    {
        title: "Security Center",
        path: "/dashboard/questions",
        icon: ShieldQuestion,
    },
    {
        title: "Legacy Directives",
        path: "/dashboard/final-wishes",
        icon: FileText,
    },
    {
        title: "Legacy Messages",
        path: "/dashboard/future-messages",
        icon: Mail,
    },
    {
        title: "Inheritance Claims",
        path: "/dashboard/claims",
        icon: ClipboardCheck,
    },
    {
        title: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
    },
];