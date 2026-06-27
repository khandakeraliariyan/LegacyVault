import { Search, SlidersHorizontal } from "lucide-react";

export default function DashboardToolbar({
    filterActive = false,
    onFilterClick,
    onSearchSubmit,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    action,
    aside,
}) {
    return (
        <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-6">
            <form
                className="flex flex-col gap-3 xl:flex-row xl:items-center"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSearchSubmit?.();
                }}
            >
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
                    {onFilterClick ? (
                        <button
                            type="button"
                            onClick={onFilterClick}
                            className={`inline-flex h-12 items-center justify-center rounded-[10px] border px-4 transition ${filterActive
                                ? "border-[#2f6b55] bg-[#eef9f4] text-[#2f6b55]"
                                : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700"
                                }`}
                        >
                            <SlidersHorizontal size={17} />
                        </button>
                    ) : null}
                </div>
            </form>

            {aside ? aside : null}
        </div>
    );
}
