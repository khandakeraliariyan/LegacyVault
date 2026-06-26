import {
    Download,
    Eye,
    FileImage,
    FileText,
    Lock,
    Trash2,
    UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";
import {
    deleteDocument,
    getDocuments,
    uploadDocument,
} from "../../services/document.service";
import { getApiErrorMessage } from "../../services/api";
import { formatCategoryLabel, formatDate } from "../../utils/format";

const filters = ["All Documents", "Identity", "Financial", "Insurance", "Property", "Business", "Digital Assets"];

const categoryMap = {
    Identity: "IDENTITY",
    Financial: "FINANCIAL",
    Insurance: "INSURANCE",
    Property: "PROPERTY",
    Business: "BUSINESS",
    "Digital Assets": "DIGITAL_ASSETS",
};

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
    const [activeFilter, setActiveFilter] = useState("All Documents");
    const [uploadCategory, setUploadCategory] = useState("IDENTITY");

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ["documents"],
        queryFn: getDocuments,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document uploaded");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Upload failed")),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast.success("Document deleted");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Delete failed")),
    });

    const filtered = documents.filter(
        (doc) => activeFilter === "All Documents" || doc.category === categoryMap[activeFilter]
    );

    const handleUploadClick = () => fileInputRef.current?.click();

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
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Document Vault</h1>
                    <p className="mt-2 text-base text-slate-600">Manage and secure your most important digital assets.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={uploadCategory}
                        onChange={(event) => setUploadCategory(event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 px-4 text-sm"
                    >
                        {Object.entries(categoryMap).map(([label, value]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleUploadClick}
                        disabled={uploadMutation.isPending}
                        className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                    >
                        <FileText size={18} />
                        {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-6 py-2 text-sm font-bold transition ${
                            activeFilter === filter
                                ? "bg-emerald-700 text-white"
                                : "bg-blue-50 text-slate-700 hover:bg-blue-100"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-slate-600">No documents yet. Upload your first encrypted document.</p>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((doc) => {
                        const Icon = iconByCategory[doc.category] || FileText;

                        return (
                            <article key={doc._id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-start justify-between">
                                    <span className="grid size-11 place-items-center rounded-lg bg-slate-50 text-emerald-700">
                                        <Icon size={23} />
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase text-emerald-700">
                                        <Lock size={10} />
                                        Encrypted
                                    </span>
                                </div>
                                <h2 className="mt-8 text-lg font-bold">{doc.documentName}</h2>
                                <p className="mt-2 text-sm text-slate-600">Added: {formatDate(doc.createdAt)}</p>
                                <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-5">
                                    <span className="rounded-full bg-blue-50 px-4 py-1 text-[11px] font-bold uppercase text-blue-700">
                                        {formatCategoryLabel(doc.category)}
                                    </span>
                                    <div className="flex gap-4 text-slate-700">
                                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
                                            <Eye size={15} />
                                        </a>
                                        <a href={doc.fileUrl} download className="hover:text-emerald-700">
                                            <Download size={15} />
                                        </a>
                                        <button
                                            onClick={() => deleteMutation.mutate(doc._id)}
                                            className="hover:text-red-600"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <button
                onClick={handleUploadClick}
                className="mt-8 grid min-h-36 w-full place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30 transition hover:border-emerald-300 hover:bg-emerald-50/20"
            >
                <div className="text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <UploadCloud size={30} />
                    </span>
                    <p className="mt-4 text-sm font-bold text-slate-700">Drag & drop files here or click to upload</p>
                </div>
            </button>
        </div>
    );
}
