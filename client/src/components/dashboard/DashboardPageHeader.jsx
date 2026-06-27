export default function DashboardPageHeader({
    title,
    description,
    action,
}) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-slate-900">
                    {title}
                </h1>
                {description ? (
                    <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-500">
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? (
                <div className="shrink-0">
                    {action}
                </div>
            ) : null}
        </div>
    );
}
