export default function Loading() {
    return (
        <div className="grid min-h-screen place-items-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <span className="size-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
                <p className="text-sm font-medium text-slate-600">Loading...</p>
            </div>
        </div>
    );
}
