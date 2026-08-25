import React, { useState } from "react";

const categories = [
    "Barchasi",
    "Dasturlash",
    "Spring Boot",
    "React JS",
    "Musiqa",
    "O'yinlar",
    "Aqlbovar qilmas",
    "Yangiliklar",
    "Podkastlar",
    "Kinolardan parchalar",
    "Ta'lim",
    "Dizayn",
];

interface Props {
    onSelectCategory?: (category: string) => void;
}

export const CategoryChips: React.FC<Props> = ({ onSelectCategory }) => {
    const [selected, setSelected] = useState("Barchasi");

    const handleSelect = (category: string) => {
        setSelected(category);
        if (onSelectCategory) onSelectCategory(category);
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
                const isActive = selected === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => handleSelect(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                            isActive
                                ? "bg-white text-black font-semibold"
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