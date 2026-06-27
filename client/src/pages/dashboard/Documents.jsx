import {
    ArchiveRestore,
    CheckCheck,
    Download,
    ExternalLink,
    FileImage,
    FileText,
    Lock,
    ShieldAlert,
    Trash2,
    Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import DashboardPageHeader from "../../components/dashboard/DashboardPageHeader";
import DashboardToolbar from "../../components/dashboard/DashboardToolbar";
import Loading from "../../components/common/Loading";
import {
    deleteDocument,
    downloadDocumentFile,
    getDocuments,
    openDocumentFile,
    uploadDocument,
    updateDocumentStatus,
} from "../../services/document.service";
import { getApiErrorMessage } from "../../services/api";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const categoryOptions = [
    { label: "Identity", value: "IDENTITY" },
    { label: "Financial", value: "FINANCIAL" },
    { label: "Insurance", value: "INSURANCE" },
    { label: "Property", value: "PROPERTY" },
    { label: "Business", value: "BUSINESS" },
    { label: "Digital Assets", value: "DIGITAL_ASSETS" },
];

const iconByCategory = {
    IDENTITY: FileText,
    FINANCIAL: FileText,
    INSURANCE: FileText,
    PROPERTY: FileImage,
    BUSINESS: FileText,
    DIGITAL_ASSETS: FileText,
};

const statusOptions = [
    { label: "Active Documents", value: "ACTIVE" },
    { label: "Verified", value: "VERIFIED" },
    { label: "Archived", value: "ARCHIVED" },
    { label: "Action Required", value: "ACTION_REQUIRED" },
    { label: "All Statuses", value: "ALL" },
];

const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Name A-Z", value: "name-asc" },
    { label: "Name Z-A", value: "name-desc" },
    { label: "Category", value: "category" },
    { label: "Status", value: "status" },
];

const categoryFilterOptions = [
    { label: "All Categories", value: "ALL" },
    ...categoryOptions,
];

const pageSize = 8;

