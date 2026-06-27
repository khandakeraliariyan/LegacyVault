import {
    FileImage,
    FileText,
    Lock,
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
    getDocuments,
    uploadDocument,
} from "../../services/document.service";
import { getApiErrorMessage } from "../../services/api";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const categoryOptions = [
    { label: "Legal", value: "IDENTITY" },
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

export default function Documents() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [search, setSearch] = useState("");
    const [uploadCategory, setUploadCategory] = useState("IDENTITY");

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

    const filteredDocuments = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return documents;
        }

        return documents.filter((document) =>
            `${document.documentName} ${document.category}`.toLowerCase().includes(query)
        );
    }, [documents, search]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
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

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="mx-auto max-w-[1120px]">
            <DashboardPageHeader
                title="Document Vault"
                description="Securely manage and organize your essential legacy files."
                action={
                    <div className="flex items-center gap-3">
                        <select
                            value={uploadCategory}
                            onChange={(event) => setUploadCategory(event.target.value)}
                            className="h-11 rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                        >
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
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search across all legacy files..."
                action={
                    <button className="inline-flex h-10 items-center rounded-[8px] bg-[#2f6b55] px-4 text-xs font-semibold text-white transition hover:bg-[#255743]">
                        Search
                    </button>
                }
                aside={
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d4e7de] bg-[#eef9f4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2f6b55]">
                            <Lock size={11} />
                            End-to-End Encrypted
                        </span>
                    </div>
                }
            />

            <section className="mt-6 overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="grid grid-cols-[minmax(0,2.6fr)_1.1fr_1fr_1fr] gap-4 border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>File Name</span>
                    <span>Category</span>
                    <span>Date Added</span>
                    <span>Status</span>
                </div>

                {filteredDocuments.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {filteredDocuments.slice(0, 8).map((document) => {
                            const Icon = iconByCategory[document.category] || FileText;
                            const statusTone = document.category === "DIGITAL_ASSETS"
                                ? "bg-rose-50 text-rose-600"
                                : "bg-emerald-50 text-[#2f6b55]";

                            return (
                                <div
                                    key={document._id}
                                    className="grid grid-cols-[minmax(0,2.6fr)_1.1fr_1fr_1fr] gap-4 px-4 py-4 text-sm"
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

                                    <div className="flex items-center justify-between gap-3">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone}`}>
                                            <span className="size-1.5 rounded-full bg-current" />
                                            {document.category === "DIGITAL_ASSETS" ? "Action Required" : "Verified"}
                                        </span>
                                        <button
                                            onClick={() => deleteMutation.mutate(document._id)}
                                            disabled={deleteMutation.isPending}
                                            className="text-slate-400 transition hover:text-rose-600"
                                            aria-label={`Delete ${document.documentName}`}
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
                        No documents found. Upload your first secure file.
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                    <span>
                        Showing {filteredDocuments.length > 0 ? `1-${Math.min(filteredDocuments.length, 8)}` : "0"} of {filteredDocuments.length} files
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="grid size-7 place-items-center rounded-md border border-transparent transition hover:border-slate-200 hover:bg-slate-50">
                            {"<"}
                        </button>
                        <button className="grid size-7 place-items-center rounded-md border border-transparent transition hover:border-slate-200 hover:bg-slate-50">
                            {">"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
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
