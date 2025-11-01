import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Plus,
  ArrowDownUp,
  RefreshCw,
  HardDrive,
  Upload,
} from "lucide-react";

function Header() {
  // Controla si el menú desplegable está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);

  // Guarda el tema actual
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Referencia al input oculto (para subir el archivo de la base de datos)
  const fileInputRef = useRef(null);

  // Referencia al contenedor del menú (para detectar clics fuera)
  const menuRef = useRef(null);

  // Ruta actual (para resaltar la sección activa en la navegación)
  const currentPath = window.location.pathname;

  // Enlaces principales de navegación
  const navLinks = [
    { label: "Tier List", href: "/TierList" },
    { label: "Games", href: "/Games" },
    { label: "Hall of Fame", href: "/HallOfFame" },
    { label: "Stats", href: "/Stats" },
  ];

  // Opciones del menú desplegable
  const menuOptions = [
    { label: "Add new game", href: "/AddGame", icon: Plus },
    { label: "Update tier list", href: "/UpdateTier", icon: ArrowDownUp },
    { label: "Update data", href: "/UpdateData", icon: RefreshCw },
    {
      label: "Download DB",
      href: "http://localhost:3001/download-db",
      icon: HardDrive,
    },
    {
      label: "Import DB",
      action: () => fileInputRef.current.click(),
      icon: Upload,
    },
  ];

  // Determina si un link está activo según la ruta actual
  const isActive = (href) => currentPath === href;

  // Cambia el tema y guarda la preferencia en localStorage
  const changeTheme = (newTheme) => setTheme(newTheme);

  // Aplica el tema seleccionado al documento y lo guarda en localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Cierra el menú desplegable si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpieza del listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  /* Manejo de subida de datos (Import DB) */
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("dbfile", file);

    try {
      const res = await fetch("http://localhost:3001/upload-db", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Base de datos importada correctamente");
      } else {
        throw new Error(data.error || "Error en la importación");
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  return (
    <header className="
      fixed top-0 left-0 z-50 w-full 
      border-b border-theme-border
      bg-gradient-to-t from-theme-header-bg-1 via-theme-header-bg-2 to-theme-header-bg-3
      p-3 
      font-mono text-lg font-bold text-gray-100
    ">
      <div className="flex">
        <div className="w-6"/>
        {/* Contenedor de navegación */}
        <div className="flex flex-1 justify-center">
          <nav className="
            flex flex-nowrap items-center justify-center gap-x-10 overflow-hidden whitespace-nowrap
            rounded-lg border border-theme-border
            bg-theme-header-nav-bg
            px-10 py-2 
            inset-shadow-sm inset-shadow-zinc-900 md:gap-x-20
          ">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href)
                    ? "text-theme-header-nav-text-color drop-shadow-theme-header-nav-text-glow"
                    : "hover:text-theme-header-nav-text-hover"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        {/* Menú desplegable */}
        <div className="mr-4 w-6" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-md p-2 transition-colors ${
              menuOpen
                ? "bg-theme-button-hover-1"
                : "hover:bg-theme-button-hover-1 active:bg-theme-button-active-1"
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>

          {menuOpen && (
            <div className="
              absolute right-3 z-10 mt-1 w-52
              rounded-md border border-theme-menu-border
              bg-gradient-to-b from-theme-menu-bg-1 via-theme-menu-bg-2 to-theme-menu-bg-3
              p-2
              shadow-md
            ">
              {/* Bloque de los tres primeros botones */}
              <div className="flex flex-col space-y-2">
                {menuOptions.map(({ label, href, icon: Icon, action }, idx) => {
                  if (label === "Download DB" || label === "Import DB")
                    return null;

                  return (
                    <a
                      key={label}
                      href={href}
                      className="
                        flex items-center gap-x-4 
                        rounded-md 
                        py-2 pl-3 
                        text-sm 
                        transition-colors hover:bg-theme-menu-buttons-hover active:bg-theme-menu-buttons-active"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </a>
                  );
                })}
              </div>

              {/* Divisor */}
              <div className="my-2 border-t-2 border-theme-menu-border" />

              {/* Selector de tema */}
              <div className="flex flex-col space-y-1 px-2">
                <label
                  htmlFor="theme"
                  className="
                    pl-1 
                    text-sm font-semibold text-gray-300
                  ">
                  Tema
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => changeTheme(e.target.value)}
                  className="
                    rounded-md border-2 border-theme-menu-border
                    bg-theme-menu-themeselector-selected-bg
                    px-2 py-1
                    text-sm text-gray-100 
                    hover:bg-theme-menu-themeselector-selected-hover-bg
                  ">
                  <option value="dark_purple">Dark Purple</option>
                  <option value="blue">Blue</option>
                </select>
              </div>

              {/* Divisor */}
              <div className="my-2 border-t-2 border-theme-menu-border" />

              {/* Bloque de Download e Import */}
              {menuOptions.map(({ label, href, icon: Icon, action }, idx) => {
                if (label !== "Download DB" && label !== "Import DB")
                  return null;

                return (
                  <div key={label}>
                    {label === "Download DB" ? (
                      <a
                        href={href}
                        className="
                          flex w-full items-center gap-x-4 
                          rounded-md bg-theme-menu-colorbutton-1
                          py-2 pl-3 
                          text-sm font-semibold text-white 
                          shadow-sm transition-colors 
                          hover:bg-theme-menu-colorbutton-hover-1 active:bg-theme-menu-colorbutton-active-1
                        ">
                        <Icon className="h-5 w-5"/>
                        {label}
                      </a>
                    ) : (
                      <button
                        onClick={action}
                        className="
                          mt-2 flex w-full items-center gap-x-4
                          rounded-md bg-theme-menu-colorbutton-2
                          py-2 pl-3
                          text-sm font-semibold text-white
                          shadow-sm transition-colors
                          hover:bg-theme-menu-colorbutton-hover-2 active:bg-theme-menu-colorbutton-active-2
                        ">
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    )}
                  </div>
                );
              })}
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