export default function Documents() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [uploadCategory, setUploadCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "ALL",
        status: "ALL",
        sortBy: "newest",
    });

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ["documents"],
        queryFn: getDocuments,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document uploaded.");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Upload failed.")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document deleted.");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Delete failed.")),
    });

    const openMutation = useMutation({
        mutationFn: openDocumentFile,
        onSuccess: (blob) => {
            const objectUrl = URL.createObjectURL(blob);
            window.open(objectUrl, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to open file.")),
    });

    const downloadMutation = useMutation({
        mutationFn: async ({ id, name }) => {
            const blob = await downloadDocumentFile(id);
            return {
                blob,
                name,
            };
        },
        onSuccess: ({ blob, name }) => {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to download file.")),
    });

    const statusMutation = useMutation({
        mutationFn: updateDocumentStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success(`Document marked as ${formatStatusLabel(variables.status).toLowerCase()}.`);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Status update failed.")),
    });

    const filteredDocuments = useMemo(() => {
        const query = appliedSearch.trim().toLowerCase();

        const result = documents.filter((document) => {
            const matchesQuery = !query || [
                document.documentName,
                document.category,
                document.status,
                document.fileExtension,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query);

            const matchesCategory =
                filters.category === "ALL" ||
                document.category === filters.category;

            const matchesStatus =
                filters.status === "ALL" ||
                (filters.status === "ACTIVE" && document.status !== "ARCHIVED") ||
                document.status === filters.status;

            return matchesQuery && matchesCategory && matchesStatus;
        });

        return [...result].sort((left, right) => {
            switch (filters.sortBy) {
                case "oldest":
                    return new Date(left.createdAt) - new Date(right.createdAt);
                case "name-asc":
                    return left.documentName.localeCompare(right.documentName);
                case "name-desc":
                    return right.documentName.localeCompare(left.documentName);
                case "category":
                    return left.category.localeCompare(right.category);
                case "status":
                    return left.status.localeCompare(right.status);
                case "newest":
                default:
                    return new Date(right.createdAt) - new Date(left.createdAt);
            }
        });
    }, [appliedSearch, documents, filters]);

    const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedDocuments = filteredDocuments.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );
    const activeFilterCount = [
        filters.category !== "ALL",
        filters.status !== "ALL",
        filters.sortBy !== "newest",
    ].filter(Boolean).length;

    const handleUploadClick = () => {
        if (!uploadCategory) {
            toast.error("Select a document category before uploading.");
            return;
        }

        fileInputRef.current?.click();
    };

    const handleApplySearch = () => {
        setAppliedSearch(searchInput);
        setCurrentPage(1);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        uploadMutation.mutate({
            file,
            documentName: file.name,
            category: uploadCategory,
        });

        event.target.value = "";
    };

    const updateFilter = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            category: "ALL",
            status: "ALL",
            sortBy: "newest",
        });
        setSearchInput("");
        setAppliedSearch("");
        setCurrentPage(1);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Document Vault"
                description="Securely manage and organize your essential legacy files."
                action={
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                            Select category before upload
                        </p>
                        <div className="flex items-center gap-3">
                            <select
                                value={uploadCategory}
                                onChange={(event) => setUploadCategory(event.target.value)}
                                className="h-11 min-w-[220px] rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                                aria-label="Upload category"
                            >
                                <option value="" disabled>
                                    Select category
                                </option>
                                {categoryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleUploadClick}
                                disabled={uploadMutation.isPending}
                                className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2f6b55] px-4 text-sm font-semibold text-white transition hover:bg-[#255743] disabled:opacity-60"
                            >
                                <Upload size={15} />
                                {uploadMutation.isPending ? "Uploading..." : "Upload File"}
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                }
            />

            <DashboardToolbar
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={handleApplySearch}
                onFilterClick={() => setShowFilters((value) => !value)}
                filterActive={showFilters || activeFilterCount > 0}
                searchPlaceholder="Search across all legacy files..."
                action={
                    <button className="inline-flex h-10 items-center rounded-[8px] bg-[#2f6b55] px-4 text-xs font-semibold text-white transition hover:bg-[#255743]">
                        Search
                    </button>
                }
                aside={
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d4e7de] bg-[#eef9f4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2f6b55]">
                            <Lock size={11} />
                            End-to-End Encrypted
                        </span>
                    </div>
                }
            />

            {showFilters ? (
                <section className="mt-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Filter Documents
                        </h2>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <FilterField
                            label="Category"
                            value={filters.category}
                            onChange={(value) => updateFilter("category", value)}
                            options={categoryFilterOptions}
                        />
                        <FilterField
                            label="Status"
                            value={filters.status}
                            onChange={(value) => updateFilter("status", value)}
                            options={statusOptions}
                        />
                        <FilterField
                            label="Sort By"
                            value={filters.sortBy}
                            onChange={(value) => updateFilter("sortBy", value)}
                            options={sortOptions}
                        />
                    </div>
                </section>
            ) : null}

            <section className="mt-6 overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="grid grid-cols-[minmax(0,2.3fr)_1fr_0.9fr_0.9fr_1.4fr] gap-4 border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>File Name</span>
                    <span>Category</span>
                    <span>Date Added</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {paginatedDocuments.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {paginatedDocuments.map((document) => {
                            const Icon = iconByCategory[document.category] || FileText;
                            const statusMeta = getStatusMeta(document.status);

                            return (
                                <div
                                    key={document._id}
                                    className="grid grid-cols-[minmax(0,2.3fr)_1fr_0.9fr_0.9fr_1.4fr] gap-4 px-4 py-4 text-sm"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[6px] border border-slate-200 bg-white text-slate-500">
                                            <Icon size={14} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900">
                                                {document.documentName}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {formatDocumentSize(document)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-0.5">
                                        <span className="inline-flex rounded-[6px] border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                                            {formatCategoryLabel(document.category)}
                                        </span>
                                    </div>

                                    <div className="pt-0.5 text-slate-600">
                                        {formatDate(document.createdAt)}
                                    </div>

                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusMeta.badgeClass}`}>
                                            <span className="size-1.5 rounded-full bg-current" />
                                            {statusMeta.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs">
                                        <IconActionButton
                                            label={`Open ${document.documentName}`}
                                            onClick={() => openMutation.mutate(document._id)}
                                            disabled={openMutation.isPending}
                                        >
                                            <ExternalLink size={15} />
                                        </IconActionButton>
                                        <IconActionButton
                                            label={`Download ${document.documentName}`}
                                            onClick={() => downloadMutation.mutate({
                                                id: document._id,
                                                name: document.documentName,
                                            })}
                                            disabled={downloadMutation.isPending}
                                        >
                                            <Download size={15} />
                                        </IconActionButton>
                                        <button
                                            onClick={() => statusMutation.mutate({
                                                id: document._id,
                                                status: getNextStatus(document.status),
                                            })}
                                            disabled={statusMutation.isPending}
                                            title={`${getStatusActionLabel(document.status)} ${document.documentName}`}
                                            aria-label={`${getStatusActionLabel(document.status)} ${document.documentName}`}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#2f6b55] disabled:opacity-60"
                                        >
                                            {getStatusActionIcon(document.status)}
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(document._id)}
                                            disabled={deleteMutation.isPending}
                                            title={`Delete ${document.documentName}`}
                                            aria-label={`Delete ${document.documentName}`}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        {documents.length === 0
                            ? "No documents found. Upload your first secure file."
                            : "No documents match the current search and filter settings."}
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                    <span>
                        Showing {filteredDocuments.length > 0
                            ? `${(safeCurrentPage - 1) * pageSize + 1}-${Math.min(safeCurrentPage * pageSize, filteredDocuments.length)}`
                            : "0"} of {filteredDocuments.length} files
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={safeCurrentPage === 1}
                            className="grid size-7 place-items-center rounded-md border border-transparent transition hover:border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {"<"}
                        </button>
                        <span className="px-2 text-[11px] font-medium text-slate-500">
                            Page {safeCurrentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            disabled={safeCurrentPage === totalPages}
                            className="grid size-7 place-items-center rounded-md border border-transparent transition hover:border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function IconActionButton({ children, disabled, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#2f6b55] disabled:opacity-60"
        >
            {children}
        </button>
    );
}

function formatDocumentSize(document) {
    const size = document.fileSize || document.size;

    if (!size) {
        return "Encrypted file";
    }

    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (size >= 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${size} B`;
}

function FilterField({ label, onChange, options, value }) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 h-11 w-full rounded-[10px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#2f6b55]"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function getStatusMeta(status = "VERIFIED") {
    switch (status) {
        case "ARCHIVED":
            return {
                label: "Archived",
                badgeClass: "bg-slate-100 text-slate-600",
            };
        case "ACTION_REQUIRED":
            return {
                label: "Action Required",
                badgeClass: "bg-rose-50 text-rose-600",
            };
        case "VERIFIED":
        default:
            return {
                label: "Verified",
                badgeClass: "bg-emerald-50 text-[#2f6b55]",
            };
    }
}

function getStatusActionLabel(status = "VERIFIED") {
    if (status === "ARCHIVED") {
        return "Restore";
    }

    if (status === "ACTION_REQUIRED") {
        return "Mark Verified";
    }

    return "Archive";
}

function getStatusActionIcon(status = "VERIFIED") {
    if (status === "ARCHIVED") {
        return <ArchiveRestore size={14} />;
    }

    if (status === "ACTION_REQUIRED") {
        return <CheckCheck size={14} />;
    }

    return <ShieldAlert size={14} />;
}

function getNextStatus(status = "VERIFIED") {
    if (status === "ARCHIVED") {
        return "VERIFIED";
    }

    if (status === "ACTION_REQUIRED") {
        return "VERIFIED";
    }

    return "ARCHIVED";
}

function formatStatusLabel(status = "VERIFIED") {
    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
