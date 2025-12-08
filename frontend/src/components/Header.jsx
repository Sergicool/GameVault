import { useEffect, useRef, useState } from "react";
import { Menu, Plus, ArrowDownUp, RefreshCw, HardDrive, Upload, Check, ChevronsUpDown } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { useLocation } from "react-router-dom";

// Definir tus temas de manera centralizada
const themes = [
  { id: "indigo", name: "Indigo", color: "bg-violet-700" },
  { id: "blue", name: "Blue", color: "bg-blue-600" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const { pathname: currentPath } = useLocation();

  const navLinks = [
    { label: "Tier List", href: "/TierList" },
    { label: "Games", href: "/Games" },
    { label: "Hall of Fame", href: "/HallOfFame" },
    { label: "Stats", href: "/Stats" },
  ];

  const menuOptions = [
    { label: "Add new game", href: "/AddGame", icon: Plus },
    { label: "Update tier list", href: "/UpdateTier", icon: ArrowDownUp },
    { label: "Update data", href: "/UpdateData", icon: RefreshCw },
    { label: "Download Data", href: "http://localhost:3001/download-db", icon: HardDrive },
    { label: "Import Data", action: () => fileInputRef.current.click(), icon: Upload },
  ];

  const isActive = (href) => currentPath === href;

  const changeTheme = (newTheme) => setTheme(newTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("dbfile", file);
    try {
      const res = await fetch("http://localhost:3001/upload-db", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) alert("✅ Base de datos importada correctamente");
      else throw new Error(data.error || "Error en la importación");
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  const selectedTheme = themes.find((t) => t.id === theme);

  return (
    <header className="
      fixed top-0 left-0 z-50 w-full 
      border-b border-theme-header-border 
      bg-gradient-to-t from-theme-header-bg-1 to-theme-header-bg-2 
      p-3 
      font-mono text-lg font-bold
      shadow-[var(--shadow-theme-header-shadow)]
    ">
      <div className="flex">
        <div className="flex w-12 items-center justify-center">
          <img
            src="/GameVaultLogo.png"
            className="h-10 w-10 object-contain"
          />
        </div>

        {/* Contenedor de navegación */}
        <div className="flex flex-1 justify-center">
          <nav
            className="
              flex flex-nowrap items-center justify-center gap-x-10
              overflow-hidden whitespace-nowrap rounded-lg
              border border-theme-header-border
              bg-theme-header-inner-bg
              px-10 py-2 md:gap-x-20
              text-theme-header-text
              inset-shadow-sm inset-shadow-zinc-900
            "
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href)
                    ? "text-theme-header-text-active [filter:drop-shadow(var(--drop-theme-header-text-glow))]"
                    : "hover:text-theme-header-text-hover"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Menú desplegable */}
        <div className="w-12 relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-md p-2 transition-colors ${
              menuOpen
                ? "bg-theme-button-hover"
                : "hover:bg-theme-button-hover active:bg-theme-button-active"
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-2 z-10 mt-1 w-52 rounded-md border border-theme-menu-border bg-gradient-to-t from-theme-menu-bg-1 to-theme-menu-bg-2 p-2 shadow-md">
              {/* Bloque de botones */}
              <div className="flex flex-col space-y-2">
                {menuOptions
                  .filter(({ label }) => label !== "Download Data" && label !== "Import Data")
                  .map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-x-4 rounded-md py-2 pl-3 text-sm transition-colors hover:bg-theme-menu-buttons-hover active:bg-theme-menu-buttons-active"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </a>
                  ))}
              </div>

              <div className="my-2 border-t-2 border-theme-menu-border" />

              {/* Selector de tema con HeadlessUI */}
              <div className="flex flex-col space-y-1 px-2">
                <label className="pl-1 text-sm font-semibold text-theme-menu-themeselector-title-text">Theme</label>
                <Listbox value={theme} onChange={changeTheme}>
                  <div className="relative">
                    <ListboxButton className="
                      relative w-full
                      cursor-pointer
                      rounded-md
                      border-2 border-theme-menu-border
                      bg-theme-menu-themeselector-selected-bg
                      px-2 py-1 text-left
                      text-sm text-gray-100
                      hover:bg-theme-menu-themeselector-selected-hover-bg">
                      <span>{selectedTheme?.name}</span>
                      <ChevronsUpDown className="absolute right-2 top-1.5 h-4 w-4 opacity-70" />
                    </ListboxButton>

                    <ListboxOptions className="
                      absolute z-10 mt-1 w-full overflow-hidden
                      rounded-md
                      border-2 border-theme-menu-border
                      bg-theme-menu-bg-1 shadow-[var(--shadow-theme-menu-shadow)]
                      backdrop-blur-sm">
                      {themes.map((t) => (
                        <ListboxOption
                          key={t.id}
                          value={t.id}
                          className={({ active }) => `
                            flex items-center justify-between
                            cursor-pointer select-none
                            px-3 py-2
                            transition-all duration-100
                            text-sm
                            ${active ? "bg-theme-menu-themeselector-option-hover-bg text-white" : "text-theme-menu-text"}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center gap-2">
                              <span>{t.name}</span>
                              {selected && <Check size={14} className="opacity-80" />}
                            </div>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              <div className="my-2 border-t-2 border-theme-menu-border" />

              {/* Bloque Download e Import */}
              {menuOptions
                .filter(({ label }) => label === "Download Data" || label === "Import Data")
                .map(({ label, href, icon: Icon, action }) => (
                  <div key={label}>
                    {label === "Download Data" ? (
                      <a
                        href={href}
                        className="
                          flex w-full items-center gap-x-4
                          rounded-md
                          bg-theme-menu-colorbutton-1
                          py-2 pl-3
                          text-sm font-semibold text-white shadow-sm
                          transition-colors
                          hover:bg-theme-menu-colorbutton-hover-1
                          active:bg-theme-menu-colorbutton-active-1
                        ">
                        <Icon className="h-5 w-5" />
                        {label}
                      </a>
                    ) : (
                      <button
                        onClick={action}
                        className="
                          mt-2 flex w-full items-center gap-x-4
                          rounded-md
                          bg-theme-menu-colorbutton-2
                          py-2 pl-3
                          text-sm font-semibold text-white shadow-sm
                          transition-colors
                          hover:bg-theme-menu-colorbutton-hover-2
                          active:bg-theme-menu-colorbutton-active-
                        ">
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Input oculto para subir archivo */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".db"
        onChange={handleFileChange}
      />
    </header>
  );
}

export default Header;
