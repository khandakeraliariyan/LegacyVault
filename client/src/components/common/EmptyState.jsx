export default function EmptyState({
    title,
    description,
}) {
    return (
        <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-gray-500">
                {description}
            </p>
        </div>
    );
}