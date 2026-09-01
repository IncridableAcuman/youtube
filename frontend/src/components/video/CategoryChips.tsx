import React from "react";

// src/constants/categories.ts
// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORIES = [
    "Barchasi",
    "Dasturlash",
    "Spring Boot",
    "React JS",
    "Musiqa",
    "O'yinlar",
    "Kino va Film",
    "Yangiliklar",
    "Podkastlar",
    "Ta'lim",
    "Dizayn",
    "Sport",
] as const;

interface Props {
    selectedCategory?: string;
    onSelectCategory?: (category: string) => void;
}

export const CategoryChips: React.FC<Props> = ({
    selectedCategory = "Barchasi",
    onSelectCategory,
}) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onSelectCategory?.(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                            isActive
                                ? "bg-white text-zinc-950 font-semibold shadow"
                                : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200"
                        }`}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
};