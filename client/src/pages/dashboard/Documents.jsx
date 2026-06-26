import {
    Download,
    Eye,
    FileImage,
    FileText,
    Lock,
    Trash2,
    UploadCloud,
} from "lucide-react";
import { useState } from "react";

const allDocuments = [
    ["Last Will & Testament.pdf", "Added: Oct 12, 2023", "Identity", "text-red-600", FileText],
    ["Property Title Deed.jpg", "Added: Jan 05, 2024", "Property", "text-emerald-700", FileImage],
    ["Insurance Policy Q4.pdf", "Added: Dec 15, 2023", "Insurance", "text-blue-600", FileText],
    ["Trust Agreement - Final.pdf", "Added: Nov 22, 2023", "Financial", "text-slate-700", FileText],
    ["Business License.pdf", "Added: Feb 01, 2024", "Business", "text-amber-700", FileText],
    ["Crypto Wallet Keys.txt", "Added: Mar 10, 2024", "Digital Assets", "text-purple-700", FileText],
];

const filters = ["All Documents", "Identity", "Financial", "Insurance", "Property", "Business", "Digital Assets"];

export default function Documents() {
    const [activeFilter, setActiveFilter] = useState("All Documents");

    const documents = allDocuments.filter(
        ([,, category]) => activeFilter === "All Documents" || category === activeFilter
    );

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Document Vault</h1>
                    <p className="mt-2 text-base text-slate-600">Manage and secure your most important digital assets.</p>
                </div>
                <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 font-bold text-white transition hover:bg-emerald-800">
                    <FileText size={18} />
                    Upload Document
                </button>
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

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {documents.map(([title, date, category, color, Icon]) => (
                    <article key={title} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between">
                            <span className={`grid size-11 place-items-center rounded-lg bg-slate-50 ${color}`}>
                                <Icon size={23} />
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase text-emerald-700">
                                <Lock size={10} />
                                Encrypted
                            </span>
                        </div>
                        <h2 className="mt-8 text-lg font-bold">{title}</h2>
                        <p className="mt-2 text-sm text-slate-600">{date}</p>
                        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-5">
                            <span className="rounded-full bg-blue-50 px-4 py-1 text-[11px] font-bold uppercase text-blue-700">{category}</span>
                            <div className="flex gap-4 text-slate-700">
                                <Eye size={15} />
                                <Download size={15} />
                                <Trash2 size={15} />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-8 grid min-h-36 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-blue-50/30 transition hover:border-emerald-300 hover:bg-emerald-50/20">
                <div className="text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <UploadCloud size={30} />
                    </span>
                    <p className="mt-4 text-sm font-bold text-slate-700">Drag & drop files here or click to upload</p>
                </div>
            </div>
        </div>
    );
}
