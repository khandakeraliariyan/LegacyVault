import { Search, SlidersHorizontal } from "lucide-react";

export default function DashboardToolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    action,
    aside,
}) {
    return (
        <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="relative min-w-0 flex-1">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={searchValue}
                        onChange={(event) => onSearchChange?.(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="h-12 w-full rounded-[10px] border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2f6b55]"
                    />
                </label>

                <div className="flex items-center gap-3">
                    {action ? action : null}
                    <button
                        type="button"
                        className="inline-flex h-12 items-center justify-center rounded-[10px] border border-slate-300 bg-white px-4 text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
                    >
                        <SlidersHorizontal size={17} />
                    </button>
                </div>
            </div>

            {aside ? aside : null}
        </div>
    );
}
