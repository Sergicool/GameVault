import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SidebarFilters({
    filters,
    setFilters,
    years,
    genres,
    origins,
    categories,
    subcategories,
    tiers,
}) {
    const [open, setOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(400); // ancho inicial

    const toggleFilter = (type, value) => {
        setFilters((prev) => {
            const current = prev[type] || [];
            return {
                ...prev,
                [type]: current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value],
            };
        });
    };

    return (
        <motion.div
            animate={{ width: open ? sidebarWidth : 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="h-[calc(100vh-4.4rem)] bg-gray-900 text-white fixed top-17.5 left-0
                 shadow-lg flex flex-col overflow-y-auto overflow-x-hidden z-10"
        >
            {/* Encabezado con título y botón toggle */}
            <div
                className={`flex justify-between items-center p-2 sticky top-0 bg-gray-900 z-20 ${open ? "border-b border-gray-500" : ""
                    }`}
            >
                {/* Título solo si open es true */}
                {open && (
                    <h1 className="text-white text-xl font-semibold">
                        Game Filters
                    </h1>
                )}

                {/* Botón toggle a la derecha */}
                <button
                    onClick={() => setOpen(!open)}
                    className="bg-gray-700 text-white p-2 rounded-md shadow-lg hover:bg-gray-600 transition-all duration-300"
                >
                    {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Contenido del sidebar */}
            {open && (
                <div className="p-4 space-y-6 max-w-full">
                    <FilterSection
                        title="Years"
                        items={years.map((y) => y.year)}
                        selected={filters.years}
                        onToggle={(val) => toggleFilter("years", val)}
                    />

                    <FilterSection
                        title="Genres"
                        items={genres.map((g) => ({ value: g.name, color: g.color }))}
                        selected={filters.genres}
                        onToggle={(val) => toggleFilter("genres", val)}
                        colored
                    />

                    <FilterSection
                        title="Origins"
                        items={origins.map((o) => o.name)}
                        selected={filters.origins}
                        onToggle={(val) => toggleFilter("origins", val)}
                    />

                    <FilterSection
                        title="Categories"
                        items={categories.map((c) => c.name)}
                        selected={filters.categories}
                        onToggle={(val) => toggleFilter("categories", val)}
                    />

                    {filters.categories.length > 0 && (
                        <FilterSection
                            title="Subcategories"
                            items={subcategories
                                .filter((sc) => filters.categories.includes(sc.category))
                                .map((sc) => sc.name)}
                            selected={filters.subcategories}
                            onToggle={(val) => toggleFilter("subcategories", val)}
                        />
                    )}

                    <FilterSection
                        title="Tiers"
                        items={tiers.map((t) => ({ value: t.name, color: t.color }))}
                        selected={filters.tiers}
                        onToggle={(val) => toggleFilter("tiers", val)}
                        colored
                    />
                </div>
            )}
        </motion.div>
    );
}

function FilterSection({ title, items, selected, onToggle, colored }) {
    return (
        <div>
            <h2 className="text-sm uppercase tracking-wide font-bold text-gray-400 mb-3 border-b border-gray-700 pb-1">
                {title}
            </h2>
            <div className="flex flex-wrap gap-2 max-w-full">
                {items.map((item) => {
                    const value =
                        typeof item === "string" || typeof item === "number"
                            ? item
                            : item.value;
                    const color = typeof item === "object" ? item.color : undefined;
                    const isActive = selected.includes(value);

                    return (
                        <button
                            key={value}
                            onClick={() => onToggle(value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition 
                ${isActive
                                    ? "text-white shadow"
                                    : "text-gray-300 border border-gray-600 hover:bg-gray-700"}`}
                            style={{
                                backgroundColor: isActive && color ? color : "transparent",
                                borderColor: color || undefined,
                            }}
                        >
                            {value}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SidebarFilters;
