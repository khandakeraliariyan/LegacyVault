export function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

export function formatCategoryLabel(category = "") {
    return category
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export function calculateVaultReadiness({ successor, questions, documents, finalWishes }) {
    let score = 0;

    if (successor) {
        score += 25;
    }

    if (questions?.length >= 3) {
        score += 35;
    } else if (questions?.length > 0) {
        score += 15;
    }

    if (documents?.length >= 1) {
        score += 25;
    }

    if (finalWishes?.length >= 1) {
        score += 15;
    }

    return Math.min(score, 100);
}
