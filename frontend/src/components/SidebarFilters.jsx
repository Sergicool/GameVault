import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Determina si un color HEX es oscuro, para decidir si el texto debe ser claro u oscuro encima. */
function isColorDark(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

/**
 * Switch animado
 * - checked: valor actual (boolean)
 * - onChange: callback para cambiar valor
 * - label: texto descriptivo
 */
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`
          flex h-6 w-12 
          cursor-pointer 
          items-center 
          rounded-full 
          p-1 
          ${checked ? "bg-theme-sidebar-switch-1 ring-2 ring-theme-sidebar-ring" : "bg-theme-sidebar-switch-2"} `}
        onClick={onChange}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-4 w-4 rounded-full bg-white shadow-md"
        />
      </motion.div>
      <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
  );
}

/**
 * Muestra un bloque de filtros
 * Props:
 * - title: nombre del grupo
 * - items: array de opciones (strings o { value, color })
 * - selected: valores seleccionados
 * - onToggle: callback al hacer clic
 * - colored: si usa colores personalizados (genres, tiers)
 */
function FilterSection({ title, items, selected, onToggle, colored }) {
  return (
    <div>
      {/* Encabezado de la sección */}
      <h2 className="
        mb-3 
        border-b border-theme-sidebar-divider
        pb-2
        text-sm font-bold tracking-wide text-gray-200 uppercase
      ">
        {title}
      </h2>

      {/* Lista de filtros */}
      <div className="flex max-w-full flex-wrap gap-2">
        {items.map((item) => {
          const value =
            typeof item === "string" || typeof item === "number"
              ? item
              : item.value;
          const color = typeof item === "object" ? item.color : undefined;
          const isActive = selected.includes(value);

          // Determina el color del texto según el fondo
          let textColor = "text-white";
          if (isActive && colored && color) {
            textColor = isColorDark(color) ? "text-white" : "text-black";
          }

          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`rounded-full cursor-pointer px-3 py-1 text-sm font-medium transition ${
                isActive
                  ? colored
                    ? `shadow ${textColor}`
                    : "border border-theme-sidebar-filter-on-border bg-theme-sidebar-filter-on-bg font-bold text-white"
                  : "border border-theme-sidebar-filter-off-border text-gray-300 hover:bg-theme-sidebar-filter-off-bg-hover"
              }`}
              style={{
                backgroundColor:
                  isActive && colored && color ? color : undefined,
                borderColor: colored && color ? color : undefined,
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

function SidebarFilters({
  filters,
  setFilters,
  years,
  genres,
  origins,
  platforms,
  categories,
  subcategories,
  tiers,
  onOpenChange,
}) {
  /* ---------- Estado interno ---------- */
  const [open, setOpen] = useState(false); // visibilidad del sidebar
  const [sidebarWidth, setSidebarWidth] = useState(400); // ancho animado

  /* ---------- Funciones auxiliares ---------- */
  // Alterna un valor dentro de un array de filtros (years, genres, etc.)
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

  // Alterna la opción "ignoreExtensions"
  const toggleIgnoreExtensions = () => {
    setFilters((prev) => ({
      ...prev,
      ignoreExtensions: !prev.ignoreExtensions,
    }));
  };

  const handleToggleSidebar = () => {
    setOpen((o) => {
      onOpenChange(!o);
        return !o;
      });
  }

  return (
    <motion.div
      animate={{ width: open ? 400 : 50 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="
        fixed top-17.5 left-0 z-10 flex flex-col
        h-[calc(100vh-4.4rem)] 
        overflow-y-auto no-scrollbar
        border-r border-theme-sidebar-border
        bg-gradient-to-t from-theme-sidebar-bg-1 to-theme-sidebar-bg-2
        text-white
        shadow-lg
      ">
      {/* ---------- Encabezado ---------- */}
      <div
        className={`
          sticky top-0 z-1 flex items-center justify-between
          bg-theme-sidebar-bg-2
          p-2 
        ${
          open
            ? "border-b border-theme-sidebar-border"
            : ""
        }`}
      >
        {open && (
          <h1 className="text-xl font-semibold whitespace-nowrap text-white">
            Game Filters
          </h1>
        )}

        <button
          onClick={handleToggleSidebar}
          className="
            rounded-md
            bg-theme-sidebar-button
            border border-theme-sidebar-button-border
            p-1.5
            text-white
            shadow-lg transition-all duration-300
            hover:bg-theme-sidebar-button-hover
            active:bg-theme-sidebar-button-active
          ">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* ---------- Contenido de filtros ---------- */}
      {open && (
        <div className="max-w-full space-y-6 p-4">
          {/* Opción global */}
          <ToggleSwitch
            checked={filters.ignoreExtensions || false}
            onChange={toggleIgnoreExtensions}
            label="Ignore Extensions"
          />

          {/* Secciones de filtros */}
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
            title="Platforms"
            items={platforms.map((p) => p.name)}
            selected={filters.platforms}
            onToggle={(val) => toggleFilter("platforms", val)}
          />

          <FilterSection
            title="Categories"
            items={categories.map((c) => c.name)}
            selected={filters.categories}
            onToggle={(val) => toggleFilter("categories", val)}
          />

          {/* Subcategorías dependientes */}
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

export default SidebarFilters;
